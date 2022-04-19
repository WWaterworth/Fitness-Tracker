import React from "react";

const Home = ({ user }) => {
  return (
    <div id="title">
      <h1>
        <br /> Welcome {user.username}
        <br /> to
        <br /> Fitness Track.r
      </h1>
      <h5>Exercise Routines and Activities For Everyone</h5>
    </div>
  );
};
export default Home;
