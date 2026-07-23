/*
 * This file generates QR codes for attendance for the current event.
 * The QR code is set an hour before the current event.
 *
 * The way the code works is you create a link (eg. to a google form) for your attendance sheet for a certain meeting.
 * You can then insert that into the dateToLink variable below as follows.
 * Add a line that says
 * ["YYYY-MM-DDTHH:MM:SS", "the link you want the QR code to go to"]
 * Use 24 hour time for the HH.
 * For example, if I wanted to create a meeting for 09/22/2026 at 6PM = 18:00 which links to google.com, I'd have a row
 * that says
 * ["2026-09-22T18:00:00", "https://google.com"]
 * An hour before the meeting starts, https://bu-ma.github.io/attendance.html will generate a QR code that links to
 * your link. If you want to change how long before the meeting starts that the QR code is generated, edit the
 * PREFIRE_TIME variable.
 */


(function thisDoesStuff() {
    const dateToLink = new Map(
        [
            // add your times and links here!
            // be sure to put commas after all of them, except the last one
            ["2026-09-22T18:00:00", "https://forms.gle/7yhTPbNwTEmpKLCJ6"]
        ].map(([d, l]) => [new Date(d), l])
    );


    // time is measured in ms
    // I want this to be an hour, so 60 minutes times 60 seconds times 1000 ms
    // if you want to change it, keep this in mind
    const PREFIRE_TIME = 60*60*1000;

    const now = new Date();

    // finds the first entry in dateToLink whose date is greater or equal to the current time
    const targetDate = dateToLink.keys().toArray()
        .sort((a, b) => a.getTime() - b.getTime())
        .find(date => (date.getTime() - PREFIRE_TIME) >= now.getTime())

    if (!targetDate) { return; }

    // defines the qr code
    // feel free to change any of the styling attributes
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: dateToLink.get(targetDate),
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
})();