import React, { useState } from "react";
import axios from "axios";

// Components
import Modal from "./Modal";
import UserSearch from "./UserSearch";
import Bio from "./Bio";
import Repo from "./Repo";

const App = () => {
  const [searchName, setSearchName] = useState("");
  const [userName, setuserName] = useState("");
  const [invalidUser, setInvalidUser] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [publicRepos, setpublicRepos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleChange = event => {
    setSearchName(event.target.value);
  };

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      const searchNameRes = await axios.get(
        `https://api.github.com/users/${searchName}`
      );
      setInvalidUser(false);
      setuserName(searchNameRes.data.login);
      setUserDetails(searchNameRes.data);
      setSearchName("");
      const publicRepoRes = await axios.get(
        `https://api.github.com/users/${searchName}/repos`
      );
      setpublicRepos(publicRepoRes.data);
    } catch (err) {
      setInvalidUser(true);
      setSearchName("");
    }
  };

  const handleRepoClick = async event => {
    const commitStatRes = await axios.get(
      `https://api.github.com/repos/${userName}/${
        event.target.textContent
      }/stats/participation`
    );
    const weeklyCommits = commitStatRes.data.all.reverse();
    let weekCount = 1;
    let chartData = [];
    while (weeklyCommits.length > 0) {
      const splitCommits = [...weeklyCommits.splice(0, 10)];
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
      <h2 className="app-title text-center">GitHub Commits History Chart</h2>
      <h5 className="app-subTitle text-center">
        Get weekly commit count on all public repos
      </h5>
      <UserSearch
        searchName={searchName}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <Bio
        userName={userName}
        userDetails={userDetails}
        invalidUser={invalidUser}
      />
      <Repo
        invalidUser={invalidUser}
        publicRepos={publicRepos}
        handleRepoClick={handleRepoClick}
        userName={userName}
      />
      <Modal
        chartData={chartData}
        showModal={showModal}
        closeModal={closeModal}
      />
    </div>
  );
};

export default App;
