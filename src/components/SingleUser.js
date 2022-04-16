import React, { useState, useEffect } from "react";
import { DeleteRoutine } from "./index";
import { useParams } from "react-router-dom";
import { callApi } from "../api";

const SingleUser = ({
  token,
  singleUser,
  setSingleUser,
  routines,
  setRoutines,
  user,
}) => {
  useEffect(() => {
    const getSingleUser = async () => {
      const data = await callApi({
        url: `/users/${user.username}/routines`,
        method: "GET",
        token,
      });
      setSingleUser(data);
      console.log("SET SINGLE USER", singleUser);
    };
    getSingleUser(singleUser);
  }, []);

  const deletePost = async (routineId) => {
    await callApi({
      url: `/routines/${routineId}`,
      method: "DELETE",
      token,
    });
  };

  return (
    <>
      <h1>This is the single user routines page</h1>
      {singleUser.map((routine) => {
        console.log("are you undefined?", routine.activity);
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
export default SingleUser;
