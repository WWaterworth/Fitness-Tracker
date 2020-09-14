require('dotenv').config();
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

const { rebuildDB, testDB } = require('../db/seedData');
const { getUserById, getAllActivities, getActivityById, createActivity, updateActivity, getRoutineById, getAllRoutines, getAllPublicRoutines, getAllRoutinesByUser, getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, destroyRoutine, createUser, getUser, getRoutineActivitiesByRoutine, addActivityToRoutine, updateRoutineActivity, destroyRoutineActivity } = require('../db');
const client = require('../db/client');

describe('Database', () => {
  beforeAll(async() => {
    await rebuildDB();
  })
  describe('Users', () => {
    let userToCreateAndUpdate;
    let userCredentials = {username: 'billybob', password: 'bobbybadboy'};
    describe('createUser({ username, password })', () => {
      it('Hash the password before storing it to the database', async () => {
        const hashedPassword = bcrypt.hashSync(userCredentials.password, SALT_COUNT);
        userToCreateAndUpdate = await createUser({
          username: userCredentials.username,
          password: hashedPassword // not the plaintext
        });
        const {rows: [queriedUser]} = await client.query(`SELECT * FROM users WHERE username = $1`, [userCredentials.username])
        expect(userToCreateAndUpdate.username).toBe(userCredentials.username);
        expect(queriedUser.username).toBe(userCredentials.username);
        expect(queriedUser.password).not.toBe(userCredentials.password);
      })
    })
    describe('getUser({ username, password })', () => {
      it('Verifies the password against the hashed password', async () => {
        const verifiedUser = await getUser(userCredentials);
        const unVerifiedUser = await getUser({username: userCredentials.username, password: 'badPassword'});
        expect(verifiedUser).toBeTruthy();
        expect(verifiedUser.username).toBe(userCredentials.username);
        expect(verifiedUser.password).toBeFalsy;
        expect(unVerifiedUser).toBeFalsy();
      })
    })
    describe('getUserById', () => {
      it('Gets a user based on the user Id', async () => {
        const user = await getUserById(userToCreateAndUpdate.id);
        expect(user).toBeTruthy();
        expect(user.id).toBe(userToCreateAndUpdate.id);
      })
    })
  })
  describe('Activities', () => {
    describe('getAllActivities', () => {
      it('selects and returns an array of all activities', async () => {
        const activities = await getAllActivities();
        const {rows: activitiesFromDatabase} = await client.query(`
        SELECT * FROM activities;
      `);
        expect(activities).toEqual(activitiesFromDatabase);
      })
    })
    describe('createActivity({ name, description })', () => {
      it('Creates and returns the new activity', async () => {
        const activityToCreate = { name: 'eliptical', description: '20 minutes of eliptical' };
        const createdActivity = await createActivity(activityToCreate);
        expect(createdActivity.name).toBe(activityToCreate.name);
        expect(createdActivity.description).toBe(activityToCreate.description);
      })
    })
    describe('updateActivity', () => {
      it('Updates name and description of an activity without affecting the ID. Returns the updated Activity.', async () => {
        const [activityToUpdate] = await getAllActivities();
        activityToUpdate.name = 'standing barbell curl';
        const activity = await updateActivity(activityToUpdate);
        delete activity.id;
        expect(activity).toEqual(activityToUpdate);
      })
    })
  })
  describe('Routines', () => {
    let routineToCreateAndUpdate;
    describe('getActivityById', () => {
      it('gets activities by their id', async () => {
        const activity = await getActivityById(1);
        expect(activity).toBeTruthy();
      })
    })
    describe('getAllRoutines', () => {
      let routine;
      beforeAll(async() => {
        [routine] = await getAllRoutines();
      })
      it('selects and returns an array of all routines, includes their activities', async () => {
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
      })
      it('includes username, from users join, aliased as creatorName', async () => {
        expect(routine).toEqual(expect.objectContaining({
          creatorName: expect.any(String),
        }));
      })
      it('includes duration and count on activities, from routine_activities join', async () => {
        const {activities: [firstActivity]} = routine;
        expect(firstActivity).toEqual(expect.objectContaining({
          duration: expect.any(Number),
          count: expect.any(Number),
        }));
      })
    })
    describe('getAllPublicRoutines', () => {
      let routine;
      beforeAll(async() => {
        [routine] = await getAllPublicRoutines();
      })
      it('selects and returns an array of all public routines, includes their activities', async () => {
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.public).toBe(true);
      })
      it('includes username, from users join, aliased as creatorName', async () => {
        expect(routine).toEqual(expect.objectContaining({
          creatorName: expect.any(String),
        }));
      })
      it('includes duration and count on activities, from routine_activities join', async () => {
        const {activities: [firstActivity]} = routine;
        expect(firstActivity).toEqual(expect.objectContaining({
          duration: expect.any(Number),
          count: expect.any(Number),
        }));
      })
    })
    describe('getAllRoutinesByUser', () => {
      let routine, user;
      beforeAll(async() => {
        user = await getUserById(1); 
        [routine] = await getAllRoutinesByUser(user);
      })
      it('selects and return an array of all routines made by user, includes their activities', async () => {
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.creatorId).toBe(user.id);
      })
      it('includes username, from users join, aliased as creatorName', async () => {
        expect(routine).toEqual(expect.objectContaining({
          creatorName: expect.any(String),
        }));
      })
      it('includes duration and count on activities, from routine_activities join', async () => {
        const {activities: [firstActivity]} = routine;
        expect(firstActivity).toEqual(expect.objectContaining({
          duration: expect.any(Number),
          count: expect.any(Number),
        }));
      })
    })
    describe('getPublicRoutinesByUser', () => {
      let routine, user;
      beforeAll(async() => {
        user = await getUserById(1); 
        [routine] = await getPublicRoutinesByUser(user);
      })
      it('selects and returns an array of all routines made by user, includes their activities', async () => {
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.creatorId).toBe(user.id);
        expect(routine.public).toBe(true);
      })
      it('includes username, from users join, aliased as creatorName', async () => {
        expect(routine).toEqual(expect.objectContaining({
          creatorName: expect.any(String),
        }));
      })
      it('includes duration and count on activities, from routine_activities join', async () => {
        const {activities: [firstActivity]} = routine;
        expect(firstActivity).toEqual(expect.objectContaining({
          duration: expect.any(Number),
          count: expect.any(Number),
        }));
      })
    })
    describe('getPublicRoutinesByActivity', () => {
      let routine, activity;
      beforeAll(async() => {
        activity = await getActivityById(3); 
        [routine] = await getPublicRoutinesByActivity(activity);
      })
      it('selects and return an array of public routines which have a specific activityId in their routine_activities join, includes their activities', async () => {
        expect(routine).toEqual(expect.objectContaining({
          id: expect.any(Number),
          creatorId: expect.any(Number),
          public: expect.any(Boolean),
          name: expect.any(String),
          goal: expect.any(String),
          activities: expect.any(Array),
        }));
        expect(routine.public).toBe(true);
      })
      it('includes username, from users join, aliased as creatorName', async () => {
        expect(routine).toEqual(expect.objectContaining({
          creatorName: expect.any(String),
        }));
      })
      it('includes duration and count on activities, from routine_activities join', async () => {
        const {activities: [firstActivity]} = routine;
        expect(firstActivity).toEqual(expect.objectContaining({
          duration: expect.any(Number),
          count: expect.any(Number),
        }));
      })
    })
    describe('createRoutine', () => {
      it('creates and returns the new routine', async () => {
        routineToCreateAndUpdate = await createRoutine({creatorId: 2, public: true, name: 'BodyWeight Day', goal: 'Do workouts that can be done from home, no gym or weights required.'});
        const queriedRoutine = await getRoutineById(routineToCreateAndUpdate.id)
        expect(routineToCreateAndUpdate).toEqual(queriedRoutine);
      })
    })
    describe('updateRoutine', () => {
      let queriedRoutine;
      beforeAll(async() => {
        routineToCreateAndUpdate = await updateRoutine({id: routineToCreateAndUpdate.id, public: false, name: 'Arms Day', goal: 'Do all workouts that work those arms!'});
        queriedRoutine = await getRoutineById(routineToCreateAndUpdate.id);
      })
      it('Returns the updated routine', async () => {
        expect(routineToCreateAndUpdate).toBeTruthy();
      })
      it('Finds the routine with id equal to the passed in id. Does not update the routine id.', async () => {
        expect(routineToCreateAndUpdate.id).toBe(queriedRoutine.id);
      })
      it('Updates the public status, name, or goal, as necessary', async () => {
        expect(routineToCreateAndUpdate.public).toBe(queriedRoutine.public);
        expect(routineToCreateAndUpdate.name).toBe(queriedRoutine.name);
        expect(routineToCreateAndUpdate.goal).toBe(queriedRoutine.goal);
      })
      it('Does not update fields that are not passed in', async () => {
        const name = 'Abs Day';
        routineToCreateAndUpdate = await updateRoutine({id: routineToCreateAndUpdate.id, name, goal: 'Do all workouts that work those arms!'});
        expect(routineToCreateAndUpdate.public).toBe(queriedRoutine.public);
        expect(routineToCreateAndUpdate.name).toBe(name);
        expect(routineToCreateAndUpdate.goal).toBe(queriedRoutine.goal);
      })
      
    })
    describe('destroyRoutine', () => {
      it('removes routine from database', async () => {
        await destroyRoutine(routineToCreateAndUpdate.id);
        const {rows: [routine]} = await client.query(`
          SELECT * 
          FROM routines
          WHERE id = $1;
        `, [routineToCreateAndUpdate.id]);
        expect(routine).toBeFalsy();
      })
      it('Deletes all the routine_activities whose routine is the one being deleted.', async () => {
        const queriedRoutineActivities = await getRoutineActivitiesByRoutine(routineToCreateAndUpdate)
        expect(queriedRoutineActivities.length).toBe(0);
      })
    })
  })
  describe('Routine Activities', () => {
    const routineActivityData = {
      routineId: 4,
      activityId: 8,
      count: 10,
      duration: 10000 
    }
    let routineActivityToCreateAndUpdate;
    describe('addActivityToRoutine({ routineId, activityId, count, duration })', () => {
      it('creates a new routine_activity, and return it', async () => {
        routineActivityToCreateAndUpdate = await addActivityToRoutine(routineActivityData);
        
        expect(routineActivityToCreateAndUpdate.routineId).toBe(routineActivityData.routineId);
        expect(routineActivityToCreateAndUpdate.activityId).toBe(routineActivityData.activityId);
        expect(routineActivityToCreateAndUpdate.count).toBe(routineActivityData.count);
        expect(routineActivityToCreateAndUpdate.duration).toBe(routineActivityData.duration);
      })
    })
    describe('updateRoutineActivity({ id, count, duration })', () => {
      it('Finds the routine with id equal to the passed in id. Updates the count or duration as necessary.', async () => {
        const newRoutineActivityData = {id: routineActivityToCreateAndUpdate.id, count: 15, duration: 150};
        routineActivityToCreateAndUpdate = await updateRoutineActivity(newRoutineActivityData);
        expect(routineActivityToCreateAndUpdate.id).toBe(newRoutineActivityData.id);
        expect(routineActivityToCreateAndUpdate.count).toBe(newRoutineActivityData.count);
        expect(routineActivityToCreateAndUpdate.duration).toBe(newRoutineActivityData.duration);
      })
    })
    describe('destroyRoutineActivity(id)', () => {
      it('remove routine_activity from database', async () => {
        const deletedRoutine = await destroyRoutineActivity(routineActivityToCreateAndUpdate.id);
        expect(deletedRoutine.id).toBe(routineActivityToCreateAndUpdate.id);
        const {rows} = await client.query(`
          SELECT * FROM routine_activities
          WHERE id = ${deletedRoutine.id}
        `)
        expect(rows.length).toBe(0);
      })
    })

  })
});