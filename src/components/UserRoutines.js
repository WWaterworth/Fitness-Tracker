import React, { useEffect } from "react";

import { callApi } from "../api";

const UserRoutines = ({
  token,
  userRoutines,
  setUserRoutines,
  routines,
  setRoutines,
  user,
}) => {
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

  const reRenderUserRoutines = async () => {
    const data = await callApi({
      url: `/users/${user.username}/routines`,
      method: "GET",
      token,
    });
    setUserRoutines(data);
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
