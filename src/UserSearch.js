import React from "react";

const UserSearch = ({ searchName, handleChange, handleSubmit }) => {
  return (
    <form className="app-formGroup" onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={searchName}
        onChange={handleChange}
        placeholder="Search for the Username"
      />
      <button
        disabled={searchName === ""}
        className="app-buttons formGroup__white"
      >
        Submit{" "}
      </button>
    </form>
  );
};

export default UserSearch;
