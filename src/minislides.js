var slides, currentPageNumber, activeSlide, incremental, keyCodeNormalized,
    revealedCls = 'revealed', incrementalSelector = '.incremental',
    querySelector = 'querySelector', loc = location, doc = document, document_body;

document_body = doc.body;
slides = Array.from(doc[querySelector + 'All']('section'));

/**
* Jump to the given page (1-based) and update location hash
* @param {number} newPageNumber Should be an integer, some falsy value or Infinity
*/
function setPage(newPageNumber) {
    currentPageNumber = Math.min(slides.length, newPageNumber || 1);
    activeSlide = slides[currentPageNumber - 1];
    slides.map.call(activeSlide[querySelector + 'All'](incrementalSelector), function (el) {
        el.classList.remove(revealedCls);
    });
    loc.hash = currentPageNumber;
    document_body.style.background = activeSlide.dataset.bg || '';
    document_body.dataset.slideId = activeSlide.dataset.id || currentPageNumber;
}

// Init keyboard navigation
/*window.*/addEventListener('keydown', function (e, preventDefault) {
    keyCodeNormalized = e.which - 32; // - 32 for better compression
    if (!keyCodeNormalized /*keyCodeNormalized == 32 - 32*/ // space
            || !(keyCodeNormalized - (34 - 32)) // pgDn
            || !(keyCodeNormalized - (39 - 32)) // right arrow
            || !(keyCodeNormalized - (40 - 32)) // down arrow
            //|| !(keyCodeNormalized - (90 - 32)) // z abuse (Incutex Mini Wireless Presenter)
    ) {
        incremental = activeSlide[querySelector](incrementalSelector + ':not(.' + revealedCls + ')');
        if (incremental) {
            incremental.classList.add(revealedCls);
        } else {
            setPage(currentPageNumber + 1);
        }
        preventDefault = 1;
    }
    if (!(keyCodeNormalized - (33 - 32)) // pgUp
            || !(keyCodeNormalized - (37 - 32)) // left
            || !(keyCodeNormalized - (38 - 32)) // up
            //|| !(keyCodeNormalized - (116 - 32)) // F5 abuse (Incutex Mini Wireless Presenter)
    ) {
        setPage(currentPageNumber - 1);
        preventDefault = 1;
    }
    if (!(keyCodeNormalized + (-(27 - 32)))) { // esc
        document_body.classList.toggle('muted');
        preventDefault = 1;
    }
    if (!(keyCodeNormalized - (36 - 32))) { // home
        setPage(1);
        preventDefault = 1;
    }
    if (!(keyCodeNormalized - (35 - 32))) { // end
        setPage(Infinity); // shorter than slides.length, since it gets compressed to 1/0
        preventDefault = 1;
    }
    if (preventDefault) {
        e.preventDefault();
    }
});

// set slide ids
slides.map(function (slide, i) {
    slide.id = i + 1;
});

// poll location hash
function processHash(newPageNumber) {
    newPageNumber = loc.hash.substr(1);
    if (newPageNumber != currentPageNumber) {
        setPage(newPageNumber);
    }
}
processHash();

// fade-in presentation
document_body.classList.add('loaded');

// start polling
setInterval(processHash, 99);
