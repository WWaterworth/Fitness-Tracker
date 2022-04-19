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
    const allActivities = await callApi({ url: `/activities`, method: "GET" });
    setActivities(allActivitiesResp);
    reRenderActivities();
  };

  return (
    <>
      <br />
      <h2>Create a new Activity for Track.r</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New Activity name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="text"
          placeholder="New Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};
export default AddActivities;
