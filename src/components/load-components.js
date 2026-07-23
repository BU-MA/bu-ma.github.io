/*
 * automatically fills the <nav> and <footer> with the contents of navbar.html and footer.html.
 * To use, import the script as `<script src="/src/components/load-components.js" defer></script>`
 * and then insert `<nav data-page="the_page_you_are_on"></nav>` where you want the navbar to be, and
 * `<footer data-include></footer>` where you want the footer to be. Feel free to omit the `data-page` field
 * of the navbar if you are not on a page that shows in the navbar
 */


(async function loadPartials() {
    const navPlaceholder = document.querySelector('nav');
    const footerPlaceholder = document.querySelector('footer');

    if (navPlaceholder) {
        // add navbar
        const res = await fetch('/src/components/navbar.html');
        navPlaceholder.outerHTML = await res.text();

        // if on a page in the navbar, highlight it
        const currentPage = navPlaceholder.getAttribute('data-page');
        if (currentPage) {
            const activeLink = document.querySelector(`nav a[data-page="${currentPage}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    }

    if (footerPlaceholder) {
        // add footer
        const res = await fetch('/src/components/footer.html');
        footerPlaceholder.outerHTML = await res.text();
    }

    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
})();