import React, { useState } from "react";

const App = () => {
  const [userName, setUserName] = useState("");

  const handleChange = event => {
    setUserName(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    console.log(userName);
  };

  return (
    <div className="app">
      <form className="app-getUsername" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userName}
            onChange={handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default App;
