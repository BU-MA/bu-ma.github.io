/*
 * Handles two things on the about page:
 *   1. fading/sliding in each .reveal section as it scrolls into view
 *   2. counting each .stat-number up to its data-count value once its
 *      .stat-node scrolls into view
 * Both are one-shot — each element triggers once, then unobserves itself.
 * Nav toggle + scroll shadow are handled separately by leadership.js, since
 * every page using the #siteNav header pattern shares that behavior.
 */

(function aboutPage() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealOnIntersect = (selector, onReveal) => {
        const els = document.querySelectorAll(selector);

        if (!('IntersectionObserver' in window)) {
            els.forEach(onReveal);
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                onReveal(entry.target);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.2 });

        els.forEach(el => observer.observe(el));
    };

    // fade + slide up any section marked .reveal
    revealOnIntersect('.reveal', el => el.classList.add('revealed'));

    // count each .stat-number up to its data-count value, with an optional data-suffix (e.g. "+")
    revealOnIntersect('.stat-node', node => {
        const numberEl = node.querySelector('.stat-number');
        const target = Number(node.dataset.count);
        const suffix = node.dataset.suffix || '';

        if (prefersReducedMotion) {
            numberEl.textContent = target + suffix;
            return;
        }

        const duration = 900;
        const start = performance.now();

        const tick = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            numberEl.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    });
})();