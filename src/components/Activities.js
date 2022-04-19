import React, { useEffect } from "react";
import { callApi } from "../api";

const Activities = ({ activities, setActivities }) => {
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

  return (
    <>
      <h1>Track.r Activities</h1>
      {activities.map((activity) => {
        return (
          <div className="singlePosts" key={activity.id}>
            <h2>Activity: {activity.name}</h2>
            <p>Description: {activity.description}</p>
          </div>
        );
      })}
    </>
  );
};
export default Activities;
