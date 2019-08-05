import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [searchName, setSearchName] = useState("");
  const [userName, setuserName] = useState("");
  const [publicRepoCount, setpublicRepoCount] = useState(0);
  const [publicRepos, setpublicRepos] = useState([]);

  const handleChange = event => {
    setSearchName(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios
      .get(`https://api.github.com/users/${searchName}`)
      .then(res => {
        setuserName(res.data.login);
        setpublicRepoCount(res.data.public_repos);
        setSearchName("");
      })
      .catch(err => console.log(err));
    axios
      .get(`https://api.github.com/users/${searchName}/repos`)
      .then(res => {
        console.log(res);
        setpublicRepos(res.data);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="app">
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
      {userName && (
        <div className="app-userInfo">
          <div>{userName}</div>
          <div>{publicRepoCount}</div>
        </div>
      )}
      <ul>
        {publicRepos.map(publicRepo => (
          <li key={publicRepo.id}>{publicRepo.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
