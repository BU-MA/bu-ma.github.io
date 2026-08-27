const savedTheme = localStorage.getItem('buma-theme');
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

const savedMode = localStorage.getItem('buma-mode');
document.documentElement.setAttribute('data-mode', savedMode || 'dark');