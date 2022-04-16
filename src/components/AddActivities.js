import React, { useState } from "react";
import { callApi } from "../api";
const AddActivities = ({ token, user, activities, setActivities }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await callApi({
      url: "/activities",
      method: "POST",
      token,
      body: { name, description },
    });
    console.log("activities!!!!", activities);
    const allActivitiesResp = await callApi({
      url: `/activities`,
      method: "GET",
    });
    setActivities(allActivitiesResp);
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
