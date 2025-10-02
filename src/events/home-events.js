(async function loadHomeEvents() {
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    if (!upcomingEventsContainer) {
        console.error("Upcoming events container not found!");
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
            const endTime = new Date(startTime.getTime() + event.duration * 60000);
            return endTime > now;
        }).slice(0, 2); // Get the next 2 upcoming events

        if (upcomingEvents.length === 0) {
            upcomingEventsContainer.innerHTML = '<p>No upcoming events. Please check back soon!</p>';
            return;
        }

        upcomingEventsContainer.innerHTML = '';

        upcomingEvents.forEach(event => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';

            const startTime = new Date(event.datetime);

            const formatDate = (date) => {
                const options = { weekday: 'long', month: 'long', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            };

            const formatTime = (time) => {
                return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            };

            eventItem.innerHTML = `
                <h4>${event.title}</h4>
                <p><strong>Date:</strong> ${formatDate(startTime)}</p>
                <p><strong>Time:</strong> ${formatTime(startTime)}</p>
                <p>${event.description}</p>
            `;
            upcomingEventsContainer.appendChild(eventItem);

            if (window.MathJax) {
                window.MathJax.typesetPromise();
            }
        });

    } catch (error) {
        console.error("Failed to load upcoming events:", error);
        upcomingEventsContainer.innerHTML = '<p>Sorry, we were unable to load the event schedule.</p>';
    }
})();