import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Clauses.css';

const Clauses = () => {
    const [clauses, setClauses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const apiUrl = import.meta.env.DEV
        ? import.meta.env.VITE_LOCAL_API_URL
        : import.meta.env.VITE_PROD_API_URL;

    const token = localStorage.getItem('jwtoken');
    const lang = 'en';

    useEffect(() => {
        const fetchClauses = async () => {
            try {

                const response = await axios.get(
                    `${apiUrl}/language/sentences/all`,
                    {
                        params: {
                            clientLang: lang,
                            page: currentPage
                        },
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                );

                if (response.data && response.data.data) {
                    setClauses(response.data.data);
                    setTotalPages(Math.ceil(response.data.totalPages));
                }
            } catch (error) {
                console.error('Error fetching clauses:', error);
            }
        };

        fetchClauses();

    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Define an array of colors for each item
    const colors = [
        '#FFCCFF', '#D1F2EB', '#FFEBCC', '#F2D7D5', '#D5F5E3',
        '#FAD02E', '#F28D35', '#D62C1A', '#6A4C93', '#FF6F61'
    ];


    return (
        <div className="main-container">
            <h2 className="mb-4 text-center font-bold uppercase">Topics :-</h2>
            <ul className="list-group mb-4">
                {clauses.map((clause, index) => {
                    const bgColor = colors[index % colors.length];  // Get a unique background color for each item

                    return (
                        <li
                            key={index}
                            className="list-group-item"
                            style={{ backgroundColor: bgColor }}
                        >
                            {clause.Heading}
                        </li>
                    );
                })}
            </ul>


            <div className="pagination-container">
                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <span className="pagination-text">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    className="pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Clauses;
