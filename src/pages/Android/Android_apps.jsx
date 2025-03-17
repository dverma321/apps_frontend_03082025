import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick"; // Fixed typo in import
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Android_apps.css';

const AndroidApps = () => {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allApps, setAllApps] = useState([]);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");

  useEffect(() => {
    setIsLoggedIn(!!token);

    const fetchApps = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/android/android-apps?page=${currentPage}&limit=12`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setApps(response.data.apps || []);
        setFilteredApps(response.data.apps || []);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching paginated apps:", error);
        setApps([]);
        setFilteredApps([]);
      }
    };

    fetchApps();
  }, [currentPage, token]);

  useEffect(() => {
    const fetchAllApps = async () => {
      try {
        const response = await axios.get(`${apiUrl}/android/all-apps`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setAllApps(response.data.apps || []);
        setFilteredApps(response.data.apps || []);
      } catch (error) {
        console.error("Error fetching all apps:", error);
      }
    };

    fetchAllApps();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredApps(apps);
    } else {
      const filtered = allApps.filter((app) =>
        app?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredApps(filtered);
    }
  }, [searchTerm, apps, allApps]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownload = async (appName, version, downloadLink) => {
    if (!isLoggedIn) {
      alert("Please log in to download apps.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/android/download`,
        { appName, version, targetUrl: downloadLink, deviceType: "Android" },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        window.location.href = downloadLink;
      } else {
        alert("Failed to record download. Try again.");
      }
    } catch (error) {
      console.error("Error recording download:", error);
      alert("Failed to record download. Try again.");
    }
  };

  const handleReport = (appName, appVersion, downloadLink) => {
    alert(`The download link for ${appName} (Version: ${appVersion}) is reported as expired.`);

    fetch(`${apiUrl}/android/report-issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appName, appVersion, downloadLink, issue: "Expired download link" }),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => console.log("Report submitted:", data))
      .catch((error) => console.error("Error reporting issue:", error));
  };

  // Carousel settings
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite looping
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 1, // Number of slides to show at a time
    slidesToScroll: 1, // Number of slides to scroll at a time
    autoplay: true, // Enable auto-sliding
    autoplaySpeed: 3000, // Auto-slide interval in milliseconds (3 seconds)
  };

  return (
    <div className="container mx-auto p-4">
      {isLoggedIn ? (
        <input
          type="text"
          placeholder="Search apps..."
          value={searchTerm}
          onChange={handleSearch}
          className="searchclass"
        />
      ) : (
        <p className="searchclasswarning">
          Login to filter apps.
        </p>
      )}

      {filteredApps.length === 0 ? (
        <p className="text-center text-gray-500">No apps found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {filteredApps.map((app, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full"
            >
              <img
                src={app.image}
                alt={app.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
               <div className="mt-3 mb-5">
                <h3 className="text-xl pt-1 mb-1 font-bold text-gray-800 border-b-4 border-blue-500 pb-3 inline-block">
                  Screenshots:
                </h3>
                <Slider {...settings}>
                  {app.image2 ? (
                    <div>
                      <img src={app.image2} alt={`${app.name} screenshot 2`} className="w-full h-40 object-cover rounded-md" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">No screenshot available</div>
                  )}
                  {app.image3 ? (
                    <div>
                      <img src={app.image3} alt={`${app.name} screenshot 3`} className="w-full h-40 object-cover rounded-md" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">No screenshot available</div>
                  )}
                  {app.image4 ? (
                    <div>
                      <img src={app.image4} alt={`${app.name} screenshot 4`} className="w-full h-40 object-cover rounded-md" />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">No screenshot available</div>
                  )}
                </Slider>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{app.name}</h2>
                <p className="text-sm text-gray-600">{app.category}</p>
                <p className="text-sm font-semibold">Version: {app.version}</p>
                <p className="text-sm text-gray-500">Android: {app.androidVersion}</p>
                <p className="text-sm text-gray-700">Mods: {app.mods?.join(", ")}</p>
                <p className="text-sm text-gray-500">Uploaded on: {app.uploadedon}</p>
                <p className="text-sm text-gray-600 line-clamp-5 mt-1">
                  {app.details || "No details available."}
                </p>
              </div>             

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleDownload(app.name, app.version, app.downloadLink)}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Download
                  </button>

                  <button
                    onClick={() => {
                      const confirmReport = window.confirm(
                        `Are you sure you want to report ${app.name} (Version: ${app.version}) as an expired download link?`
                      );
                      if (confirmReport) {
                        handleReport(app.name, app.version, app.downloadLink);
                      }
                    }}
                    className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Report
                  </button>
                </>
              ) : (
                <p className="text-red-500 text-sm mt-3 text-center">
                  Login to Download
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredApps.length > 0 && (
        <div className="flex justify-center mt-6 space-x-4">
          {isLoggedIn ? (
            <>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded ${currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                Previous
              </button>
              <span className="text-lg font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded ${currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                Next
              </button>
            </>
          ) : (
            <p className="text-red-500 text-sm font-semibold">
              Login to Load many more apps
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AndroidApps;