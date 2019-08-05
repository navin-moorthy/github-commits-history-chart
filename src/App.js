import React, { useState } from "react";
import axios from "axios";
import Chart from "react-google-charts";

const App = () => {
  const [searchName, setSearchName] = useState("");
  const [userName, setuserName] = useState("");
  const [publicRepoCount, setpublicRepoCount] = useState(0);
  const [publicRepos, setpublicRepos] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [displayModal, setdisplayModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

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
    setdisplayModal(true);
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
          <li key={publicRepo.id}>
            <span onClick={handleRepoClick}>{publicRepo.name}</span>
          </li>
        ))}
      </ul>
      {displayModal && (
        <div>
          <Chart
            width={"500px"}
            height={"300px"}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={chartData[currentPage]}
            options={{
              chart: {
                title: "Commit Frequecy",
                subtitle: "Commits trend for last 52 weeks"
              }
            }}
            // For tests
            rootProps={{ "data-testid": "2" }}
          />
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === 5}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
