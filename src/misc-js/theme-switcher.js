/**
 * Switches between the new themes
 * later will be repurposed to a light/dark mode switcher
 */

const THEMES = [
    { id: 'paradise', name: 'Paradise', swatch: '#b66467' },
    { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', swatch: '#cba6f7' },
    { id: 'rose-pine', name: 'Rose Pine', swatch: '#ebbcba' },
    { id: 'kanagawa', name: 'Kanagawa', swatch: '#7e9cd8' },
    { id: 'carbonfox', name: 'Carbonfox', swatch: '#33b1ff' },
];

const STORAGE_KEY = 'buma-theme';

(function themeSwitcher() {
    function applyTheme(themeId) {
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem(STORAGE_KEY, themeId);

        document.querySelectorAll('.theme-swatch').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeId === themeId);
        });
    }

    function buildWidget() {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-switcher';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-switcher-toggle';
        toggleBtn.setAttribute('aria-label', 'Change color scheme');
        toggleBtn.textContent = '🎨';

        const panel = document.createElement('div');
        panel.className = 'theme-switcher-panel';

        const currentTheme = localStorage.getItem(STORAGE_KEY) || THEMES[0].id;

        THEMES.forEach(theme => {
            const option = document.createElement('button');
            option.className = 'theme-swatch';
            option.style.backgroundColor = theme.swatch;
            option.dataset.themeId = theme.id;
            option.setAttribute('aria-label', theme.name);
            option.title = theme.name;
            if (theme.id === currentTheme) option.classList.add('active');

            option.addEventListener('click', () => applyTheme(theme.id));
            panel.appendChild(option);
        });

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });

        // close the panel if you click anywhere outside it
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                panel.classList.remove('open');
            }
        });

        wrapper.appendChild(panel);
        wrapper.appendChild(toggleBtn);
        document.body.appendChild(wrapper);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget);
    } else {
        buildWidget();
    }
})();