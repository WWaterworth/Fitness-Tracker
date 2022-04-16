import React, { useState } from "react";
import { DeleteRoutine } from "./index";
import { callApi } from "../api";

const MyRoutines = ({ token, user, routines, setRoutines }) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await callApi({
      url: "/routines",
      method: "POST",
      token,
      body: { name, goal, isPublic },
    });
    console.log("Response!!!!", resp);
    const allRoutinesResp = await callApi({ url: `/routines`, method: "GET" });
    console.log("routinesResponse!!!!", allRoutinesResp);
    setRoutines(allRoutinesResp);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          placeholder="goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
        />
        <div>
          <input
            type="checkbox"
            value={isPublic}
            onChange={(event) => setIsPublic(isPublic)}
          />
          <span className="public" style={{ marginLeft: "8px" }}>
            {" "}
            Is Public?{" "}
          </span>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
export default MyRoutines;
