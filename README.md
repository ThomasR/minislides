# minislides

**The minimal HTML slide presentation framework**

With only <span class="js">709</em> bytes of JavaScript, <span class="css">371</span> bytes of CSS, and a few lines of HTML, it offers

* Fully responsive design
* keyboard navigation by arrow keys, space bar, PageUp, PageDown, Home, End.
  Bonus: Esc hides the presentation
* URL-fragments (i.e. slide number in location hash)
* Smooth transition between slides
* Incremental slide content (e.g. bullet lists)
* Support for direct styling, i.e. you can use a data-attribute on a slide to style the body when that slide becomes active
* shrink-to-fit images
* *No* global namespace pollution, i.e. no global variables and no `on*` attributes
* Valid, semantic HTML markup

## Compatibility

* Firefox
* Chrome
* Edge
* Opera

## Usage

Download [minislides.html](dist/minislides.html) and start editing. There are comments there that will guide you. No need to download any additional files. JS and CSS is included.

See [thomasr.github.io/minislides](http://thomasr.github.io/minislides/) for exemplary use. 

## The code

### JS
```javascript
!function(m,I,n,i,S,l,y,d,e,s,_,F,T,W){function $(y){e=Math.min(d.length,y||1),s=d[e-1],Array.from(s[S+"All"](i)).forEach(function(I){I[m].remove(n)}),l.hash=e,W.style.background=s[I].bg,W[I].slideId=s[I].id||e}function H(m){m=l.hash.substr(1),m!=e&&$(m)}W=y.body,d=Array.from(y[S+"All"]("section")),addEventListener("keydown",function(I){F=I.which-32,F&&2!=F&&7!=F&&8!=F||(_=s[S](i+":not(."+n+")"),_?_[m].add(n):$(e+1),T=1),1!=F&&5!=F&&6!=F||($(e-1),T=1),-5==F&&(W[m].toggle("muted"),T=1),4==F&&($(1),T=1),3==F&&($(1/0),T=1),T&&I.preventDefault()}),d.forEach(function(m,I){m.id=I+1}),H(),W[m].add("loaded"),setInterval(H,99)}("classList","dataset","revealed",".incremental","querySelector",location,document)
```

### CSS
```css
body,html{overflow:hidden;font-size:4vw;width:100%;height:100%;margin:0;padding:0}body.loaded{transition:.3s}body.loaded section{transition:opacity .5s}section{position:fixed;top:1vw;bottom:1vw;left:1vw;right:1vw;opacity:0}section:target{z-index:1}body:not(.muted) section:target{opacity:1}img{max-height:100%;max-width:100%}.incremental:not(.revealed){visibility:hidden}
```

## Why?

I don’t know. It must have something to do with [code golf](https://en.wikipedia.org/wiki/Code_golf) and with me being slightly crazy.

[![](https://img.shields.io/github/license/ThomasR/minislides.svg)](LICENSE)
