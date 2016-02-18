/**
* quick'n'dirty variable name replacer:
*   function(e,a,t,n,c,o,s,r,d,i,l,u,f,h,m){
* ->
*   function(m,i,n,í,s,l,ì,d,e,ş,_,R,O,C,K){
*
* Do not try this at home, as it will replace all one-letter identifiers, including property names!
* Things like `Math.E` and `foo.b()` will break.
*/
'use strict';

const esprima = require('esprima');
const escodegen = require('escodegen');

// const target = 'miníslìdeş_ROCK'; // this looks better and has the same number of chars, but more bytes in utf-8 ಠ_ಠ
const target = 'mIniSlydes_ROCK';

/**
* very basic syntax tree traversal
* we look for all single-letter variable names and replace them as defined in `mapping`
* Returns an array containing all used variable names
*
* Do not try this at home, as it will replace all one-letter identifiers, including property names!
* Things like `Math.E` and `foo.b()` will break.
*/
let traverse = (ast, mapping) => {
    let replaced = [];
    if (Array.isArray(ast)) {
        ast.forEach(item => {
            let moreReplaced = traverse(item, mapping);
            replaced.push.apply(replaced, moreReplaced);
        });
    } else if (ast.type == 'Identifier' && ast.name.length === 1) {
        if (mapping[ast.name]) {
            ast.name = mapping[ast.name];
        }
        replaced.push(ast.name);
    } else {
        Object.keys(ast).forEach(key => {
            //console.log(key, ast[key]);
            if (ast[key] && typeof ast[key] == 'object') {
                let moreReplaced = traverse(ast[key], mapping);
                replaced.push.apply(replaced, moreReplaced);
            }
        });
    }
    return replaced;
};

// get next letter
let nextLetter = letter => {
    if (letter === 'Z') {
        return 'a';
    }
    if (letter === 'z') {
        return 'À';
    }
    if (letter === 'Ö') {
        return 'Ø';
    }
    if (letter === 'ö') {
        return 'ø';
    }
    if (letter === 'ˁ') {
        throw new Error('not enough letters!');
        // In case you need more, look here: https://codepoints.net/search?IDS=1
    }
    return String.fromCharCode(letter.charCodeAt() + 1);
};

module.exports = input => {
    let ast = esprima.parse(input);

    let used = traverse(ast, {});

    // first, replace problematic variables by unused letters
    let mapping = {};
    target.split('').reduce((replacer, letter) => {
        if (mapping[letter]) {
            throw new Error('target contains duplicate characters');
        }
        while (target.indexOf(replacer) > -1 || used.indexOf(replacer) > -1) {
            replacer = nextLetter(replacer);
        }
        mapping[letter] = replacer;
        return nextLetter(replacer);
    }, 'A');
    used = traverse(ast, mapping);

    // now, replace to what we want
    let reverseMapping = {};
    for (let i = 0, count = 0; count < target.length; i++) {
        let letter = used[i];
        if (!reverseMapping[letter]) {
            reverseMapping[letter] = target[i];
            count++;
        }
    }
    traverse(ast, reverseMapping);

    return escodegen.generate(ast, {
        format: {
            compact: true,
            quotes: 'double',
            semicolons: false
        }
    });
};
