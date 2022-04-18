import React, { useState } from "react";
import { callApi } from "../api";

const MyRoutines = ({
  token,
  user,
  routines,
  setRoutines,
  setUserRoutines,
}) => {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();

    await callApi({
      url: "/routines",
      method: "POST",
      token,
      body: { name, goal, isPublic },
    });

    setName("");
    setGoal("");
  };
  const reRenderUserRoutines = async () => {
    const data = await callApi({
      url: `/users/${user.username}/routines`,
      method: "GET",
      token,
    });
    setUserRoutines(data);
    reRenderUserRoutines();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <br></br>
        <label>Create a new fitness routine</label>
        <br></br>
        <input
          type="text"
          placeholder="name"
          value={name}
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
