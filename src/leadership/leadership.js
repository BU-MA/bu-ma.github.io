/*
 * Handles the mobile nav toggle and adds a shadow under the persistent top
 * nav once the page has scrolled a little, so it reads as floating above
 * the content rather than flush with it.
 */
(function leadershipNav() {
    const siteNav = document.getElementById('siteNav');
    if (!siteNav) return;

    let ticking = false;
    function updateNavShadow() {
        siteNav.classList.toggle('scrolled', window.scrollY > 12);
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavShadow);
            ticking = true;
        }
    }, { passive: true });
    updateNavShadow();
})();