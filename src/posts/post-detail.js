document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Reading progress ---------- */
    const progress = document.getElementById('readingProgress');
    if (progress) {
        const update = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - doc.clientHeight;
            progress.style.width = `${scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0}%`;
        };
        document.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ---------- Reveal on scroll ---------- */
    const revealTargets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach(el => el.classList.add('revealed'));
        return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    }), { threshold: 0.1 });
    revealTargets.forEach(el => observer.observe(el));
});