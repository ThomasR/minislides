var slides, currentPageNumber, activeSlide,
    revealedCls = 'revealed', incrementalSelector = '.incremental',
    querySelector = 'querySelector', document = document, body;

body = document.body;
slides = Array.from(document[querySelector + 'All']('section'));

function setPage(newPageNumber) {
    currentPageNumber = Math.max(1, Math.min(slides.length, newPageNumber || 0));
    activeSlide = slides[currentPageNumber - 1];
    Array.from(activeSlide[querySelector + 'All'](incrementalSelector)).forEach(function (el) {
        el.classList.remove(revealedCls);
    });
    location.hash = currentPageNumber;
    body.style.background = activeSlide.dataset.background || '';
    body.dataset.slide = activeSlide.dataset.slide || currentPageNumber;
}

window.addEventListener('keydown', function (e) {
    switch (e.keyCode - 32) { // - 32 for better compression
    case 32 - 32: // space
    case 34 - 32: // pgDn
    case 39 - 32: // right arrow
    case 40 - 32: // down arrow
    //case 90 - 32: // z abuse (Incutex Mini Wireless Presenter)
        e.preventDefault();
        var incremental = activeSlide[querySelector](incrementalSelector + ':not(.' + revealedCls + ')');
        if (incremental) {
            incremental.classList.add(revealedCls);
        } else if (currentPageNumber < slides.length) {
            setPage(currentPageNumber + 1);
        }
        break;
    case 33 - 32: // pgUp
    case 37 - 32: // left
    case 38 - 32: // up
    //case 116 - 32: // F5 abuse (Incutex Mini Wireless Presenter)
        e.preventDefault();
        if (currentPageNumber > 1) {
            setPage(currentPageNumber - 1);
        }
        break;
    case 27 - 32: // esc
        e.preventDefault();
        body.classList.toggle('muted');
        break;
    case 36 - 32: // home
        e.preventDefault();
        setPage(1);
        break;
    case 35 - 32: // end
        e.preventDefault();
        setPage(slides.length);
        break;
    }
}, false);

slides.forEach(function (s, i) {
    s.id = i + 1;
});

function processHash(newPageNumber) {
    newPageNumber = location.hash.substr(1);
    if (newPageNumber != currentPageNumber) {
        setPage(newPageNumber);
    }
}
processHash();
body.classList.add('loaded');
setInterval(processHash, 100);
