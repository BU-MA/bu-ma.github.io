/*
 * This file generates the cool math symbols that pop in and out of the background when in the scrolled state
 */

// add more if you want!
// dont use latex tho otherwise you get a memory leak
const symbolOptions = ['\\(\\int\\)', '\\(\\Sigma\\)', '\\(\\subseteq\\)', '\\(\\infty\\)', '\\(\\partial\\)', '\\(\\cong\\)', '\\(\\pi\\)', '\\(\\otimes\\)', 'Δ', 'Ω', 'μ', 'λ', 'θ', 'Φ', 'Ψ'];

const bgContainer = document.createElement('div');
bgContainer.id = 'math-background-container';
document.body.appendChild(bgContainer);

let spawnInterval = null;

const spawnSymbol = () => {
    const el = document.createElement('span');
    el.className = 'bg-math-symbol';
    el.textContent = symbolOptions[Math.floor(Math.random() * symbolOptions.length)];

    // randomize position within the bounds
    el.style.left = `${Math.random() * 90 + 5}vw`;
    el.style.top = `${Math.random() * 90 + 5}vh`;

    // randomize size between 2rem and 6rem
    el.style.fontSize = `${Math.random() * 4 + 2}rem`;

    // randomize rotation drift using CSS variables
    const startRot = Math.random() * 60 - 30;
    const endRot = startRot + (Math.random() * 60 - 30); // Drifts by ±30 degrees
    el.style.setProperty('--start-rot', `${startRot}deg`);
    el.style.setProperty('--end-rot', `${endRot}deg`);

    // randomize duration between 5s and 9s
    const duration = Math.random() * 4 + 5;
    el.style.animationDuration = `${duration}s`;

    bgContainer.appendChild(el);
    window.MathJax.typesetPromise(el);

    // remove the element from the div after its animation completes to prevent mem leak
    setTimeout(() => {
        if (bgContainer.contains(el)) {
            window.MathJax.typesetClear(el);
            el.remove();
        }
    }, duration * 1000);
};

// monitor for scrolled class
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            if (document.body.classList.contains('scrolled')) {
                if (!spawnInterval) {
                    spawnInterval = setInterval(spawnSymbol, 1500); // Spawns a new symbol every 600ms
                }
            } else {
                if (spawnInterval) {
                    clearInterval(spawnInterval);
                    spawnInterval = null;
                }
                // Instantly clear all active symbols when unscrolling
                bgContainer.innerHTML = '';
            }
        }
    });
});

observer.observe(document.body, { attributes: true });