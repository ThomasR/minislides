/**
 * Compression helper that
 * - wraps everything in a IIFE
 *     (function (…) {})();
 * - replaces attributes of the form
 *     f.foobarbaz -> var x = 'foobarbaz'; f[x]
 *   while considering whether this is advantageous for compression
 * - replaces the first "var" line
 *     var foo, bar, baz = 'qux' -> (function (baz, foo, bar) {})('qux');
 *
 */
'use strict';
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');

const util = require('isogrammify/lib/util');

module.exports = function (code) {
    let ast = esprima.parse(code);
    let attrs = Object.create(null);
    let identifiers = [];
    estraverse.traverse(ast, {
        enter: node => {
            if (node.type == estraverse.Syntax.Identifier) {
                if (identifiers.indexOf(node.name) == -1) {
                    identifiers.push(node.name);
                }
            }
            if (node.type !== estraverse.Syntax.MemberExpression || node.computed) {
                return;
            }
            let name = node.property.name;
            let existing = attrs[name];
            if (!existing) {
                attrs[name] = [];
            }
            attrs[name].push(node);
        }
    });

    // filter out the attributes that are beneficial for compression
    let vars = [];
    let strings = [];
    Object.keys(attrs).forEach(key => {
        let occurrences = attrs[key];
        let count = occurrences.length;
        // We only get smaller code if length * (count - 1) > (2*count + 5) :
        // .attr -> [x]  // -c*(l-2) = 2c-lc
        // (function (,x) {}(,"attr")  // +5+l
        // 2c-lc + 5+l < 0 <=> l(c-1) > 2c+5
        if (key.length * (count - 1) > (2 * count + 5)) {
            let varName = util.getFreeLetter(identifiers);
            occurrences.forEach(node => {
                node.computed = true;
                node.property.name = varName;
            });
            identifiers.push(varName);
            vars.push(varName);
            strings.push(`"${key}"`);
        }
    });

    // move first variable statement to attributes (this only works with string values ATM)
    let target;
    let varDecl = [];
    estraverse.traverse(ast, {
        enter: node => {
            if (target) {
                return;
            }
            if (node.type === estraverse.Syntax.VariableDeclarator) {
                let value;
                if (node.init) {
                    value = node.init.name || node.init.raw;
                }
                varDecl.push({name: node.id.name, value: value});
            }
        },
        leave: node => {
            if (node.type === estraverse.Syntax.VariableDeclaration) {
                target = node;
            }
        }
    });
    estraverse.replace(ast, {
        enter: node => {
            if (node === target) {
                return estraverse.VisitorOption.Remove;
            }
        }
    });
    varDecl.sort((a, b) => {
        if (typeof a.value == 'undefined') {
            return typeof b.value == 'undefined' ? 0 : 1;
        }
        return typeof b.value == 'undefined' ? -1 : 0;
    });
    vars = vars.concat(varDecl.map(x => x.name));
    strings = strings.concat(varDecl.map(x => x.value).filter(x => x));

    let f = escodegen.generate(ast, {
        format: {
            compact: true,
            quotes: 'double',
            semicolons: false
        }
    });
    return `(function (${vars.join(', ')}) {${f}})(${strings. join(', ')});`;
};
