import React from "react";

const UserSearch = ({ searchName, handleChange, handleSubmit }) => {
  return (
    <form className="app-getUsername" onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={searchName}
          onChange={handleChange}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default UserSearch;
