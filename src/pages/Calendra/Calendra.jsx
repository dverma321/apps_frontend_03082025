import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendra.css";
import { fetchAllEntries, deleteEntry } from "../API/CalendraAPI.jsx";
import MonthlyExpenseChart from "../Chart/MonthlyExpenseChart.jsx";

const Calendra = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [allEntries, setAllEntries] = useState({});

  const formattedDate = selectedDate.toLocaleDateString("en-CA");


  // Fetch all entries when the component mounts
  useEffect(() => {
    fetchAllEntries().then((entriesMap) => {
      setAllEntries(entriesMap);
    });
  }, []);

  // Update displayed entries when the selected date changes
  useEffect(() => {
    setEntries(allEntries[formattedDate] || []);
  }, [selectedDate, allEntries]);


  const handleDeleteEntry = async (entryId) => {
    console.log("Entry ID to delete:", entryId); // Debugging log

    if (!entryId) {
      console.error("Error: Missing entry ID.");
      return;
    }

    const success = await deleteEntry(entryId);
    if (success) {
      setAllEntries((prevEntries) => {
        const newEntries = { ...prevEntries };
        Object.keys(newEntries).forEach((date) => {
          newEntries[date] = newEntries[date].filter((e) => e._id !== entryId);
        });
        return newEntries;
      });
    }
  };

  // Function to determine color based on the number of entries
  const getTileClassName = ({ date, view }) => {
    if (view === "month") {

      const dateStr = date.toLocaleDateString("en-CA");
      const entryCount = allEntries[dateStr]?.length || 0;

      if (entryCount >= 10) {
        return "red";
      } else if (entryCount >= 5) {
        return "orange";
      } else if (entryCount > 0) {
        return "green";
      }
    }
    return "";
  };

  return (
    <div className="calendraImage">
      {/* Top Part: Calendar and AddNewEntry */}
      <div className="top-section">

        <div className="calendar">
          <h2>Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="custom-calendar"
            tileClassName={getTileClassName}
          />
        </div>

        <div className="chart">

          {/* Bar chart  */}
          <MonthlyExpenseChart allEntries={allEntries} />
        </div>
      </div>

      {/* Bottom Part: Table of Entries */}
      <div>
        <div className="entries-list">
          {entries.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Sub Category</th>
                  <th>Price</th>
                  <th>Liters</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.entryType}</td>
                    <td>{entry.details}</td>
                    <td>{entry.price ? `₹${entry.price}` : "-"}</td>
                    <td>{entry.liters}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="btn btn-danger"
                      >
                        <img
                          src="/gif/delete_blue.gif"
                          alt="Delete"
                          style={{ width: "24px", height: "24px" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No entries for this date.</p>
          )}
        </div>
      </div>


    </div>
  );
};

export default Calendra;