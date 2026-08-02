/*
 * handles the sliding list of events
 * to speed up or slow down, modify SECONDS_PER_CARD
 */


const SECONDS_PER_CARD = 10;


document.addEventListener("DOMContentLoaded", () => {

    const initializeEventStrip = () => {
        const track = document.getElementById("eventTrack");
        if (!track) return;

        const originalCards = Array.from(track.children);

        // Calculate required cards based on screen width
        // Assuming 320px width + 32px (2rem) gap per card
        const cardPhysicalWidth = 352;
        const screenWidth = window.innerWidth;
        const requiredCards = Math.ceil(screenWidth / cardPhysicalWidth);

        // 1. Clone base cards until they cover the screen width
        let currentCardCount = originalCards.length;
        while (currentCardCount < requiredCards) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
            currentCardCount += originalCards.length;
        }

        // 2. Wrap all generated cards into Set 1
        const set1 = document.createElement("div");
        set1.className = "event-strip-set";
        while (track.firstChild) {
            set1.appendChild(track.firstChild);
        }
        track.appendChild(set1);

        // 3. Clone Set 1 exactly to create Set 2 for the infinite loop
        const set2 = set1.cloneNode(true);
        set2.setAttribute("aria-hidden", "true");
        track.appendChild(set2);

        const calculatedDuration = currentCardCount * SECONDS_PER_CARD;
        track.style.animationDuration = `${calculatedDuration}s`;
    };

    initializeEventStrip();

    // Optional: Re-initialize on resize to handle window maximizing
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const track = document.getElementById("eventTrack");
            if (track) {
                // Strip out the generated sets and restore original base cards before recalculating
                const baseCards = Array.from(track.querySelector(".event-strip-set").children).slice(0, 4);
                track.innerHTML = "";
                baseCards.forEach(card => {
                    card.removeAttribute("aria-hidden");
                    track.appendChild(card);
                });
                initializeEventStrip();
            }
        }, 250);
    });
});