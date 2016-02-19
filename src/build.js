'use strict';

const uglify = require('uglify-js');
const CleanCSS = require('clean-css');
const fs = require('fs');

const pmc = require('./poorMansCompressor');
const varNameReplace = require('./varNameReplacer');

const distDir = `${__dirname}/../dist/`;

// uglify JS
let js = pmc(fs.readFileSync(`${__dirname}/minislides.js`, 'utf-8'));
let minJS = uglify.minify(js, {fromString: true}).code;
minJS = varNameReplace(minJS);
fs.writeFileSync(`${distDir}/minislides.min.js`, minJS);
console.log(minJS);
console.info(minJS.length);

// compress CSS
let css = fs.readFileSync(`${__dirname}/minislides.css`, 'utf-8');
let minCss = new CleanCSS().minify(css).styles;
fs.writeFileSync(`${distDir}/minislides.min.css`, minCss);
console.log(minCss);
console.info(minCss.length);

// inline to html
let html = fs.readFileSync(`${__dirname}/minislides.html`, 'utf-8');
html = html.replace(/<script src="minislides.js"><\/script>/, `<script>${minJS}</script>`);
html = html.replace(/<link [^>]*href="minislides.css"[^>]*>/, `<style>${minCss}</style>`);
fs.writeFileSync(`${distDir}/minislides.html`, html);

html = html.replace(/<title.*<\/title>/, '<title>minislides!</title>');
let exampleStyles = fs.readFileSync(`${__dirname}/example.css`, 'utf-8');
html = html.replace(/<style>\s+[\s\S]*?<\/style>/, `<style>\n${exampleStyles}</style>`);
let exampleSections = fs.readFileSync(`${__dirname}/example.html`, 'utf-8');
html = html.replace(/<section[\s\S]*<\/section>\n/, exampleSections);
fs.writeFileSync(`${distDir}/minislides_example.html`, html);

// paste to readme
let readme = fs.readFileSync(`${__dirname}/../README.md`, 'utf-8');
readme = readme.replace(/```javascript[\s\S]*?```/, '```javascript\n' + minJS + '\n```');
readme = readme.replace(/```css[\s\S]*?```/, '```css\n' + minCss + '\n```');
readme = readme.replace(/<span class="js">[0-9]+/, `<span class="js">${minJS.length}`);
readme = readme.replace(/<span class="css">[0-9]+/, `<span class="css">${minCss.length}`);
fs.writeFileSync(`${__dirname}/../README.md`, readme);