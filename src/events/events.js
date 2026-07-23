/*
 * Loads events.json and generates the html contents of the events block in /events/.
 * Written by grant talbert.
 * i do not know why the entire thing is wrapped in a function call. -grant, a year after writing this
 *
 * This script looks for any html element with the `event-list` css class, and populates it with cards for any upcoming
 * events listed in events.json. Most likely you should use a div element, so your html code would look like
 * ```
 * <div class="event-list"></div>
 * ```
 */


import { downloadICS } from '../misc-js/ics-manager.js';


(async function loadEvents() {
    // Looks for an instance of the event-list css class to populate
    const eventListContainer = document.querySelector('.event-list');
    if (!eventListContainer) {
        console.error("Event list container not found!");
        return;
    }

    try {
        // import the events.json file
        const response = await fetch('/src/events/events.json');
        // throws an error if there was an error importing the json file
        // in this case, the rest of the `try` block is skipped
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // this comment is here to tell you that this line is self-explanatory and does not need a comment
        const now = new Date();

        // stores the contents of events.json
        const upcomingEvents = (await response.json())
            /*
             * Events with a datetime marked as "TBD" are filtered out and not rendered. This is nice for a variety of
             * reasons, such as if you don't know the specifics of an event yet and thus don't want to make it public
             * This also discards all events that already happened. If you want to render previous events, remove the
             * block that filters them (marked below)
             */
            .filter(event => {
                // this block filters out events with TBD datetime or no duration
                if (event.datetime === "TBD" || !event.duration) {
                    return false;
                }

                // this block filters out all previous events
                const startTime = new Date(event.datetime);
                /* datetime measures time in ms. event.duration is measured in minutes. One minute is 60 seconds is
                60 * 1000 = 60000 ms */
                const endTime = new Date(startTime.getTime() + event.duration * 60000)
                return endTime > now;
            })

        // checks if there are any upcoming events; exits if none are found
        if (upcomingEvents.length === 0) {
            eventListContainer.innerHTML = '<p style="text-align: center;">' +
                'No upcoming events. Please check back soon!</p>';
            return;
        }

        // removes any contents of the eventListContainer just to be safe
        // comment this out if you want to include something in there
        eventListContainer.innerHTML = '';

        // this block constructs an eventCard for each event, which is the card that is displayed for this event on the page
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

            // the exact layout of the eventCard is defined here
            // feel free to change it if you want
            // to change the styles, look at events.css
            eventCard.innerHTML = `
                <h3>${event.title}</h3>
                <div class="event-details">
                    <p><strong>Date:</strong> ${formatDate(startTime)}</p>
                    <p><strong>Time:</strong> ${formatTime(startTime)} - ${formatTime(endTime)}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="add-to-calendar-container">
                    <button class="add-to-calendar"><strong>Add to Calendar</strong></button>
                </div>
            `;

            eventCard.querySelector('.add-to-calendar').addEventListener('click', () => {
                downloadICS(event, startTime, endTime)
            })

            eventListContainer.appendChild(eventCard);

            // renders any latex code
            if (window.MathJax) {
                window.MathJax.typesetPromise();
            }
        });

    } catch (error) {
        // this code executes if there was an error when fetching the json file
        // it just renders a short message
        console.error("Failed to load events:", error);
        eventListContainer.innerHTML = '<p>Sorry, we were unable to load the event schedule. Please try again.</p>' +
            '<p>(If this error persists, maybe email us at <a href="mailto:bumaa@bu.edu" target="_blank">bumaa@bu.edu</a>' +
            'to let us know this is broken)</p>';
    }
})();