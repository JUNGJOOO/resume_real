(function () {
    var container = document.getElementById('flowArt');
    if (!container || typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return; // skip pin/rotate scroll animation entirely for reduced-motion users

    var sections = Array.prototype.slice.call(
        container.querySelectorAll('[data-flow-section]')
    );
    if (sections.length === 0) return;

    var triggers = [];

    sections.forEach(function (section, i) {
        gsap.set(section, { zIndex: i + 1 });

        var inner = section.querySelector('.flow_wrap');
        if (!inner) return;

        if (i > 0) {
            gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
            var tween = gsap.to(inner, {
                rotation: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'top 25%',
                    scrub: true
                }
            });
            if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
            triggers.push(
                ScrollTrigger.create({
                    trigger: section,
                    start: 'bottom bottom',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false
                })
            );
        }
    });

    ScrollTrigger.refresh();
})();
