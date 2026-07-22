/*
 * Renders event cards for past events. See events.js for descriptions on what most things do; most of the code is
 * unchanged. The main differences are that we don't filter out TBD and past events, and we pass the json location
 * as data to the past-event-list element.
 * To use, do something like
 * ```
 * <div class="past-event-list" data-semester="fall-2025.json></div>
 * ```
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

            const formatDate = (date) => {
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            };

            const formatTime = (time) => {
                return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            };

            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p><strong>Date:</strong> ${formatDate(startTime)}</p>
                    <p><strong>Time:</strong> ${formatTime(startTime)} - ${formatTime(endTime)}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                </div>
                <p class="event-description">${event.description}</p>
            `;

            eventListContainer.appendChild(eventCard);

            if (window.MathJax) {
                window.MathJax.typesetPromise();
            }
        });

    } catch (error) {
        console.error("Failed to load past events:", error);
        eventListContainer.innerHTML = '<p>Sorry, we were unable to load the event schedule.</p>';
    }
})();