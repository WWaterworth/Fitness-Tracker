import React, { useEffect, useState } from "react";
import { callApi } from "../api";

const UserRoutines = ({
  activities,
  setActivities,
  token,
  userRoutines,
  setUserRoutines,
  routines,
  setRoutines,
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
      <h1>This is the single user routines page</h1>
      {userRoutines.map((routine) => {
        return (
          <div key={routine.id}>
            <h2>Routine: {routine.name}</h2>
            <p>Creator: {routine.creatorName}</p>
            <p>Goal: {routine.goal}</p>
            <form onSubmit={addActivity(routine.id)}>
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
            <input
              type="text"
              placeholder="Edit routine name"
              onChange={(event) => {
                console.log(event.target.value);
                setNameToEdit(event.target.value);
              }}
            />
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
            <button type="submit" onClick={() => deletePost(routine.id)}>
              Delete
            </button>
            {routine.activities.map((activity) => {
              return (
                <>
                  <ul>
                    <li>Activity Name: {activity.name}</li>
                    <li>Activity Description: {activity.duration}</li>
                    <li>Activity Duration: {activity.duration}</li>
                    <li>Activity Count: {activity.count}</li>
                  </ul>
                </>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
export default UserRoutines;
