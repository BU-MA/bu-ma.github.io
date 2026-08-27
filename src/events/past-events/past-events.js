/*
 * Renders event cards for past events. See events.js for descriptions on what most things do; most of the code is
 * unchanged. The main differences are that we don't filter out TBD and past events, and we pass the json location
 * as data to the past-event-list element.
 * To use, do something like
 * ```
 * <div class="past-event-list" data-semester="fall-2025.json></div>
 * ```
 *
 * NOTE: this used to render a <button class="read-more-toggle" hidden> and just... never touch it again — no
 * listener, never unhidden. Wired it up the same way events.js does, waiting on MathJax + the webfont before
 * measuring clamp overflow (see setUpReadMore in events.js for why that matters).
 */

(async function loadPastEvents() {
    const eventListContainer = document.querySelector('.past-event-list');
    if (!eventListContainer) {
        console.error("Past event list container not found!");
        return;
    }

    const targetJson = eventListContainer.getAttribute('data-semester')
    if (!targetJson) {
        console.error("No data-semester attribute provided on the event container.");
        return;
    }

    try {
        const response = await fetch(`/src/events/past-events/${targetJson}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();

        if (events.length === 0) {
            eventListContainer.innerHTML = '<p>No past events to display for this semester.</p>';
            return;
        }

        eventListContainer.innerHTML = '';

        events.forEach(event => {
            const eventCard = document.createElement('article');
            eventCard.className = 'event-card';

            const startTime = new Date(event.datetime);
            const endTime = new Date(startTime.getTime() + event.duration * 60000);

            function formatDateBadge(startTime) {
                return startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            function formatDate(date) {
                const options = { weekday: 'long', month: 'long', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            }

            const formatTime = (time) => {
                return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            };

            eventCard.innerHTML = `
                <div class="card-top">
                    <span class="date-badge">${formatDateBadge(startTime)}</span>
                    <button class="add-to-calendar" aria-label="Add to calendar">
                        <span class="add-to-calendar-icon">+</span>
                        <span class="tooltip" role="tooltip">Add to calendar</span>
                    </button>
                </div>
                <h3>${event.title}</h3>
                <p class="event-meta">${formatDate(startTime)} &middot; ${formatTime(startTime)} &ndash; ${formatTime(endTime)} &middot; ${event.location}</p>
                <p class="event-description desc-clamp">${event.description}</p>
                <button class="read-more-toggle" aria-expanded="false" hidden>Read more</button>
            `;

            eventListContainer.appendChild(eventCard);
        });

        Promise.all([
            window.MathJax ? window.MathJax.typesetPromise(eventListContainer) : Promise.resolve(),
            document.fonts ? document.fonts.ready : Promise.resolve(),
        ]).then(() => eventListContainer.querySelectorAll('.event-card').forEach(setUpReadMore));

    } catch (error) {
        console.error("Failed to load past events:", error);
        eventListContainer.innerHTML = '<p>Sorry, we were unable to load the event schedule.</p>';
    }

    function setUpReadMore(card) {
        const desc = card.querySelector('.desc-clamp');
        const toggle = card.querySelector('.read-more-toggle');
        if (desc.scrollHeight > desc.clientHeight + 1) {
            toggle.hidden = false;
            toggle.addEventListener('click', () => {
                const expanded = desc.classList.toggle('expanded');
                toggle.textContent = expanded ? 'Show less' : 'Read more';
                toggle.setAttribute('aria-expanded', expanded);
            });
        }
    }
})();