import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiSmartphone, FiMonitor, FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllUserDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem("jwtoken");

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${apiUrl}/android/downloads`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setDownloads(response.data || []);
      } catch (err) {
        console.error("Error fetching downloads:", err);
        setError(err.response?.data?.message || "Failed to load downloads");
        toast.error("Failed to load download history");
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, [apiUrl, token]);

  const renderUserInfo = (userId) => {
    if (!userId) {
      return (
        <div className="flex items-center text-gray-500">
          <FiUser className="mr-1" />
          <span>Unknown User</span>
        </div>
      );
    }
    return (
      <div>
        <div className="font-medium">{userId.name || "No name"}</div>
        <div className="text-sm text-gray-600">{userId.email || "No email"}</div>
      </div>
    );
  };

  const renderDeviceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "android":
        return (
          <span className="flex items-center text-green-600">
            <FiSmartphone className="mr-1" /> Android
          </span>
        );
      case "windows":
      case "computer":
        return (
          <span className="flex items-center text-blue-600">
            <FiMonitor className="mr-1" /> Computer
          </span>
        );
      default:
        return (
          <span className="text-gray-500">Unknown</span>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg pt-10 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FiDownload className="mr-2" /> Download History
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : downloads.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No downloads found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Download Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {downloads.map((download, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderUserInfo(download.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{download.appName}</div>
                      {download.targetUrl && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          <a href={download.targetUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {download.targetUrl}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {download.version || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(download.downloadDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderDeviceIcon(download.deviceType)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUserDownloads;
