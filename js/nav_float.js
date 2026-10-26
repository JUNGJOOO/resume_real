(function () {
    // Shared floating nav for resume_real pages (resume.html, index.html).
    // Not used on portfolio-rpa (separate repo/stack, deliberately excluded).
    var NAV_LINKS = [
        { label: 'Resume', href: 'resume.html' },
        { label: 'Project', href: 'index.html' },
        { label: 'RPA', href: 'https://jungjooo.github.io/portfolio-rpa/' }
    ];

    var currentFile = (location.pathname.split('/').pop() || 'index.html');

    var dotsHTML = '';
    for (var d = 0; d < 4; d++) { dotsHTML += '<span class="nav_float_grid_dot"></span>'; }

    var linksHTML = NAV_LINKS.map(function (item) {
        var linkFile = item.href.split('/').pop();
        var activeClass = (linkFile === currentFile) ? ' is-active' : '';
        return '<a class="nav_float_link' + activeClass + '" href="' + item.href + '" data-text="' + item.label + '">' + item.label + '</a>';
    }).join('');

    var nav = document.createElement('nav');
    nav.className = 'nav_float';
    nav.id = 'navFloat';
    nav.innerHTML =
        '<span class="nav_float_icon" aria-hidden="true"><span class="nav_float_grid">' + dotsHTML + '</span></span>' +
        '<div class="nav_float_links">' + linksHTML + '</div>';

    document.body.insertBefore(nav, document.body.firstChild);

    nav.style.setProperty('--nav-float-width', nav.scrollWidth + 'px');

    var EXPAND_THRESHOLD = 80;
    var isExpanded = true;
    var collapseY = 0;

    function setExpanded(next) {
        if (isExpanded === next) return;
        isExpanded = next;
        nav.classList.toggle('is-collapsed', !next);
    }

    nav.addEventListener('click', function (e) {
        if (!isExpanded) {
            e.preventDefault();
            setExpanded(true);
        }
    });

    function handleScrollState(y, direction) {
        if (isExpanded && direction === 1 && y > 150) {
            setExpanded(false);
            collapseY = y;
        } else if (!isExpanded && direction === -1 && (collapseY - y > EXPAND_THRESHOLD)) {
            setExpanded(true);
        }
    }

    // Pages with GSAP/ScrollTrigger loaded (e.g. resume.html) can suppress the native
    // 'scroll' event in some browsers due to heavy pinning, so drive off ScrollTrigger's
    // own tracking there; plain pages (e.g. index.html) just use native scroll.
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: function (self) {
                handleScrollState(self.scroll(), self.direction);
            }
        });
    } else {
        var lastY = window.scrollY || window.pageYOffset || 0;
        window.addEventListener('scroll', function () {
            var y = window.scrollY || window.pageYOffset || 0;
            handleScrollState(y, y > lastY ? 1 : -1);
            lastY = y;
        }, { passive: true });
    }
})();
