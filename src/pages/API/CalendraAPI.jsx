import axios from "axios";

const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_PROD_API_URL;

const token = localStorage.getItem("jwtoken");

// Fetch all entries

export const fetchAllEntries = async () => {
  try {
    const response = await axios.get(`${apiUrl}/calendra/api/calendar/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const entriesArray = response.data || []; // Ensure it's an array

    console.log("Raw Response Data:", response.data); // Debugging

    // Convert the response into a map `{ "YYYY-MM-DD": [...entries] }`
    const formattedEntries = entriesArray.reduce((acc, entryObj) => {
      if (entryObj.date && entryObj.entries) {
        acc[entryObj.date] = entryObj.entries; // Assign entries array to the correct date
      }
      return acc;
    }, {});

    console.log("Formatted Entries Map:", formattedEntries); // Debugging

    return formattedEntries;
  } catch (error) {
    console.error("Error fetching entries:", error);
    return {};
  }
};

export const deleteEntry = async (entryId) => {
  console.log("Deleting entry with ID:", entryId); // Debugging log

  try {
    const response = await fetch(`${apiUrl}/calendra/deleteEntry/${entryId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error deleting entry:", error);
    return false;
  }
};



