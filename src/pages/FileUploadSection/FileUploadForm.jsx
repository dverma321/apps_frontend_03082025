import React, { useState, useRef } from 'react';
import './FileUploadForm.css';

const FileUploadForm = () => {
  const [documentFile, setDocumentFile] = useState(null);
  const [documentDescription, setDocumentDescription] = useState('');
  const [documentCategory, setDocumentCategory] = useState('');
  const [nextVisit, setNextVisit] = useState(''); // State for Next Visit
  const [isFileUploading, setIsFileUploading] = useState(false);
  const fileInputRef = useRef(null); // Ref for file input reset

  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const onFileUpload = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!documentFile) {
      alert('Please select a file to upload.');
      return;
    }

    if (!documentCategory) {
      alert('Please select a category.');
      return;
    }

    if (!documentDescription) {
      alert('Please enter a description.');
      return;
    }

    if (documentCategory === 'medical' && !nextVisit) {
      alert('Please enter the next visit date.');
      return;
    }

    setIsFileUploading(true);

    try {
      const formData = new FormData();
      formData.append('uploadFile', documentFile); // File
      formData.append('fileDescription', documentDescription); // Description
      formData.append('category', documentCategory); // Category

      if (documentCategory === 'medical') {
        formData.append('nextVisit', nextVisit); // Include next visit for medical category
      }

      const VITE_LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL;
      const VITE_PROD_API_URL = import.meta.env.VITE_PROD_API_URL;
      const apiUrl = import.meta.env.DEV ? VITE_LOCAL_API_URL : VITE_PROD_API_URL;

      const token = localStorage.getItem('jwtoken');
      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const response = await fetch(`${apiUrl}/uploadfile/uploadData_with_file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include', // Send token as cookie
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      alert('File uploaded successfully!');

      // Reset form inputs
      setDocumentFile(null);
      setDocumentDescription('');
      setDocumentCategory('');
      setNextVisit(''); // Reset Next Visit
      fileInputRef.current.value = ''; // Reset file input using ref
    } catch (error) {
      alert('Error uploading file: ' + error.message);
    } finally {
      setIsFileUploading(false); // Re-enable the button after response
    }
  };

  return (
    <div className="flex items-center h-screen bg-opacity-50 uploadFormImage">
      <form
        className="bg-green-100 bg-opacity-50 shadow-md rounded px-4 pt-4 pb-6 w-3/4 sm:w-3/4 md:w-[600px] mx-auto flex flex-col formUpload"
        onSubmit={onFileUpload}
      >
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Upload File</h1>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentFile">
            Upload Document
          </label>
          <input
            type="file"
            id="documentFile"
            name="uploadFile"
            onChange={handleFileChange}
            ref={fileInputRef} // Assign ref to reset
            className="border rounded w-full py-2 px-3 text-gray-700"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          />
        </div>

        {/* Document Category */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentCategory">
            Upload Category <span className="text-red-500">*</span> {/* Required indicator */}
          </label>
          <select
            id="documentCategory"
            value={documentCategory}
            onChange={(e) => setDocumentCategory(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            required
          >
            <option value="">Select a category</option>
            <option value="medical">Medical</option>
            <option value="insurance">Insurance</option>
            <option value="purchase_bill">Purchased Bill</option>
            <option value="bank">Bank</option>
            <option value="payslip">Payslip</option>
            <option value="bills">Home Bills</option>
            <option value="marksheet">Marksheet</option>
            <option value="crypto">Crypto Currency</option>
            <option value="stock">Share Market</option>
            <option value="exam">Exam</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Document File Description */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="documentDescription">
            Document Description <span className="text-red-500">*</span> {/* Required indicator */}
          </label>
          <input
            type="text"
            id="documentDescription"
            value={documentDescription}
            onChange={(e) => setDocumentDescription(e.target.value)}
            className="border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Enter document description"
            required
          />
        </div>

        {/* Next Visit (only for Medical) */}
        {documentCategory === 'medical' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nextVisit">
              Next Visit <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="nextVisit"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
              className="border rounded w-full py-2 px-3 text-gray-700"
              required={documentCategory === 'medical'}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isFileUploading} // Disable the button when uploading
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
              isFileUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isFileUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default FileUploadForm;
