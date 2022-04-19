import React, { useEffect, useState } from "react";
import { callApi } from "../api";

const UserRoutines = ({
  activities,
  setActivities,
  token,
  userRoutines,
  setUserRoutines,
  user,
}) => {
  const [activityId, setActivityId] = useState(Number);
  const [count, setCount] = useState(Number);
  const [duration, setDuration] = useState(Number);
  const [nameToEdit, setNameToEdit] = useState("");
  const [goalToEdit, setGoalToEdit] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const getUserRoutines = async () => {
      const data = await callApi({
        url: `/users/${user.username}/routines`,
        method: "GET",
        token,
      });
      setUserRoutines(data);
    };
    getUserRoutines(userRoutines);
  }, []);

  useEffect(() => {
    const getActivities = async () => {
      const data = await callApi({
        url: `/activities`,
        method: "GET",
      });
      setActivities(data);
    };
    getActivities();
  }, []);

  const reRenderUserRoutines = async () => {
    const data = await callApi({
      url: `/users/${user.username}/routines`,
      method: "GET",
      token,
    });
    setUserRoutines(data);
    reRenderUserRoutines();
  };

  const addActivity = (routineId) => async (event) => {
    event.preventDefault();
    try {
      const response = await callApi({
        url: `/routines/${routineId}/activities`,
        method: "POST",
        body: { activityId, count, duration },
        token,
      });
      reRenderUserRoutines();
      return response;
    } catch (error) {
      alert(error);
    }
  };

  const editActivity = async (routineActivityId) => {
    const editedActivity = { count, duration };
    try {
      await callApi({
        url: `/routine_activities/${routineActivityId}`,
        method: "PATCH",
        token,
        body: { count, duration },
      });
      return editedActivity;
    } catch (error) {
      alert(error);
    }
  };

  const deleteActivity = async (routineActivityId) => {
    try {
      const response = await callApi({
        url: `/routine_activities/${routineActivityId}`,
        method: "DELETE",
        token,
      });
      reRenderUserRoutines();
      return response;
    } catch (error) {
      alert(error);
    }
  };

  const editPost = async (routineId, nameToEdit, goalToEdit, isPublic) => {
    await callApi({
      url: `/routines/${routineId}`,
      method: "PATCH",
      body: { name: nameToEdit, goal: goalToEdit, isPublic: isPublic },
      token,
    });

    setNameToEdit("");
    setGoalToEdit("");
    reRenderUserRoutines();
  };

  const deletePost = async (routineId) => {
    await callApi({
      url: `/routines/${routineId}`,
      method: "DELETE",
      token,
    });
    reRenderUserRoutines();
  };

  return (
    <>
      <h1>My Track.r Fitness Routines</h1>
      {userRoutines.map((routine) => {
        return (
          <div className="singlePosts" key={routine.id}>
            <h2>Routine: {routine.name}</h2>
            <p>Creator: {routine.creatorName}</p>
            <p>Goal: {routine.goal}</p>

            <input
              type="text"
              placeholder="Edit routine name"
              onChange={(event) => {
                console.log(event.target.value);
                setNameToEdit(event.target.value);
              }}
            />
            <br></br>
            <input
              type="text"
              placeholder="Edit routine goal"
              onChange={(event) => {
                console.log(event.target.value);
                setGoalToEdit(event.target.value);
              }}
            />
            <button
              type="submit"
              onClick={() =>
                editPost(routine.id, nameToEdit, goalToEdit, isPublic)
              }
            >
              Edit Routine
            </button>
            <br></br>
            <button type="submit" onClick={() => deletePost(routine.id)}>
              Delete Routine
            </button>
            <br></br>
            <br></br>
            {routine.activities.map((activity) => {
              return (
                <>
                  <ul>
                    <li>Activity Name: {activity.name}</li>
                    <li>Activity Description: {activity.description}</li>
                    <li>Activity Duration: {activity.duration}</li>
                    <li>Activity Count: {activity.count}</li>
                    <input
                      type="text"
                      placeholder="Edit activity count"
                      onChange={(event) => {
                        console.log(event.target.value);
                        setCount(event.target.value);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Edit activity duration"
                      onChange={(event) => {
                        console.log(event.target.value);
                        setDuration(event.target.value);
                      }}
                    />
                    <button
                      type="submit"
                      onClick={() => editActivity(activity.routineActivityId)}
                    >
                      Edit Activity
                    </button>
                  </ul>
                  <button
                    type="submit"
                    onClick={() => deleteActivity(activity.routineActivityId)}
                  >
                    Delete Activity
                  </button>
                </>
              );
            })}
            <form onSubmit={addActivity(routine.id)}>
              <label>Add an activity to this routine:</label>
              <br></br>
              <select onChange={(event) => setActivityId(event.target.value)}>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
              <fieldset>
                <label>Repetitions: </label>
                <input
                  type="number"
                  onChange={(event) => {
                    setCount(event.target.value);
                  }}
                />
              </fieldset>
              <fieldset>
                <label>Duration: </label>
                <input
                  type="number"
                  onChange={(event) => {
                    setDuration(event.target.value);
                  }}
                />
              </fieldset>
              <button type="Submit">Submit New Activity</button>
            </form>
          </div>
        );
      })}
    </>
  );
};
export default UserRoutines;
