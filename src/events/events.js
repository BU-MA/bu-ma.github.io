/*
ai generated script to do the thing i want i to do
 */

(async function loadEvents() {
    const eventListContainer = document.querySelector('.event-list');
    if (!eventListContainer) {
        console.error("Event list container not found!");
        return;
    }

    try {
        // Fetch the JSON data
        const response = await fetch('/src/events/events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();

        if (events.length === 0) {
            eventListContainer.innerHTML = '<p>No upcoming events. Please check back soon!</p>';
            return;
        }

        // Clear any existing content (e.g., a loading message)
        eventListContainer.innerHTML = '';

        // Loop through each event and create an HTML card for it
        events.forEach(event => {
            const eventCard = document.createElement('article');
            eventCard.className = 'event-card';

            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                </div>
                <p class="event-description">${event.description}</p>
            `;

            eventListContainer.appendChild(eventCard);
        });

    } catch (error) {
        console.error("Failed to load events:", error);
        eventListContainer.innerHTML = '<p>Sorry, we were unable to load the event schedule.</p>';
    }
})();