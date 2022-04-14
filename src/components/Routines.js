import React, { useState, useEffect } from "react";

import { callApi } from "../api";

const Routines = () => {
  const [routines, setRoutines] = useState([]);
  useEffect(() => {
    const getRoutines = async () => {
      const data = await callApi({
        url: `/routines`,
        method: "GET",
      });
      console.log("data from GET routines callApi", data);
      setRoutines(data);
    };
    getRoutines();
  }, []);
  console.log("routines", routines);
  return (
    <>
      <h1>This is the routines page</h1>
      {routines.map((routine) => {
        return (
          <div key={routine.id}>
            <h2>Routine: {routine.name}</h2>
            <p>Creator: {routine.creatorName}</p>
            <p>Goal: {routine.goal}</p>
          </div>
        );
      })}
    </>
  );
};

export default Routines;
