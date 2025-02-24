import React, { useEffect, useState } from "react";
import './ReportIssue.css';

const ReportedIssues = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const apiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL : import.meta.env.VITE_PROD_API_URL;
    const token = localStorage.getItem("jwtoken");



    useEffect(() => {
        const fetchReports = async () => {
            try {

                const response = await fetch(`${apiUrl}/android/reported-issues`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch reported issues");
                }

                const data = await response.json();
                setReports(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    return (
        <div className="container mt-20">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && reports.length === 0 ? (
                <p className="text-gray-500 text-center">No reported issues found.</p>
            ) : (
                <div className="overflow-x-auto">
                   
                    <table className="w-full min-w-[1200px] bg-white border border-gray-300 shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border">App Name</th>
                                <th className="py-2 px-4 border">Version</th>
                                <th className="py-2 px-4 border">Reported By</th>
                                <th className="py-2 px-4 border">Url</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className="text-center border-b hover:bg-gray-100">
                                    <td className="py-2 px-4 border">{report.appName}</td>
                                    <td className="py-2 px-4 border">{report.appVersion}</td>
                                    <td className="py-2 px-4 border">{report.reportedBy?.email || "Unknown"}</td>
                                    <td className="py-2 px-4 border truncate max-w-[150px]">
                                        <a href={report.targetUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                                            {report.targetUrl}
                                        </a>
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

export default ReportedIssues;
