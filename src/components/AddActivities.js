import React, { useState } from "react";
import { callApi } from "../api";

const AddActivities = ({ token, setActivities }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    await callApi({
      url: "/activities",
      method: "POST",
      token,
      body: { name, description },
    });

    const allActivitiesResp = await callApi({
      url: `/activities`,
      method: "GET",
    });
    setActivities(allActivitiesResp);
    setName("");
    setDescription("");
  };

  const reRenderActivities = async () => {
    const allActivities = await callApi({
      url: `/activities`,
      method: "GET",
    });
    setActivities(allActivities);
    reRenderActivities();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Create a new activity</label>
        <br></br>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          placeholder="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
export default AddActivities;
