Routes

As any user when browsing the app, I want to

<!-- click links/tabs that display different parts of the app.
see the route I am visiting in the url bar (i.e. Routines tab should have a route https://example.com/routines)
stay on the "same page", while seeing the content update (i.e. use React Router, no page refresh)
see Components/Tabs with corresponding routes:
Home
Routines
My Routines
Activities
Login/Register (optional. Could be alternatively created as a modal or part of the header/footer) -->

User
As an unregistered visitor I want to:

<!-- see a Sign Up/Sign In form in the header/footer, on a tab (with or without matching route) or in a modal
be able to sign up for a new account with valid username/password combination -->

<!-- see meaningful messages if there are errors during registration, so that I may correct them -->

<!-- see tabbed navigation for Routines and Activities (with matching routes) -->

As a registered user I want to:

<!-- be able to log in with my username/password combination -->

<!-- see meaningful messages if there are errors during login, so that I may correct them -->

stay logged in between page visits (for example, if I close my browser, and come back later)

<!-- be able to log out if I am logged in -->

<!-- see tabbed navigation for Routines, My Routines (once logged in), and Activities (with matching routes)
Routines -->

As any user on the Routines tab, I want to:

<!-- see a list of all public routines showing:
The routine name, goal, and creator's username
A list of activities for the routine, including their name, description, and duration and/or count -->

As a registered user on the My Routines tab, I want to:

<!-- be shown a form to create a new routine
the form should have text fields for name and goal -->

for each routine which is owned by me I should:
be able to update the name and goal for the routine

<!-- be able to delete the entire routine -->

be able to add an activity to a routine via a small form which has a dropdown for all activities, an inputs for count and duration
be able to update the duration or count of any activity on the routine
be able to remove any activity from the routine

Activities

As an unregistered visitor on the Activities tab, I want to:

<!-- see a list of all activities which have been created -->

As a registered user on the Activities tab, I want to:

<!-- be shown a form to create a new activity (by name and description) -->

be shown an error if the activity already exists
