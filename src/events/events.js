(async function loadEvents() {
    const eventListContainer = document.querySelector('.event-list');
    if (!eventListContainer) {
        console.error("Event list container not found!");
        return;
    }

    try {
        const response = await fetch('/src/events/events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();

        const now = new Date();
        const upcomingEvents = events.filter(event => {
            if (event.datetime === "TBD" || !event.duration) {
                return false;
            }
            const startTime = new Date(event.datetime);
            const endTime = new Date(startTime.getTime() + event.duration * 60000); // duration in minutes
            return endTime > now;
        });

        if (upcomingEvents.length === 0) {
            eventListContainer.innerHTML = '<p>No upcoming events. Please check back soon!</p>';
            return;
        }

        eventListContainer.innerHTML = '';

        upcomingEvents.forEach(event => {
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
        console.error("Failed to load events:", error);
        eventListContainer.innerHTML = '<p>Sorry, we were unable to load the event schedule.</p>';
    }
})();