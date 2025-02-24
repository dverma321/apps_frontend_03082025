import React from "react";
import { useNavigate } from "react-router-dom";
import './FileUploadAndCalendar.css';

const FileUploadAndCalendar = () => {
  const navigate = useNavigate();

  return (
    <div className="file-upload-container">
      <div className="file-upload-calendar">
        <div className="row">
          {/* Upload Files Section */}
          <div className="col-md-6 col-12 text-center">
            <button className="custom-btn-file" onClick={() => navigate("/upload-files")}>
              Upload Files
            </button>
          </div>

          {/* Add New Entry Calendar Section */}
          <div className="col-md-6 col-12 text-center">
            <button className="custom-btn-calendar" onClick={() => navigate("/calendar-entry")}>
              Add New Entry Calendar
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default FileUploadAndCalendar;
