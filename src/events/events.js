/*
 * Loads events.json and populates the three tiers on the events page:
 *   1. #eventFeatured     - the single next upcoming event (big, prominent)
 *   2. #eventHighlights   - anything else happening in the next 14 days (medium)
 *   3. #eventAccordion    - everything further out, as collapsed rows
 *
 * Written by grant talbert. Rewritten fall 2026 for the tiered layout.
 *
 * HOW THE SPLIT WORKS
 * All non-TBD, non-past events are sorted chronologically. The first one
 * becomes "featured". Of the ones left, anything starting within
 * HIGHLIGHT_WINDOW_DAYS of *today* (not of the featured event) becomes
 * "highlighted". Everything else falls into the collapsed accordion.
 * Change HIGHLIGHT_WINDOW_DAYS below to widen/narrow that window.
 */

import { downloadICS } from '../misc-js/ics-manager.js';

const HIGHLIGHT_WINDOW_DAYS = 14;

(async function loadEvents() {
    const featuredContainer = document.getElementById('eventFeatured');
    const highlightsContainer = document.getElementById('eventHighlights');
    const accordionContainer = document.getElementById('eventAccordion');

    // this page might not have all three tiers present (e.g. a future stripped-down
    // version) so bail gracefully rather than assuming all of them exist
    if (!featuredContainer && !highlightsContainer && !accordionContainer) {
        return;
    }

    // declared here (not inside the try block) so that renderHighlights() below,
    // which is defined outside the try block, can still see it when it runs
    const now = new Date();

    try {
        const response = await fetch('/src/events/events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const highlightCutoff = new Date(now.getTime() + HIGHLIGHT_WINDOW_DAYS * 86400000);

        const upcomingEvents = (await response.json())
            .filter(event => {
                if (event.datetime === "TBD" || !event.duration) return false;
                const startTime = new Date(event.datetime);
                const endTime = new Date(startTime.getTime() + event.duration * 60000);
                return endTime > now;
            })
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

        if (upcomingEvents.length === 0) {
            renderEmptyState();
            return;
        }

        const [featured, ...rest] = upcomingEvents;
        const highlighted = rest.filter(e => new Date(e.datetime) <= highlightCutoff);
        const later = rest.filter(e => new Date(e.datetime) > highlightCutoff);

        renderFeatured(featured);
        renderHighlights(highlighted);
        renderAccordion(later);

        if (window.MathJax) {
            window.MathJax.typesetPromise();
        }

    } catch (error) {
        console.error("Failed to load upcoming events:", error);
        renderErrorState();
    }

    // ---------------------------------------------------------------
    // Tier 1: Featured
    // ---------------------------------------------------------------
    function renderFeatured(event) {
        if (!featuredContainer) return;

        const startTime = new Date(event.datetime);
        const endTime = new Date(startTime.getTime() + event.duration * 60000);

        featuredContainer.innerHTML = `
            <div class="event-featured-date">
                <span class="event-featured-weekday">${startTime.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span class="event-featured-day">${startTime.getDate()}</span>
                <span class="event-featured-month">${startTime.toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
            <div class="event-featured-body">
                <span class="event-featured-eyebrow">Up Next</span>
                <h3>${event.title}</h3>
                <p class="event-featured-meta">${formatTime(startTime)} &ndash; ${formatTime(endTime)} &middot; ${event.location}</p>
                <p class="event-featured-description">${event.description}</p>
                <button class="cta-button event-featured-cta">Add to Calendar</button>
            </div>
        `;

        featuredContainer.querySelector('.event-featured-cta').addEventListener('click', () => {
            downloadICS(event, startTime, endTime);
        });
    }

    // ---------------------------------------------------------------
    // Tier 2: Highlighted (next two weeks)
    // ---------------------------------------------------------------
    function renderHighlights(events) {
        const section = document.getElementById('coming-up-section');
        if (!highlightsContainer || !section) return;

        if (events.length === 0) {
            section.hidden = true;
            return;
        }
        section.hidden = false;
        highlightsContainer.innerHTML = '';

        events.forEach(event => {
            const startTime = new Date(event.datetime);
            const endTime = new Date(startTime.getTime() + event.duration * 60000);

            const card = document.createElement('article');
            card.className = 'event-card';
            card.innerHTML = `
                <div class="card-top">
                    <span class="date-badge">${formatDateBadge(startTime, now)}</span>
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

            card.querySelector('.add-to-calendar').addEventListener('click', () => {
                downloadICS(event, startTime, endTime);
            });

            highlightsContainer.appendChild(card);
            setUpReadMore(card);
        });
    }

    // ---------------------------------------------------------------
    // Tier 3: Collapsed accordion (rest of the semester)
    // ---------------------------------------------------------------
    function renderAccordion(events) {
        const section = document.getElementById('rest-of-sem-section');
        if (!accordionContainer || !section) return;

        if (events.length === 0) {
            section.hidden = true;
            return;
        }
        section.hidden = false;
        accordionContainer.innerHTML = '';

        events.forEach(event => {
            const startTime = new Date(event.datetime);
            const endTime = new Date(startTime.getTime() + event.duration * 60000);

            const row = document.createElement('div');
            row.className = 'event-row';
            row.innerHTML = `
                <button class="event-row-toggle" aria-expanded="false">
                    <span class="event-row-date">${startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span class="event-row-title">${event.title}</span>
                    <span class="event-row-icon" aria-hidden="true">+</span>
                </button>
                <div class="event-row-content">
                    <div class="event-row-content-inner">
                        <p class="event-meta">${formatDate(startTime)} &middot; ${formatTime(startTime)} &ndash; ${formatTime(endTime)} &middot; ${event.location}</p>
                        <p class="event-description">${event.description}</p>
                        <button class="event-row-cta shine-card">Add to Calendar</button>
                    </div>
                </div>
            `;

            row.querySelector('.event-row-toggle').addEventListener('click', () => {
                const toggle = row.querySelector('.event-row-toggle');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);
                row.classList.toggle('open');
            });

            row.querySelector('.event-row-cta').addEventListener('click', (e) => {
                e.stopPropagation();
                downloadICS(event, startTime, endTime);
            });

            accordionContainer.appendChild(row);
        });
    }

    function renderEmptyState() {
        if (featuredContainer) {
            featuredContainer.innerHTML = '<p class="event-empty-state">No upcoming events. Please check back soon!</p>';
        }
        document.getElementById('coming-up-section')?.setAttribute('hidden', '');
        document.getElementById('rest-of-sem-section')?.setAttribute('hidden', '');
    }

    function renderErrorState() {
        if (featuredContainer) {
            featuredContainer.innerHTML = '<p class="event-empty-state">Sorry, we were unable to load the event schedule. ' +
                '(If this error persists, maybe email us at <a href="mailto:bumaa@bu.edu" target="_blank">bumaa@bu.edu</a> to let us know this is broken)</p>';
        }
        document.getElementById('coming-up-section')?.setAttribute('hidden', '');
        document.getElementById('rest-of-sem-section')?.setAttribute('hidden', '');
    }

    // Only reveals "Read more" if the description is actually being clamped —
    // short descriptions never show the button at all.
    function setUpReadMore(card) {
        const finish = () => {
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
        };
        if (window.MathJax) {
            window.MathJax.typesetPromise([card]).then(finish);
        } else {
            finish();
        }
    }

    function formatDateBadge(startTime, now) {
        const startDay = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.round((startDay - today) / 86400000);

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays > 1 && diffDays < 7) {
            return `This ${startTime.toLocaleDateString('en-US', { weekday: 'long' })}`;
        }
        return startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatDate(date) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function formatTime(time) {
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
})();