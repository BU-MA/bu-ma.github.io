/*
 * Theorem of the Week
 * Rotates through /src/home/theorem-of-the-week.json every Sunday at
 * 12:00am America/New_York (handled via Intl so EST/EDT just works).
 *
 * EPOCH marks the Sunday the very first entry (array index 0) went live.
 * The displayed number counts up forever from there; which JSON entry
 * shows is just (weekNumber - 1) mod theorems.length, so the list can be
 * shorter than the number of weeks that have passed and it just starts
 * repeating from the top. Add more theorems whenever — they slot into the
 * rotation the moment they're in the file, no numbering to fix up.
 */


// FIRST POST -- ensure it is set to the date of the first post for this sem
const EPOCH = '2026-09-05';

// en-CA formats as YYYY-MM-DD, which is convenient for re-parsing below
const nyDateString = date =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(date);

const weeksSince = (fromISO, now) =>
    Math.floor((Date.parse(`${nyDateString(now)}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`)) / (7 * 86400000));

(async function theoremOfTheWeek() {
    const card = document.getElementById('theorem-of-the-week');
    const eyebrow = document.getElementById('theorem-eyebrow');
    if (!card || !eyebrow) return;

    try {
        const theorems = await fetch('/src/thmoftheweek/theorem-of-the-week.json').then(res => res.json());
        const weekNumber = weeksSince(EPOCH, new Date()) + 1;
        const { name, statement, postUrl } = theorems[(weekNumber - 1) % theorems.length];

        const body = card.querySelector('.theorem-body');
        body.innerHTML = `
            <p>
                <span class="theorem-word">Theorem</span> <span class="theorem-name">(${name})</span><span class="theorem-word">.</span>
                ${statement}
            </p>
        `;

        eyebrow.textContent = `Theorem of the Week (#${weekNumber})`;
        card.querySelector('.learn-more a').href = postUrl;

        if (window.MathJax) window.MathJax.typesetPromise([body]);
    } catch (error) {
        console.error("Failed to load theorem of the week:", error);
    }
})();