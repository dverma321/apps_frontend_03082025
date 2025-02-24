import React from 'react';

const DeleteAccount = ({ accountId, fetchAccounts }) => {
  const handleDelete = async () => {
    const apiUrl = import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_API_URL
      : import.meta.env.VITE_PROD_API_URL;
    
    const token = localStorage.getItem('jwtoken');


    try {
      const response = await fetch(`${apiUrl}/account/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
        fetchAccounts();  // Refresh account list after deletion
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Failed to delete account', error);
    }
  };

  return (
    <button
      className="bg-red-500 text-white font-semibold p-2 rounded hover:bg-red-600"
      onClick={handleDelete}
    >
      Delete
    </button>
  );
};

export default DeleteAccount;
