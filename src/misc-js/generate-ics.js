/*
 * Generates buma-events.ics, allowing users to subscribe to our event calendar
 * Executes on push via a github workflow
 */

const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, '../events/events.json');
const outputPath = path.join(__dirname, '../events/buma-events.ics');

const events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

function formatICSDate(date) {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function stripHtml(str) { return str.replace(/<[^>]*>/g, ''); }

function eventToVEVENT(event, index) {
    // skip events with no datetime or TBD placeholders
    if (event.datetime === 'TBD' || !event.datetime) {
        return null;
    }

    const startTime = new Date(event.datetime);
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    return [
        'BEGIN:VEVENT',
        `UID:buma-event-${index}-${startTime.getTime()}@bu-ma.github.io`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startTime)}`,
        `DTEND:${formatICSDate(endTime)}`,
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location}`,
        `DESCRIPTION:${stripHtml(event.description).replace(/\n/g, '\\n')}`,
        'END:VEVENT'
    ].join('\r\n');
}

const vevents = events.map(eventToVEVENT).filter(Boolean).join('\n');
const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BUMA//Events//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:BUMA Events',
    vevents,
    'END:VCALENDAR'
].join('\r\n');

fs.writeFileSync(outputPath, icsContent);
console.log(`Wrote ${events.length} events to ${outputPath}`);