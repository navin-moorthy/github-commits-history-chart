import React, { useState } from "react";
import axios from "axios";

// Components
import Modal from "./Modal";
import UserSearch from "./UserSearch";

const App = () => {
  const [searchName, setSearchName] = useState("");
  const [userName, setuserName] = useState("");
  const [publicRepoCount, setpublicRepoCount] = useState(0);
  const [publicRepos, setpublicRepos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleChange = event => {
    setSearchName(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const userNameRes = await axios.get(
      `https://api.github.com/users/${searchName}`
    );
    setuserName(userNameRes.data.login);
    setpublicRepoCount(userNameRes.data.public_repos);
    setSearchName("");
    const publicrepoRes = await axios.get(
      `https://api.github.com/users/${searchName}/repos`
    );
    setpublicRepos(publicrepoRes.data);
  };

  const handleRepoClick = async event => {
    const commitStatRes = await axios.get(
      `https://api.github.com/repos/${userName}/${
        event.target.textContent
      }/stats/participation`
    );
    const totalCommits = commitStatRes.data.all;
    totalCommits.reverse();
    let weekCount = 1;
    let chartData = [];
    while (totalCommits.length > 0) {
      const splitCommits = [...totalCommits.splice(0, 10)];
      let splitChartData = [];
      // eslint-disable-next-line
      splitCommits.forEach(data => {
        splitChartData.push([`Week ${weekCount}`, data]);
        weekCount += 1;
      });
      splitChartData.unshift(["Weeks", "Total Commits"]);
      chartData.push(splitChartData);
    }
    setChartData(chartData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="app">
      <UserSearch
        searchName={searchName}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      {userName && (
        <div className="app-userInfo">
          <div>{userName}</div>
          <div>{publicRepoCount}</div>
        </div>
      )}
      <ul>
        {publicRepos.map(publicRepo => (
          <li key={publicRepo.id}>
            <span onClick={handleRepoClick}>{publicRepo.name}</span>
          </li>
        ))}
      </ul>
      <Modal
        chartData={chartData}
        showModal={showModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default App;
