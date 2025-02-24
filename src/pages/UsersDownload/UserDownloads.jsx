import React, { useState, useEffect } from "react";
import axios from "axios";

const AllUserDownloads = () => {
  const [androidDownloads, setAndroidDownloads] = useState([]);
  const [computerDownloads, setComputerDownloads] = useState([]);
  const [loadingAndroid, setLoadingAndroid] = useState(true);
  const [loadingComputer, setLoadingComputer] = useState(true);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");

  useEffect(() => {
    const fetchAndroidDownloads = async () => {
      try {
        const response = await axios.get(`${apiUrl}/android/downloads`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setAndroidDownloads(response.data);
      } catch (error) {
        console.error("Error fetching Android downloads:", error);
      } finally {
        setLoadingAndroid(false);
      }
    };

    const fetchComputerDownloads = async () => {
      try {
        const response = await axios.get(`${apiUrl}/computer/downloads`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setComputerDownloads(response.data);
      } catch (error) {
        console.error("Error fetching Computer downloads:", error);
      } finally {
        setLoadingComputer(false);
      }
    };

    fetchAndroidDownloads();
    fetchComputerDownloads();
  }, []);

  return (
    <div className="container mx-auto m-4 p-4">
      <h1 className="text-2xl font-bold text-center mt-16 mb-10">Download History</h1>

      {/* Android Downloads Table */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Android Downloads</h2>
      {loadingAndroid ? (
        <p className="text-center text-gray-500">Loading Android downloads...</p>
      ) : androidDownloads.length === 0 ? (
        <p className="text-center text-gray-500">No Android downloads found.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">App</th>
                <th className="border border-gray-300 px-4 py-2">Version</th>
                <th className="border border-gray-300 px-4 py-2">Url</th>
                <th className="border border-gray-300 px-4 py-2">Download Date</th>
              </tr>
            </thead>
            <tbody>
              {androidDownloads.map((download, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{download.userId.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.userId.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.appName}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.version || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.targetUrl || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(download.downloadDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Computer Downloads Table */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Computer Downloads</h2>
      {loadingComputer ? (
        <p className="text-center text-gray-500">Loading Computer downloads...</p>
      ) : computerDownloads.length === 0 ? (
        <p className="text-center text-gray-500">No Computer downloads found.</p>
      ) : (
        <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg">
          <table className="table-auto w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">App</th>
                <th className="border border-gray-300 px-4 py-2">Version</th>
                <th className="border border-gray-300 px-4 py-2">Url</th>
                <th className="border border-gray-300 px-4 py-2">Download Date</th>
              </tr>
            </thead>
            <tbody>
              {computerDownloads.map((download, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{download.userId?.name || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.userId?.email || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.name || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.version || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">{download.targetUrl || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(download.downloadDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default AllUserDownloads;
