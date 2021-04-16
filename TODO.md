TODO:

- css / stylistic changes to saveUser button (+ call api to save username)
  - profile display page
- prefill use audio/ use video (figure out where this would happen)
- load most recent position
  - in town join handler when creating a player, if they're logged in AND if they've already been in the town they're trying to join, set the location to their previous location (from getUserByID call)
- call API's instead of using mocks in Login.tsx, TownSelection.tsx, handleJoin?
- make sure it deploys, make sure Auth0 works with deploy
- clean up code diagram to reflect most recent design (for writeup)
- documentation

TODO for the others

- backend testing
- reformat repositories (try to combine all update/ get queries into one each time)
  - need to have a join across maps table too
- save last position in town (on disconnect handler)
  - will need to find player's location, then call API
-

TA Q's

- deployment / deployment issue
- how to use Auth0 with Heroku??
- prefill useAudio/ useVideo (understanding that code)
- figure out how to load most recent position

TODO for final deliverable: ✓ ☐
☐ Have a working implementation of our user stories
☐ Any added features have tests
-these tests have no ESLint warnings or errors
☐ README.md file contains:
☐ detailed instruction to deploy the application with your new feature
☐ document includes a link to git repository or instructions to access it
✓ FEATURES.md file contains:
✓ sufficient documentation for a user to interact with the updated version of covey town
✓ covers all steps the user would need to exercise each of the user stories
☐ DESIGN.md file contains:
☐ a description of any substative changes to the existing covey town codebase
☐ architecture of new code
☐ uses crc cards / diagrams to help describe the structure
☐ Demonstration video:
☐ is less than 10 minutes
☐ contains a brief description of the high level components introduced or modified
☐ successfully demonstrates all of the primary implemented user stories
