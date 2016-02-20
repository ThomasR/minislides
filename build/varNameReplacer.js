/**
* quick'n'dirty variable name replacer:
*   function(e,t,n,o,a,d,r,l,c,i,s,u,f,h){
* ->
*   function(m,i,n,í,s,l,ì,d,e,ѕ,_,F,T,W){
*/
'use strict';

const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const escope = require('escope');

const util = require('./util');

// const target = 'miníslìdeѕ_FTWǃ'; // this looks better but has more bytes per char in utf-8 ಠ_ಠ
const target = 'mIniSlydesFTW_$';

module.exports = input => {
    // create syntax tree and scope analysis
    let ast = esprima.parse(input);
    var scopes = escope.analyze(ast).scopes;

    // Determine global identifiers.
    let globalNames = scopes.filter(scope => scope.implicit && scope.implicit.left).reduce((result, scope) => {
        let found = scope.implicit.left.map(global => global.identifier.name);
        return result.concat(found);
    }, []);
    globalNames.forEach(global => {
        if (global.length === 1 && target.indexOf(global) > -1) {
            // This is too dangerous
            throw new Error(`Cannot replace global variable "${global}"`);
        }
    });

    // get local variables (AST nodes)
    let locals = scopes.reduce((result, scope) => {
        scope.variables.filter(v => v.name !== 'arguments').forEach(variable => {
            if (result.indexOf(variable) == -1) {
                result.push(variable);
            }
        });
        return result;
    }, []);

    // replace a node's variable name by the given letter
    // Also replace all occurrences of the same variable in the whole tree
    let replaceName = (variable, letter) => {
        if (variable.name === letter) {
            return;
        }
        //console.log(`replacing ${variable.name} -> ${letter}`);
        let ids = variable.references.map(r => r.identifier).concat(variable.identifiers).concat([variable]);
        ids.forEach(id => id.name = letter);
    };

    // carry out the replacement
    let targetLetters = target.split('');
    targetLetters.forEach((letter, i) => {
        let candidate = locals[i];
        if (!candidate) {
            throw new Error('Not enough variables to replace');
        }
        replaceName(candidate, letter);
        let taken = locals.map(l => l.name).concat(globalNames).concat(targetLetters);
        let freeLetter = util.getFreeLetter(taken);
        locals.forEach(local => {
            if (local !== candidate && local.name === letter) {
                replaceName(local, freeLetter);
            }
        });
    });

    // serialize result
    return escodegen.generate(ast, {
        format: {
            compact: true,
            quotes: 'double',
            semicolons: false
        }
    });
};
