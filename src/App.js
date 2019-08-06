import React, { useState } from "react";
import axios from "axios";

// Components
import Modal from "./Modal";
import UserSearch from "./UserSearch";
import Bio from "./Bio";
import Repo from "./Repo";

const App = () => {
  // States
  const [searchName, setSearchName] = useState("");
  const [userName, setuserName] = useState("");
  const [invalidUser, setInvalidUser] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [publicRepos, setPublicRepos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Handle Username Input Change
  const handleChange = event => {
    setSearchName(event.target.value);
  };

  // Handle Form Submit
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
      setPublicRepos(publicRepoRes.data);
    } catch (err) {
      setInvalidUser(true);
      setSearchName("");
    }
  };

  // Handle each repository click
  const handleRepoClick = async event => {
    const commitStatRes = await axios.get(
      `https://api.github.com/repos/${userName}/${
        event.target.textContent
      }/stats/participation`
    );
    const weeklyCommits = commitStatRes.data.all.reverse();
    // Pagination Calculation
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

  // Handle Modal Close
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
      {invalidUser && (
        <div className="bio-warning text-center">
          Please enter a valid username!!
        </div>
      )}
      {!invalidUser && <Bio userName={userName} userDetails={userDetails} />}
      {!invalidUser && (
        <Repo
          userName={userName}
          publicRepos={publicRepos}
          handleRepoClick={handleRepoClick}
        />
      )}
      {showModal && <Modal chartData={chartData} closeModal={closeModal} />}
    </div>
  );
};

export default App;
