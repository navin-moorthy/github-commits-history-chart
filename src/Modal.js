import React, { useState } from "react";
import Chart from "react-google-charts";

const Modal = ({ chartData, showModal, closeModal }) => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <>
      {showModal && (
        <div className="modal">
          <div className="modal-body">
            <Chart
              width={"500px"}
              height={"300px"}
              chartType="Bar"
              loader={<div>Loading Chart</div>}
              data={chartData[currentPage]}
              options={{
                chart: {
                  title: "Commit Frequency",
                  subtitle: "Commits trend for last 52 weeks"
                },
                colors: ["#7d058d"],
                legend: { position: "none" }
              }}
            />
            <div className="modal-actions">
              <div>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="app-buttons modal-buttons__green"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === 5}
                  className="app-buttons modal-buttons__blue"
                >
                  Next
                </button>
              </div>
              <button
                onClick={closeModal}
                className="app-buttons modal-buttons__red"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
