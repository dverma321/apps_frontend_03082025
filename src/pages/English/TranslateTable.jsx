import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TranslateTable.css';

const TranslateTable = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [suggestModal, setSuggestModal] = useState({ show: false, original: '' });
  const [suggestion, setSuggestion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const apiUrl = import.meta.env.DEV
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_PROD_API_URL;

  const token = localStorage.getItem('jwtoken');


  useEffect(() => {
    const fetchData = async () => {
      const lang = navigator.language.slice(0, 2) || 'en';
      setLanguage(lang);

      try {

        const resUser = await axios.get(`${apiUrl}/user/getData`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setIsAdmin(resUser.data.isAdmin);

        const response = await axios.post(`${apiUrl}/language/sentences`, {
          clientLang: lang,
          page: currentPage
        }, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data && response.data.data) {
          setGroupedData(response.data.data);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        console.error('Fetch failed', err);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleEdit = async (newValue, original) => {
    const token = localStorage.getItem('jwtoken');
    try {
      await axios.post(`${apiUrl}/language/update-translation`, {
        original,
        lang: 'hi',
        newValue,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert('Translation updated successfully');
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update translation');
    }
  };

  const openSuggestionModal = (original) => {
    setSuggestModal({ show: true, original });
  };

  const submitSuggestion = async () => {
    if (!suggestion) return;

    const token = localStorage.getItem('jwtoken');
    const user = await axios.get(`${apiUrl}/user/getData`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    try {
      await axios.post(`${apiUrl}/language/suggest-translation`, {
        original: suggestModal.original,
        lang: language,
        suggestion,
        user: user.data.email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setSuggestModal({ show: false, original: '' });
      setSuggestion('');
      alert('Suggestion submitted for review');
    } catch (err) {
      console.error('Suggestion failed', err);
      alert('Failed to submit suggestion');
    }
  };



  return (
    <div className="group-container">
      {groupedData.map((group, groupIndex) => (
        <div key={groupIndex} className="group-row d-flex flex-wrap">
          {/* Left: Table */}
          <div className="left-table desktop-table">
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Original</th>
                    <th>Hindi</th>
                    <th>{language.toUpperCase()} Translation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.translations.map((item, sentenceIndex) => (
                    <tr key={sentenceIndex}>
                      <td>{item.original}</td>
                      <td className="kunti-dev">
                        {isAdmin && editIndex === sentenceIndex ? (
                          <input
                            type="text"
                            className="form-control kunti-dev"
                            value={item.hindi || ''}
                            onChange={(e) => {
                              const updatedData = [...groupedData];
                              updatedData[groupIndex].translations[sentenceIndex].hindi = e.target.value;
                              setGroupedData(updatedData);
                            }}
                            onBlur={(e) => {
                              handleEdit(e.target.value, item.original);
                              setEditIndex(null);
                            }}
                          />
                        ) : (
                          <span>{item.hindi || ''}</span>
                        )}
                      </td>
                      <td>{item.clientLang || ''}</td>
                      <td>
                        {!isAdmin ? (
                          <button className="suggestButton" onClick={() => openSuggestionModal(item.original)}>
                            Suggest Edit
                          </button>
                        ) : (
                          <button
                            className="EditButton"
                            onClick={() => setEditIndex(editIndex === sentenceIndex ? null : sentenceIndex)}
                          >
                            {editIndex === sentenceIndex ? 'Editing...' : 'Edit'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Heading + Image */}
          <div className="right-info">
            <h3>
              <p className="text-black uppercase text-sm">Learning:-</p>
              <p className="text-red-400 uppercase text-sm">{group.heading}</p>
            </h3>
            <img
              src={group.ImageUrl}
              alt={`icon-${groupIndex}`}
              style={{ width: "100%", maxHeight: "400px", objectFit: 'cover', marginTop: "15px" }}
            />
          </div>

          {/* Pagination  */}

          <div className="pagination-container text-center mt-4 mb-4">
            <button
              className="btn btn-outline-primary mx-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>

            <span className="mx-2">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              className="btn btn-outline-primary mx-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>




        </div>
      ))}
    </div>

  );
};

export default TranslateTable;
