# minislides

**The minimal HTML slide presentation framework**

With only 820 bytes of JavaScript, 398 bytes of CSS, and a few lines of HTML, it offers

* Fully responsive design
* keyboard navigation by arrow keys, space bar, PageUp, PageDown, Home, End.
  Bonus: Esc hides the presentation
* URL-fragments (i.e. slide number in location hash)
* Smooth transition between slides
* Incremental slide content (e.g. bullet lists)
* Support for direct styling, i.e. you can use a data-attribute on a slide to style the body when that slide becomes active
* shrink-to-fit images
* *No* global namespace pollution, i.e. no global variables and no `on*` attributes

## Usage

Open [minislides.html](dist/minislides.html) and start editing. There are comments there that will guide you. See [minislides_example.html](dist/minislides_example.html) for exemplary use. 

## The code

### JS
```javascript
!function(m,i,n,í,S,l,ì,d,e,s,_,R,O,C,K){K=e.body,s=Array.from(e[d+"All"]("section")),_=function(X){O=Math.max(1,Math.min(s[í],X||0)),C=s[O-1],Array.from(C[d+"All"](ì)).forEach(function(e){e[i].remove(l)}),location.hash=O,K.style[m]=C[n][m]||"",K[n].slide=C[n].slide||O},window.addEventListener("keydown",function(X){switch(X.keyCode-32){case 0:case 2:case 7:case 8:X[S]();var t=C[d](ì+":not(."+l+")");t?t[i].add(l):O<s[í]&&_(O+1);break;case 1:case 5:case 6:X[S](),O>1&&_(O-1);break;case-5:X[S](),K[i].toggle("muted");break;case 4:X[S](),_(1);break;case 3:X[S](),_(s[í])}},!1),R=function(X){X=location.hash.substr(1),X!=O&&_(X)},s.forEach(function(X,Y){X.id=Y+1}),R(),K[i].add("loaded"),setInterval(R,100)}("background","classList","dataset","length","preventDefault","revealed",".incremental","querySelector",document);
```

### CSS
```css
html{overflow:hidden;font-size:4vw}body,html{width:100%;height:100%;margin:0;padding:0}body.loaded{transition:all .3s ease-out}body.loaded section{transition:opacity .5s ease-out}section{position:fixed;top:1vw;bottom:1vw;left:1vw;right:1vw;opacity:0}section:target{z-index:1}body:not(.muted) section:target{opacity:1}img{max-height:100%;max-width:100%}.incremental:not(.revealed){visibility:hidden}
```

[![](https://img.shields.io/github/license/ThomasR/minislides.svg)](LICENSE)
