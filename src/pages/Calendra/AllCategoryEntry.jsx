import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AllCategoryEntry.css";

const apiUrl = import.meta.env.DEV
  ? import.meta.env.VITE_LOCAL_API_URL
  : import.meta.env.VITE_PROD_API_URL;

const token = localStorage.getItem("jwtoken");

const categories = {
  Milk: { inputs: ["liters", "price"] },
  Groceries: {
    subcategories: ["Biscuits and Snakes", "Dry Fruits", "Rice", "Oil", "Sugar", "Flour", "Spices", "Vegetables", "Fruits"],
    inputs: ["price"],
  },
  "Gas Cylinder": {},
  Service: {
    subcategories: ["Scooty Duet", "Scooty Jupitar", "Shine Bike", "Car Service", "RO Maintenance", "Inverter Repair", "Electrician", "Plumber"],
    inputs: ["price"],
  },
  "Home Essentials": {
    subcategories: ["Toothpaste", "Mobile Recharge", "Fiber Recharge", "ACID", "Clothes", "Soap", "Shampoo", "Detergent", "Cleaning Supplies", "Tissue Paper", "Sanitary Pads"],
    inputs: ["price"],
  },
  // added on 14022025

  "Breakfast": {
    subcategories: ["Pani-Puri", "Poha", "Kachori-Samosa", "Khaman", "other"],
    inputs: ["price"],
  },

  "Beauty Products": {
    subcategories: ["Sun Screen", "Body Lotion", "Perfume", "other"],
    inputs: ["price"],
  },
  
  Other: { inputs: ["details", "price"] },
};

const AllCategoryEntry = () => {
  const [entryType, setEntryType] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [liters, setLiters] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);

  const handleAddEntry = async () => {
    if (!entryType) return;
    
    let entry = { type: entryType };

    if (categories[entryType]?.subcategories) {
      entry.details = subcategory;
    } else if (entryType === "Milk") {
      entry.details = `${liters} Liters`;
    } else {
      entry.details = details;
    }

    if (price) entry.price = price;

    const formattedDate = selectedDate.toISOString().split("T")[0];

    try {
      const response = await axios.post(
        `${apiUrl}/calendra/calendar_new`,
        { date: formattedDate, entry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("New Entry Added:", response.data);
      alert("Entry added successfully!");

      // Reset form fields
      setEntryType("");
      setSubcategory("");
      setDetails("");
      setPrice("");
      setLiters("");
      setShowForm(false);
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry.");
    }
  };

  return (
    <div className="newcontainer">
      <button className="btn btn-primary buttonclick" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Form" : "Add New Entry"}
      </button>

      {showForm && (
        <div className="card p-3 shadow-sm">
          <h3 className="text-center">Add New Entry</h3>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="form-control mb-2"
          />

          <select className="form-control mb-2" value={entryType} onChange={(e) => setEntryType(e.target.value)}>
            <option value="">Select Entry Type</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {categories[entryType]?.subcategories && (
            <select className="form-control mb-2" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
              <option value="">Select Subcategory</option>
              {categories[entryType].subcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}

          {categories[entryType]?.inputs?.includes("liters") && (
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Enter Liters"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
            />
          )}

          {categories[entryType]?.inputs?.includes("details") && (
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Enter Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          )}

          {categories[entryType]?.inputs?.includes("price") && (
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Enter Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          )}

          <div className="d-flex justify-content-between">
            <button className="btn success " onClick={handleAddEntry}>Add Entry</button>
            <button className="btn danger" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategoryEntry;
