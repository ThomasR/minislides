/**
 * Very basic compression helper that
 * - wraps everything in a IIFE
 *     (function (…) {})();
 * - replaces attributes of the form
 *     f.foobarbaz -> var x = 'foobarbaz'; f[x]
 *   while considering whether this is advantageous for compression
 * - replaces the first "var" line
 *     var foo, bar, baz = 'qux' -> (function (baz, foo, bar) {})('qux');
 *
 * No parser, only REs. I know, this is bad. Send a pull request if you can't stand it.
 */
'use strict';
const uglify = require('uglify-js');
const fs = require('fs');

let minislides = fs.readFileSync(`${__dirname}/minislides.js`, 'utf-8');

// find all attributes
let f = `(function () {${minislides}})();`;
var attrs = f.match(/\.[a-z]{3,}/gi).sort().reduce((result, item) => {
  var last = result[result.length - 1];
  if (last && item == `.${last.text}`) {
    last.count++;
  } else {
    result.push({
      text: item.replace('.', ''),
      count: 1
    });
  }
  return result;
}, [])
    .filter(attr => attr.count > 1)
    // We only get smaller code if length > (2*count + 5) / (count - 1) :
    // .attr -> [x]  // -c*(l-2) = 2c-lc
    // (function (,x) {}(,"attr")  // +5+l
    // 2c-lc + 5+l < 0 <=> 2c+5 < l(c-1)
    .filter(attr => attr.text.length > (2 * attr.count + 5) / (attr.count - 1))
    .map(attr => attr.text);

var params = [];
var values = [];
// replace attributes by [_]
attrs.forEach(method => {
    params.push(method);
    values.push(`'${method}'`);
    f = f.replace(new RegExp('\\b\\.' + method + '\\b', 'g'), `[${method}]`);
});

// find vars for anonymous wrapper
f = f.replace(/(^\(function.*?\)[\s{]*)(var [^;]+);\s*/, function (match, fun, vars) {
    vars = vars.replace('var', '').trim().split(/,\s*/g);
    var withValues = vars.filter(v => v.indexOf('=') > -1);
    withValues.forEach(x => {
        var lr = x.split(/ *= */);
        params.push(lr[0]);
        values.push(lr[1]);
    });
    params.push.apply(params, vars.filter(v => v.indexOf('=') == -1));
    return fun;
});

// put vars to anonymous wrapper
f = f.replace(/function *\(/, `$&${params.join(', ')}`).replace(/\(([^)]*\);)$/, `(${values.join(', ')}$1`);

// uglify
let minified = uglify.minify(f, {fromString: true}).code;
fs.writeFileSync(`${__dirname}/../dist/minislides.min.js`, minified);
console.log(minified);
console.info(minified.length);
