/**
 * Switches between the new themes, and now also between light/dark mode
 * for whichever theme is active.
 */

const THEMES = [
    { id: 'paradise', name: 'Paradise', swatch: '#b66467' },
    { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', swatch: '#cba6f7' },
    { id: 'rose-pine', name: 'Rose Pine', swatch: '#ebbcba' },
    { id: 'kanagawa', name: 'Kanagawa', swatch: '#7e9cd8' },
    { id: 'carbonfox', name: 'Carbonfox', swatch: '#33b1ff' },
];

const THEME_STORAGE_KEY = 'buma-theme';
const MODE_STORAGE_KEY = 'buma-mode';

(function themeSwitcher() {
    const applyTheme = themeId => {
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
        document.querySelectorAll('.theme-swatch').forEach(btn => btn.classList.toggle('active', btn.dataset.themeId === themeId));
    };

    const applyMode = mode => {
        document.documentElement.setAttribute('data-mode', mode);
        localStorage.setItem(MODE_STORAGE_KEY, mode);
        const modeToggle = document.querySelector('.mode-switcher-toggle');
        if (modeToggle) modeToggle.textContent = mode === 'light' ? '🌙' : '☀️';
    };

    const buildWidget = () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-switcher';

        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES[0].id;
        const currentMode = localStorage.getItem(MODE_STORAGE_KEY) || 'dark';

        // --- light/dark toggle, sits above the palette button ---
        const modeToggle = document.createElement('button');
        modeToggle.className = 'mode-switcher-toggle';
        modeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
        modeToggle.textContent = currentMode === 'light' ? '🌙' : '☀️';
        // reads the LIVE attribute at click time, not the `currentMode` captured
        // when the widget was built — that was the "only works once" bug, since
        // the old handler kept computing the same target every single click
        modeToggle.addEventListener('click', () =>
            applyMode(document.documentElement.getAttribute('data-mode') === 'light' ? 'dark' : 'light'));

        // --- palette toggle + panel, same as before ---
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-switcher-toggle';
        toggleBtn.setAttribute('aria-label', 'Change color scheme');
        toggleBtn.textContent = '🎨';

        const panel = document.createElement('div');
        panel.className = 'theme-switcher-panel';

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

        toggleBtn.addEventListener('click', e => {
            e.stopPropagation();
            panel.classList.toggle('open');
        });

        // close the panel if you click anywhere outside it
        document.addEventListener('click', e => {
            if (!wrapper.contains(e.target)) panel.classList.remove('open');
        });

        [panel, toggleBtn, modeToggle].forEach(el => wrapper.appendChild(el));
        document.body.appendChild(wrapper);
    };

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', buildWidget)
        : buildWidget();
})();