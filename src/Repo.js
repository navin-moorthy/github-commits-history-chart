import React from "react";

const Repo = ({ publicRepos, handleRepoClick, userName }) => (
  <>
    {userName && publicRepos.length !== 0 && (
      <div>
        <h2 className="text-center">Public Repositories</h2>
        <ul className="app-repoContainer">
          {publicRepos.map(publicRepo => (
            <li
              key={publicRepo.id}
              className="repo-list text-center"
              onClick={handleRepoClick}
            >
              {publicRepo.name}
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
);

export default Repo;
