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
    const normalizeMode = mode => mode === 'light' ? 'light' : 'dark';

    const updateModeButton = mode => {
        const modeToggle = document.querySelector('.mode-switcher-toggle');
        if (!modeToggle) return;

        modeToggle.textContent = mode === 'light' ? '🌙' : '☀️';
        modeToggle.setAttribute('aria-pressed', String(mode === 'light'));
        modeToggle.title = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    };

    const applyTheme = (themeId, persist = true) => {
        document.documentElement.setAttribute('data-theme', themeId);
        if (persist) localStorage.setItem(THEME_STORAGE_KEY, themeId);

        document.querySelectorAll('.theme-swatch').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.themeId === themeId);
        });
    };

    const applyMode = (mode, persist = true) => {
        const normalizedMode = normalizeMode(mode);
        document.documentElement.setAttribute('data-mode', normalizedMode);
        if (persist) localStorage.setItem(MODE_STORAGE_KEY, normalizedMode);
        updateModeButton(normalizedMode);
    };

    const syncFromStorage = () => {
        const storedMode = normalizeMode(localStorage.getItem(MODE_STORAGE_KEY));
        const liveMode = normalizeMode(document.documentElement.getAttribute('data-mode'));

        // load-theme.js normally handles this before first paint. This sync is
        // important for BFCache/page restores, where the DOM can be restored
        // with stale attributes while localStorage already contains the new mode.
        if (storedMode !== liveMode) applyMode(storedMode, false);
        else updateModeButton(liveMode);

        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme && storedTheme !== document.documentElement.getAttribute('data-theme')) {
            applyTheme(storedTheme, false);
        }
    };

    const buildWidget = () => {
        // Guard against accidental duplicate script inclusion.
        if (document.querySelector('.theme-switcher')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'theme-switcher';

        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES[0].id;
        const currentMode = normalizeMode(
            document.documentElement.getAttribute('data-mode') ||
            localStorage.getItem(MODE_STORAGE_KEY)
        );

        const modeToggle = document.createElement('button');
        modeToggle.type = 'button';
        modeToggle.className = 'mode-switcher-toggle';
        modeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
        modeToggle.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();

            const liveMode = normalizeMode(document.documentElement.getAttribute('data-mode'));
            applyMode(liveMode === 'light' ? 'dark' : 'light');
        });

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'theme-switcher-toggle';
        toggleBtn.setAttribute('aria-label', 'Change color scheme');
        toggleBtn.textContent = '🎨';

        const panel = document.createElement('div');
        panel.className = 'theme-switcher-panel';

        THEMES.forEach(theme => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'theme-swatch';
            option.style.backgroundColor = theme.swatch;
            option.dataset.themeId = theme.id;
            option.setAttribute('aria-label', theme.name);
            option.title = theme.name;
            if (theme.id === currentTheme) option.classList.add('active');
            option.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                applyTheme(theme.id);
            });
            panel.appendChild(option);
        });

        toggleBtn.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            panel.classList.toggle('open');
        });

        document.addEventListener('click', event => {
            if (!wrapper.contains(event.target)) panel.classList.remove('open');
        });

        [panel, toggleBtn, modeToggle].forEach(el => wrapper.appendChild(el));
        document.body.appendChild(wrapper);

        applyMode(currentMode, false);
        applyTheme(currentTheme, false);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildWidget, { once: true });
    } else {
        buildWidget();
    }

    // Back/forward cache restores are common on desktop browsers and can leave
    // the restored DOM out of sync with localStorage. Re-sync whenever a page
    // becomes active again.
    window.addEventListener('pageshow', syncFromStorage);

    // Keep other open tabs/windows in sync as well.
    window.addEventListener('storage', event => {
        if (event.key === MODE_STORAGE_KEY || event.key === THEME_STORAGE_KEY) syncFromStorage();
    });
})();
