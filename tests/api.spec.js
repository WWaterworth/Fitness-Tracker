const axios = require('axios');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {API_URL, JWT_SECRET} = process.env;
const SALT_COUNT = 10;

const { rebuildDB } = require('../db/seedData');
const { getUserById, createActivity, getPublicRoutinesByUser, getPublicRoutinesByActivity, getAllPublicRoutines, getRoutineById, createRoutine, getRoutineActivityById } = require('../db');
const client = require('../db/client')

describe('API', () => {
  let token, registeredUser;
  let routineActivityToCreateAndUpdate = {routineId: 4, activityId: 8, count: 20, duration: 300};
  beforeAll(async() => {
    await rebuildDB();
  })
  it('responds to a request at /api/health with a message specifying it is healthy', async () => {
    const res = await axios.get(`${API_URL}/api/health`);

    expect(typeof res.data.message).toEqual('string');
  });

  describe('Users', () => {
    let newUser = { username: 'robert', password: 'bobbylong321' };
    let newUserShortPassword = { username: 'robertShort', password: 'bobby21' };
    describe('POST /users/register', () => {
      let tooShortResponse;
      beforeAll(async() => {
        const successResponse = await axios.post(`${API_URL}/api/users/register`, newUser);
        registeredUser = successResponse.data.user;
        tooShortResponse = await axios.post(`${API_URL}/api/users/register`, newUserShortPassword);
      })
      it('Creates a new user.', () => {
        expect(typeof registeredUser).toEqual('object');
        expect(registeredUser.username).toEqual(newUser.username);
      });
      it('Requires username and password. Requires all passwords to be at least 8 characters long.', () => {
        expect(newUser.password.length).toBeGreaterThan(7);
      });
      it('Hashes password before saving user to DB.', async () => {
        const {rows: [queriedUser]} = await client.query(`
          SELECT *
          FROM users
          WHERE id = $1;
        `, [registeredUser.id]);
        expect(queriedUser.password).not.toBe(newUser.password);
        expect(await bcrypt.compare(newUser.password, queriedUser.password)).toBe(true);
      });
      it('Throw errors for duplicate username', async () => {
        const duplicateResponse = await axios.post(`${API_URL}/api/users/register`, newUser);
        expect(duplicateResponse.data.message).toBe('A user by that username already exists');
      });
      it('Throw errors for password-too-short.', async () => {
        expect(tooShortResponse.data.message).toBe('Password Too Short!');
      });
    });
    describe('POST /users/login', () => {
      it('Logs in the user. Requires username and password, and verifies that hashed login password matches the saved hashed password.', async () => {
        const {data} = await axios.post(`${API_URL}/api/users/login`, newUser);
        token = data.token;
        expect(data.token).toBeTruthy();
      });
      it('Returns a JSON Web Token. Stores the id and username in the token.', async () => {
        const parsedToken = jwt.verify(token, JWT_SECRET);
        expect(parsedToken.id).toEqual(registeredUser.id);
        expect(parsedToken.username).toEqual(registeredUser.username);
      });
    })
    describe('GET /users/:username/routines', () => {
      it('Gets a list of public routines for a particular user.', async () => {
        const userId = 2;
        const userWithRoutines = await getUserById(userId);
        const {data: routines} = await axios.get(`${API_URL}/api/users/${userWithRoutines.username}/routines`);
        const routinesFromDB = await getPublicRoutinesByUser(userWithRoutines);
        expect(routines).toBeTruthy();
        expect(routines).toEqual(routinesFromDB);
      });
    });
  });
  describe('Activities', () => {
    let activityToCreateAndUpdate = { name: 'Bicep Curls', description: 'They hurt, but you will thank you later' };
    describe('GET /activities', () => {
      it('Just returns a list of all activities in the database', async () => {
        const curls = { name: 'curls', description: '4 sets of 15.' };
        const createdActivity = await createActivity(curls);
        const {data: activities} = await axios.get(`${API_URL}/api/activities`);
        expect(Array.isArray(activities)).toBe(true);
        expect(activities.length).toBeGreaterThan(0);
        expect(activities[0].name).toBeTruthy();
        expect(activities[0].description).toBeTruthy();
        const [filteredActivity] = activities.filter(activity => activity.id === createdActivity.id);
        expect(filteredActivity.name).toEqual(curls.name);
        expect(filteredActivity.description).toEqual(curls.description);
      });
    });
    describe('POST /activities (*)', () => {
      it('Creates a new activity', async () => {
        const {data: respondedActivity} = await axios.post(`${API_URL}/api/activities`, activityToCreateAndUpdate, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedActivity.name).toEqual(activityToCreateAndUpdate.name);
        expect(respondedActivity.description).toEqual(activityToCreateAndUpdate.description);
        activityToCreateAndUpdate = respondedActivity;
      });
      xit('Requires logged in user', async () => {
        expect(false).toBe(true);
      });
    });
    describe('PATCH /activities/:activityId (*)', () => {
      it('Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)', async () => {
        const newActivityData = { name: 'Double Bicep Curls', description: 'They hurt EVEN MORE, but you will thank you later' }
        const {data: respondedActivity} = await axios.patch(`${API_URL}/api/activities/${activityToCreateAndUpdate.id}`, newActivityData, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedActivity.name).toEqual(newActivityData.name);
        expect(respondedActivity.description).toEqual(newActivityData.description);
      });
      xit('Requires logged in user', async () => {
        expect(false).toBe(true);
      });
    });
    describe('GET /activities/:activityId/routines', () => {
      it('Get a list of all public routines which feature that activity', async () => {
        const [testRoutine] = await getAllPublicRoutines();
        const [testActivity] = testRoutine.activities;
        const {data: routines} = await axios.get(`${API_URL}/api/activities/${testActivity.id}/routines`);
        const routinesFromDB = await getPublicRoutinesByActivity(testActivity)
        expect(routines).toEqual(routinesFromDB);
      });
    });
  });
  describe('Routines', () => {
    let routineToCreateAndUpdate = {public: true, name: 'Eliptical Day', goal: 'Work on that Eliptical!'};
    let routineToFail = {public: false, name: 'Eliptical Day 2', goal: 'Work on that Eliptical... again!'};
    const newRoutineData = {public: false, name: 'Eliptical Day Private', goal: 'Work on that Eliptical, yet again!'}
    describe('GET /routines', async () => {
      it('Returns a list of public routines, includes the activities with them', async () => {
        const publicRoutinesFromDB = await getAllPublicRoutines();
        const {data: publicRoutinesFromAPI} = await axios.get(`${API_URL}/api/routines`);
        expect(publicRoutinesFromAPI).toEqual(publicRoutinesFromDB);
      });
    });
    
    describe('POST /routines (*)', () => {
      it('Creates a new routine, with the creatorId matching the logged in user', async () => {
        const {data: respondedRoutine} = await axios.post(`${API_URL}/api/routines`, routineToCreateAndUpdate, { headers: {'Authorization': `Bearer ${token}`} });
        
        expect(respondedRoutine.name).toEqual(routineToCreateAndUpdate.name);
        expect(respondedRoutine.goal).toEqual(routineToCreateAndUpdate.goal);
        expect(respondedRoutine.name).toEqual(routineToCreateAndUpdate.name);
        expect(respondedRoutine.creatorId).toEqual(registeredUser.id);
        routineToCreateAndUpdate = respondedRoutine;
      });
      it('Requires logged in user', async () => {
        const {data: respondedRoutine} = await axios.post(`${API_URL}/api/routines`, routineToFail);
        expect(respondedRoutine.description).toBeFalsy();
      });
    });
    describe('PATCH /routines/:routineId (**)', async () => {
      it('Updates a routine, notably changing public/private, the name, or the goal', async () => {
        const {data: respondedRoutine} = await axios.patch(`${API_URL}/api/routines/${routineToCreateAndUpdate.id}`, newRoutineData, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedRoutine.name).toEqual(newRoutineData.name);
        expect(respondedRoutine.goal).toEqual(newRoutineData.goal);
        routineToCreateAndUpdate = respondedRoutine;
      });
      xit('Logged in user should be the owner of the modified object.', async () => {
        expect(false).toBe(true);
      });
    });
    describe('DELETE /routines/:routineId (**)', async () => {
      it('Hard deletes a routine. Makes sure to delete all the routineActivities whose routine is the one being deleted.', async () => {
        const {data: deletedRoutine} = await axios.delete(`${API_URL}/api/routines/${routineToCreateAndUpdate.id}`, { headers: {'Authorization': `Bearer ${token}`} });
        const shouldBeDeleted = await getRoutineById(deletedRoutine.id);
        expect(deletedRoutine.id).toBe(routineToCreateAndUpdate.id);
        expect(deletedRoutine.name).toBe(routineToCreateAndUpdate.name);
        expect(deletedRoutine.goal).toBe(routineToCreateAndUpdate.goal);
        expect(shouldBeDeleted).toBeFalsy();
      });
      xit('Logged in user should be the owner of the modified object.', async () => {
        expect(false).toBe(true);
      });
    });
    describe('POST /routines/:routineId/activities', async () => {
      let newRoutine
      it('Attaches a single activity to a routine.', async () => {
        newRoutine = await createRoutine({creatorId: registeredUser.id, name: 'Pull Ups', goal: '10 pull ups'})
        const {data: respondedRoutineActivity} = await axios.post(`${API_URL}/api/routines/${newRoutine.id}/activities`, {routineId: newRoutine.id, ...routineActivityToCreateAndUpdate}, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedRoutineActivity.routineId).toBe(newRoutine.id);
        expect(respondedRoutineActivity.activityId).toBe(routineActivityToCreateAndUpdate.activityId);
        routineActivityToCreateAndUpdate = respondedRoutineActivity;
      });
      it('Prevents duplication on (routineId, activityId) pair.', async () => {
        const {data: respondedRoutineActivity} = await axios.post(`${API_URL}/api/routines/${newRoutine.id}/activities`, routineActivityToCreateAndUpdate, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedRoutineActivity).toBeFalsy();
      });
    });
  });
  describe('routine_activities', () => {
    let newRoutineActivityData = {routineId: 3, activityId: 8, count: 25, duration: 200};
    describe('PATCH /routine_activities/:routineActivityId (**)', async () => {
      it('Updates the count or duration on the routine activity', async () => {
        const {data: respondedRoutineActivity} = await axios.patch(`${API_URL}/api/routine_activities/${routineActivityToCreateAndUpdate.id}`, newRoutineActivityData, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedRoutineActivity.count).toEqual(newRoutineActivityData.count);
        expect(respondedRoutineActivity.duration).toEqual(newRoutineActivityData.duration);
        routineActivityToCreateAndUpdate = respondedRoutineActivity;
      });
      it('Logged in user should be the owner of the modified object.', async () => {
        const {data: respondedRoutineActivity} = await axios.patch(`${API_URL}/api/routine_activities/${4}`, newRoutineActivityData, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedRoutineActivity.count).toBeFalsy();
      });
    });
    describe('DELETE /routine_activities/:routineActivityId (**)', async () => {
      it('Removes an activity from a routine, uses hard delete', async () => {
        const {data: deletedRoutineActivity} = await axios.delete(`${API_URL}/api/routine_activities/${routineActivityToCreateAndUpdate.id}`, { headers: {'Authorization': `Bearer ${token}`} });
        const shouldBeDeleted = await getRoutineActivityById(deletedRoutineActivity.id);
        expect(deletedRoutineActivity.id).toBe(routineActivityToCreateAndUpdate.id);
        expect(deletedRoutineActivity.count).toBe(routineActivityToCreateAndUpdate.count);
        expect(deletedRoutineActivity.duration).toBe(routineActivityToCreateAndUpdate.duration);
        expect(shouldBeDeleted).toBeFalsy();
      });
      it('Logged in user should be the owner of the modified object.', async () => {
        const {data: respondedRoutineActivity} = await axios.delete(`${API_URL}/api/routine_activities/${4}`, { headers: {'Authorization': `Bearer ${token}`} });
        expect(respondedRoutineActivity.count).toBeFalsy();
      });
    });
  });
});
