/*
 * Manifold redesign: reveals sections with a fade+slide as they scroll into view.
 * Uses IntersectionObserver so it only fires once per element and costs nothing
 * once revealed. Falls back to showing everything immediately if unsupported.
 *
 * Deliberately only targets static wrapper elements (.content-section), not the
 * individual .event-item cards inside #upcoming-events — those are injected
 * asynchronously by home-events.js after a fetch completes, so they may not exist
 * yet when this script runs. Revealing the wrapper instead sidesteps that race
 * entirely: whatever's inside it by the time it scrolls into view just shows up.
 */

(function scrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
})();