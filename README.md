# minislides

**The minimal HTML slide presentation framework**

With only <span class="js">819</em> bytes of JavaScript, <span class="css">398</span> bytes of CSS, and a few lines of HTML, it offers

* Fully responsive design
* keyboard navigation by arrow keys, space bar, PageUp, PageDown, Home, End.
  Bonus: Esc hides the presentation
* URL-fragments (i.e. slide number in location hash)
* Smooth transition between slides
* Incremental slide content (e.g. bullet lists)
* Support for direct styling, i.e. you can use a data-attribute on a slide to style the body when that slide becomes active
* shrink-to-fit images
* *No* global namespace pollution, i.e. no global variables and no `on*` attributes
* Valid HTML markup

## Usage

Download [minislides.html](dist/minislides.html) and start editing. There are comments there that will guide you. No need to download any additional files. JS and CSS is included.

 See [minislides_example.html](dist/minislides_example.html) for exemplary use. 

## The code

### JS
```javascript
!function(m,I,n,i,S,l,y,d,e,s,_,R,O,C,K){K=e.body,s=Array.from(e[d+"All"]("section")),_=function(S){O=Math.max(1,Math.min(s[i],S||0)),C=s[O-1],Array.from(C[d+"All"](y)).forEach(function(m){m[I].remove(l)}),location.hash=O,K.style[m]=C[n][m]||"",K[n].slide=C[n].slide||O},window.addEventListener("keydown",function(m){switch(m.keyCode-32){case 0:case 2:case 7:case 8:m[S]();var n=C[d](y+":not(."+l+")");n?n[I].add(l):O<s[i]&&_(O+1);break;case 1:case 5:case 6:m[S](),O>1&&_(O-1);break;case-5:m[S](),K[I].toggle("muted");break;case 4:m[S](),_(1);break;case 3:m[S](),_(s[i])}},!1),R=function(m){m=location.hash.substr(1),m!=O&&_(m)},s.forEach(function(m,I){m.id=I+1}),R(),K[I].add("loaded"),setInterval(R,100)}("background","classList","dataset","length","preventDefault","revealed",".incremental","querySelector",document)
```

### CSS
```css
html{overflow:hidden;font-size:4vw}body,html{width:100%;height:100%;margin:0;padding:0}body.loaded{transition:all .3s ease-out}body.loaded section{transition:opacity .5s ease-out}section{position:fixed;top:1vw;bottom:1vw;left:1vw;right:1vw;opacity:0}section:target{z-index:1}body:not(.muted) section:target{opacity:1}img{max-height:100%;max-width:100%}.incremental:not(.revealed){visibility:hidden}
```

[![](https://img.shields.io/github/license/ThomasR/minislides.svg)](LICENSE)
