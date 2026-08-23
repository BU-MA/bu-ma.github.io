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
            ["2026-08-22T18:00:00", "https://forms.gle/7yhTPbNwTEmpKLCJ6"], // interest form so we could show this at splash if needed
            ["2026-09-09T17:00:00", "https://forms.gle/7U9XUwx8FHFcRiyr7"],
            ["2026-09-14T17:30:00", "https://forms.gle/3pL4swq8Q5Swp2mc9"],
            ["2026-09-16T17:00:00", "https://forms.gle/UJkGDPAfazGJBEYF8"],
            ["2026-09-21T17:30:00", "https://forms.gle/vfMWvqWu8qRhD3yS9"],
            ["2026-09-23T17:00:00", "https://forms.gle/ATMLvAVfdqHjZXPK9"],
            ["2026-09-28T17:30:00", "https://forms.gle/jPFc9m8Nx4sGJ5XCA"],
            ["2026-09-30T17:00:00", "https://forms.gle/3qiS6zu584qrCU4N6"],
            ["2026-10-05T17:30:00", "https://forms.gle/ykoaqEhceZRKSuZN7"],
            ["2026-10-07T17:00:00", "https://forms.gle/ktJtQjB8Ui5tCA5n7"],
            ["2026-10-12T17:30:00", "https://forms.gle/93r4c4Ut76vjxLVTA"],
            ["2026-10-14T17:00:00", "https://forms.gle/kUCAns3RycsVrfYC7"],
            ["2026-10-19T17:30:00", "https://forms.gle/wLf2EsqjiKJMQDWx6"],
            ["2026-10-21T17:00:00", "https://forms.gle/6taFevu1GAaDCQNMA"],
            ["2026-10-26T17:30:00", "https://forms.gle/WYrSQ46WUFHX6KoJ8"],
            ["2026-10-28T17:00:00", "https://forms.gle/y99MkdDGPy3rtDXm7"],
            ["2026-11-02T17:30:00", "https://forms.gle/4sh7uVXbboDFn7aa8"],
            ["2026-11-04T17:00:00", "https://forms.gle/2vvKD5tkfzKQdpci9"],
            ["2026-11-09T17:30:00", "https://forms.gle/LhYh2MzkbnaPm1iv9"],
            ["2026-11-11T17:00:00", "https://forms.gle/HPEkVLyLPskXYnNr5"],
            ["2026-11-16T17:30:00", "https://forms.gle/bbG8mxkyRKKQi87E8"],
            ["2026-11-18T17:00:00", "https://forms.gle/XmBeozRksW3eDKdV6"],
            ["2026-11-23T17:30:00", "https://forms.gle/o3F9c8nT2P9uNJiDA"],
            ["2026-11-30T17:30:00", "https://forms.gle/JFyTG9n9AdyVmCB2A"],
            ["2026-12-02T17:00:00", "https://forms.gle/EhEXPhad4rEMiJC39"],
            ["2026-12-07T17:30:00", "https://forms.gle/b9pgj2zs3HPq8owL6"],
            ["2026-12-09T17:00:00", "https://forms.gle/tLXwxTLXXEtgibAR9"]
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
        .find(date => (date.getTime() - PREFIRE_TIME) <= now.getTime())

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