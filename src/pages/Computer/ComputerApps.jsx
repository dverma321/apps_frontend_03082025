import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ComputerApps.css';

const ComputerProducts = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const navigate = useNavigate();

    const apiUrl = import.meta.env.DEV
        ? import.meta.env.VITE_LOCAL_API_URL
        : import.meta.env.VITE_PROD_API_URL;

    const token = localStorage.getItem("jwtoken");

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        }
    }, [token]);

    useEffect(() => {
        fetch(`${apiUrl}/computer/computer-products?page=${page}&limit=12`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Adding the token to the request
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error("Error fetching products:", err));
    }, [page, apiUrl, token]);

    const handleSearch = async (e) => {
        setSearch(e.target.value);
    
        try {
            const response = await fetch(`${apiUrl}/computer/all-products?search=${e.target.value}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
    
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error searching products:", error);
        }
    };
    


    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDownload = async (appName, version, downloadLink) => {
        if (!isLoggedIn) {
            alert("Please log in to download apps.");
            return;
        }

        try {
            const response = await axios.post(
                `${apiUrl}/computer/download`,
                { appName, version, targetUrl: downloadLink, deviceType:"Windows" },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                // Only redirect if download recording was successful
                window.location.href = downloadLink;
            } else {
                alert("Failed to record download. Try again.");
            }
        } catch (error) {
            console.error("Error recording download:", error);
            alert("Failed to record download. Try again.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            {isLoggedIn ? (
                <input
                    type="text"
                    placeholder="Search apps..."
                    value={search}
                    onChange={handleSearch}
                    className="searchclass"
                />
            ) : (
                <p className="searchclasswarning">Login to filter apps.</p>
            )}

            {filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500">No apps found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                    {filteredProducts.map((app, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-lg p-4 flex flex-col h-full"
                        >
                            <img
                                src={app.image}
                                alt={app.name}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{app.name}</h2>
                                <p className="text-sm text-gray-600">{app.category}</p>
                                <p className="text-sm font-semibold">Version: {app.Version}</p>
                                <p className="text-sm text-gray-900">Password: {app.password}</p>
                                <p className="text-sm text-gray-700">Mods: {app.mods?.join(", ")}</p>
                                <p className="text-sm text-gray-500">Uploaded on: {app.date}</p>
                                <p className="text-sm text-gray-600 line-clamp-5 mt-1">
                                    {app.details || "No details available."}
                                </p>
                            </div>
                            {isLoggedIn ? (
                                <button
                                    onClick={() => handleDownload(app.name, app.version, app.downloadLink)}
                                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Download
                                </button>
                            ) : (
                                <p className="text-red-500 text-sm mt-3 text-center">
                                    Login to Download
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-6 space-x-4">
                    {isLoggedIn ? (
                        <>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className={`px-4 py-2 rounded ${page === 1
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                            >
                                Previous
                            </button>
                            <span className="text-lg font-semibold">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className={`px-4 py-2 rounded ${page === totalPages
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

export default ComputerProducts;
