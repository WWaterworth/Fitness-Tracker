import React, { useState, useEffect } from "react";
import { callApi } from "../api";

const Routines = ({ routines, setRoutines }) => {
  useEffect(() => {
    const getRoutines = async () => {
      const data = await callApi({
        url: `/routines`,
        method: "GET",
      });
      setRoutines(data);
      console.log(data);
    };
    getRoutines();
  }, []);

  return (
    <>
      <h1>This is the routines page</h1>
      {routines.map((routine) => {
        return (
          <div key={routine.id}>
            <h2>Routine: {routine.name}</h2>
            <p>Creator: {routine.creatorName}</p>
            <p>Goal: {routine.goal}</p>

            {routine.activities.map((activity) => {
              return (
                <ul key={activity.id}>
                  <li>Activity Name: {activity.name}</li>
                  <li>Activity Description: {activity.description}</li>
                  <li>Activity Duration: {activity.duration}</li>
                  <li>Activity Count: {activity.count}</li>
                </ul>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default Routines;
