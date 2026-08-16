const saved = localStorage.getItem('buma-theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);