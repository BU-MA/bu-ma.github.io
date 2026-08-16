# bu-ma.github.io
The official website of the Boston University Mathematics Association.

This website was developed by Grant Talbert.

## ignore this

brainstorming some ideas for stuff to add
- PICTURES OF PAST EVENTSSSSS
- problem of the week (putnam style)
  - should have a way for ppl to submit this, might just go with a google form cuz idk how to protect against code injections
  - possible prize for the winner? dunno if we can afford that. maybe a prize for whoever gets the most right over the sem
- reu/course resources page
- we should have an integration bee leaderboard that also shows past events
  - we could also archive problems
- alumni page
- add metadata to more nicely format discord links
- maybe each event gets its own page?
- possibly refactor talks into "posts" which contains lecture notes + posts about like the theorem of the week for example and solns to the problem of the week and newsletters we might make etc
- mobile + accessibility + low motion
  - the mobile nav menus and homepage title card are FUCKED
  - need to pass over the css and ensure accessibility features and people who prefer low motion get what they want
- add a light mode for each theme and remove the default theme
  - maybe add notifications for when you change themes so if ppl change to light mode i can say "Why...?"

## some todo stuff

- the past semester events pages are not good. need to do some work on past-events.js to get that running correctly
- css for (talks -> posts)
- css for contacts
- silly page
- alum page
- css for past sem events pages
- set up theorems of the week
- set up weekly putnam problem
- light mode & notifs
- set a default theme
- mobile + accessibility considerations
- edit content of leadership page
- possibly edit content of about page




example code that can go into a `post-detail.css`-themed post
```html
    <h2>On the Schedule</h2>
    <p>General meetings and Putnam practice both continue on their usual nights:</p>
    <div class="post-schedule">
      <div class="schedule-row">
        <span class="schedule-day">Wed</span>
        <span class="schedule-detail">General meetings &middot; CDS 365, 6&ndash;7pm</span>
      </div>
      <div class="schedule-row">
        <span class="schedule-day">Mon</span>
        <span class="schedule-detail">Putnam practice with Prof. Weinstein &middot; CDS 365, 5:30&ndash;7:30pm</span>
      </div>
    </div>
```