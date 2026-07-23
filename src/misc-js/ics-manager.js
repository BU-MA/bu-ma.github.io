
/**
 * Generates an ics file for an event using the provided data.
 * @param event The event object corresponding to the event.
 * @param startTime The start time of the event, usually saved as event.datetime, but passed directly to allow timezone
 * conversions
 * @param endTime The endtime of the event.
 * @returns A string to be used as the contents of an ics file.
 */
export function generateICS(event, startTime, endTime) {
    const formatICSDate = (date) => date
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0]
        + 'Z';

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//BUMA//Events//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@bu-ma.github.io`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${formatICSDate(startTime)}`,
        `DTEND:${formatICSDate(endTime)}`,
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location}`,
        `DESCRIPTION:${event.description.replace(/<[^>]*>/g, '').replace(/\n/g, '\\n')}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
}

/**
 * Downloads an isc file for the given event.
 * @param event The event object corresponding to the event.
 * @param startTime The start time of the event, usually saved as event.datetime, but passed directly to allow timezone
 * conversions
 * @param endTime The endtime of the event.
 */
export function downloadICS(event, startTime, endTime) {
    const icsContent = generateICS(event, startTime, endTime);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=UTF-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-a]/gi, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
}