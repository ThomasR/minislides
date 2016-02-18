'use strict';

const pmc = require('./poorMansCompressor');
const uglify = require('uglify-js');
const CleanCSS = require('clean-css');
const fs = require('fs');
const distDir = `${__dirname}/../dist/`;

// uglify JS
let js = pmc(fs.readFileSync(`${__dirname}/minislides.js`, 'utf-8'));
let minJS = uglify.minify(js, {fromString: true}).code;
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
