/*
 * This file generates the cool math symbols that pop in and out of the background when in the scrolled state
 */

// the number of ms between every symbol appearing
const spawnSpeed = 1500;

// add more if you want!
// make sure to escape all backslashes by typing \\ instead of \
// also pls try to keep it organized thanks
// i didnt include some common symbols like \cdot cuz ithought ti would look silly
const symbolOptions = [
    // lowercase greek
    '\\(\\alpha\\)', '\\(\\beta\\)', '\\(\\gamma\\)', '\\(\\delta\\)',
    '\\(\\epsilon\\)', '\\(\\varepsilon\\)', '\\(\\zeta\\)', '\\(\\eta\\)',
    '\\(\\theta\\)', '\\(\\vartheta\\)', '\\(\\iota\\)', '\\(\\kappa\\)',
    '\\(\\lambda\\)', '\\(\\mu\\)', '\\(\\nu\\)', '\\(\\xi\\)',
    '\\(\\pi\\)', '\\(\\varpi\\)', '\\(\\rho\\)', '\\(\\sigma\\)',
    '\\(\\varsigma\\)', '\\(\\tau\\)', '\\(\\upsilon\\)', '\\(\\phi\\)',
    '\\(\\varphi\\)', '\\(\\chi\\)', '\\(\\psi\\)', '\\(\\omega\\)',

    // uppercase greek
    '\\(\\Gamma\\)', '\\(\\Delta\\)', '\\(\\Theta\\)', '\\(\\Lambda\\)',
    '\\(\\Xi\\)', '\\(\\Pi\\)', '\\(\\Sigma\\)', '\\(\\Upsilon\\)',
    '\\(\\Phi\\)', '\\(\\Psi\\)', '\\(\\Omega\\)',

    // common mathbb letters
    '\\(\\mathbb{R}\\)', '\\(\\mathbb{N}\\)', '\\(\\mathbb{Z}\\)', '\\(\\mathbb{Q}\\)',
    '\\(\\mathbb{C}\\)', '\\(\\mathbb{H}\\)', '\\(\\mathbb{T}\\)', '\\(\\mathbb{F}\\)',
    '\\(\\mathbb{O}\\)', '\\(\\mathbb{S}\\)', '\\(\\mathbb{P}\\)',

    // mathcal letters
    '\\(\\mathcal{A}\\)', '\\(\\mathcal{B}\\)', '\\(\\mathcal{C}\\)', '\\(\\mathcal{D}\\)',
    '\\(\\mathcal{E}\\)', '\\(\\mathcal{F}\\)', '\\(\\mathcal{G}\\)', '\\(\\mathcal{H}\\)',
    '\\(\\mathcal{I}\\)', '\\(\\mathcal{J}\\)', '\\(\\mathcal{K}\\)','\\(\\mathcal{L}\\)',
    '\\(\\mathcal{M}\\)', '\\(\\mathcal{N}\\)', '\\(\\mathcal{O}\\)', '\\(\\mathcal{P}\\)',
    '\\(\\mathcal{Q}\\)', '\\(\\mathcal{R}\\)', '\\(\\mathcal{S}\\)', '\\(\\mathcal{T}\\)',
    '\\(\\mathcal{U}\\)', '\\(\\mathcal{V}\\)', '\\(\\mathcal{W}\\)', '\\(\\mathcal{X}\\)',
    '\\(\\mathcal{Y}\\)', '\\(\\mathcal{Z}\\)',

    // common mathscr letters
    '\\(\\mathscr{A}\\)', '\\(\\mathscr{B}\\)', '\\(\\mathscr{C}\\)', '\\(\\mathscr{D}\\)',
    '\\(\\mathscr{F}\\)', '\\(\\mathscr{G}\\)', '\\(\\mathscr{H}\\)', '\\(\\mathscr{K}\\)',
    '\\(\\mathscr{L}\\)', '\\(\\mathscr{O}\\)', '\\(\\mathscr{P}\\)', '\\(\\mathscr{S}\\)',
    '\\(\\mathscr{U}\\)', '\\(\\mathscr{V}\\)', '\\(\\mathscr{X}\\)',

    // common mathfrak lettrs
    '\\(\\mathfrak{g}\\)', '\\(\\mathfrak{h}\\)', '\\(\\mathfrak{a}\\)', '\\(\\mathfrak{m}\\)',
    '\\(\\mathfrak{p}\\)', '\\(\\mathfrak{i}\\)',

    // calculus & analysis
    '\\(\\int\\)', '\\(\\iint\\)', '\\(\\oint\\)', '\\(\\partial\\)',
    '\\(\\nabla\\)', '\\(\\infty\\)', '\\(\\lim\\)', '\\(\\sum\\)', '\\(\\prod\\)',
    '\\(L^p\\)',

    // Set theory
    '\\(\\subseteq\\)', '\\(\\subset\\)', '\\(\\supseteq\\)', '\\(\\supset\\)',
    '\\(\\in\\)', '\\(\\notin\\)', '\\(\\cup\\)', '\\(\\cap\\)', '\\(\\varnothing\\)',
    '\\(\\emptyset\\)', '\\(\\forall\\)', '\\(\\exists\\)', '\\(\\nexists\\)',

    // logic
    '\\(\\neg\\)', '\\(\\wedge\\)', '\\(\\vee\\)', '\\(\\therefore\\)',
    '\\(\\vDash\\)', '\\(\\Vdash\\)', '\\(\\models\\)', '\\(\\top\\)', '\\(\\bot\\)',
    '\\(\\vdash\\)',

    // arrows
    '\\(\\to\\)', '\\(\\mapsto\\)', '\\(\\leftrightarrow\\)', '\\(\\rightharpoonup\\)',
    '\\(\\leftrightarrows\\)', '\\(\\longrightarrow\\)', '\\(\\rightarrowtail\\)',
    '\\(\\Rightarrow\\)', '\\(\\Leftrightarrow\\)', '\\(\\twoheadrightarrow\\)',
    '\\(\\hookrightarrow\\)',

    // geometry
    '\\(\\mathbb{S}^n\\)', '\\(\\star\\)', '\\(C^\\infty\\)', '\\(\\mathbb{A}_{\\Bbbk}^n\\)',
    '\\(\\Gamma(X,-)\\)', '\\(\\mathrm{d}\\)', '\\(\\mathcal{O}_X\\)',
    '\\(\\mathcal{H}om\\)', '\\(\\mathbb{H}\\mathrm{om}\\)', '\\(\\mathfrak{so}\\)',
    '\\(\\mathfrak{sl}\\)', '\\(\\mathfrak{o}\\)', '\\(\\mathfrak{su}\\)',
    '\\(\\mathfral{gl}\\)', '\\(\\Omega^{p,q}\\)',

    // category theory
    '\\(\\circ\\)', '\\(\\dashv\\)', '\\(\\pitchfork\\)', '\\(\\varinjlim\\)',
    '\\(\\varprojlim\\)', '\\(\\mathrm{Hom}\\)', '\\(\\mathrm{Nat}\\)',
    '\\(\\mathrm{Fun}\\)', '\\(\\mathrm{Ho}\\)', '\\(\\mathrm{h}\\mathcal{C}\\)',
    '\\(\\amalg\\)', '\\(*\\)', '\\(\\boxtimes\\)', '\\(\\widehat{\\otimes}\\)',
    '\\(\\widehat{\\pitchfork}\\)',

    // algebra
    '\\(H^\\bullet\\)', '\\(H_\\bullet\\)', '\\(\\mathrm{Tor}_\\bullet^R\\)',
    '\\(\\mathrm{Ext}_R^\\bullet\\)', '\\(\\mathbb{L}_\\bullet F\\)',
    '\\(\\mathbb{R}^\\bullet F\\)', '\\(\\otimes\\)', '\\(\\oplus\\)',

    // order theory
    '\\(\\sqsubseteq\\)', '\\(\\sqsupseteq\\)', '\\(\\sqcup\\)', '\\(\\sqcap\\)',
    '\\(\\prec\\)', '\\(\\succ\\)', '\\(\\preceq\\)', '\\(\\succeq\\)',
    '\\(\\asymp\\)', '\\(\\bowtie\\)',

    // named operators
    '\\(\\det\\)', '\\(\\dim\\)', '\\(\\ker\\)', '\\(\\deg\\)', '\\(\\gcd\\)',
    '\\(\\sup\\)', '\\(\\inf\\)', '\\(\\max\\)', '\\(\\min\\)',

    // Complex analysis
    '\\(\\Re\\)', '\\(\\Im\\)',

    // physics
    '\\(\\hbar\\)', '\\(\\dagger\\)', '\\(\\ddagger\\)',

    // misc relations & operators
    '\\(\\cong\\)', '\\(\\equiv\\)', '\\(\\sim\\)', '\\(\\simeq\\)',
    '\\(\\approx\\)', '\\(\\neq\\)', '\\(\\leq\\)', '\\(\\geq\\)',
    '\\(\\propto\\)', '\\(\\pm\\)',
    '\\(\\mp\\)', '\\(\\times\\)', '\\(=\\)',
    '\\(\\gg\\)', '\\(\\ll\\)', '\\(\\frown\\)', '\\(\\smile\\)',
    '\\(\\circledast\\)',

    // misc
    '\\(\\square\\)', '\\(\\blacksquare\\)', '\\(\\ell\\)'
];

symbolOptions.forEach((option) => {
    console.log("\\verb|" + option.replace('\\(', '').replace('\\)', '') + "|: " + option);
})

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
    window.MathJax.typesetPromise([el]);

    // remove the element from the div after its animation completes to prevent mem leak
    setTimeout(() => {
        if (bgContainer.contains(el)) {
            window.MathJax.typesetClear([el]); // required to avoid a memory leak
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
                    spawnInterval = setInterval(spawnSymbol, spawnSpeed);
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