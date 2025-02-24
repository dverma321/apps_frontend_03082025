import React, { useState, useEffect } from 'react';
import AddAccount from './Add_Account';
import UpdateAccount from './UpdateAccount';
import DeleteAccount from './DeleteAccount';
import Loading from '../Loading';
import useFetchUser from '../API/FetchUserInfo.jsx';
import bcrypt from 'bcryptjs';

import './AccountManager.css';

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const { state, loading: userLoading } = useFetchUser();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const apiUrl = import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_API_URL
      : import.meta.env.VITE_PROD_API_URL;
    const token = localStorage.getItem('jwtoken');

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/account/accounts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
        const visibility = {};
        data.forEach((account) => {
          visibility[account._id] = false;
        });
        setPasswordVisibility(visibility);
      } else {
        console.error('Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePasswordVerification = async () => {
    const userPassword = state?.userInfo?.profilePassword;

    if (userPassword && enteredPassword) {
      const isMatch = await bcrypt.compare(enteredPassword, userPassword);

      if (isMatch) {
        setShowPasswords(true);
        window.alert('Profile Password Entered...');
      } else {
        alert('Incorrect profile password!');
      }
    } else {
      alert('Please enter a valid profile password.');
    }

    setEnteredPassword('');
  };

  const togglePasswordVisibility = (accountId) => {
    if (showPasswords) {
      setPasswordVisibility((prevVisibility) => ({
        ...prevVisibility,
        [accountId]: !prevVisibility[accountId],
      }));
    } else {
      alert('Please verify the profile password to view account passwords.');
    }
  };

  const handleSelectAccountForUpdate = (account) => {
    setSelectedAccount(account);
  };

  const filteredAccounts = accounts.filter((account) =>
    (account.accountFor && account.accountFor.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (account.relationship && account.relationship.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (account.category && account.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  const groupedAccounts = filteredAccounts.reduce((acc, account) => {
    acc[account.category] = acc[account.category] || [];
    acc[account.category].push(account);
    return acc;
  }, {});

  const formatDate = (dateString) => {
    if (!dateString) {
      return ''; // Return an empty string if the date is not available
    }

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatDate_form = (dateString) => {
    if (!dateString) {
      return ''; // Return an empty string if the date is not available
    }

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  if (loading || userLoading) {
    return <Loading />;
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen backgroundImage">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        <AddAccount fetchAccounts={fetchAccounts} selectedAccount={selectedAccount} />

        <div className="md:w-2/3 bg-white bg-opacity-50 shadow-md rounded-lg p-6 max-h-screen overflow-y-auto">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Accounts List</h3>

          <div className='account_manager_top_container'>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search accounts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-yellow-100"
              />
            </div>

            <div className="mb-4">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                placeholder="Enter profile password"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-yellow-100 mr-2"
              />
              <button
                onClick={handleProfilePasswordVerification}
                className="bg-blue-500 hover:bg-blue-700 mt-4 text-white px-4 py-2 rounded-md"
              >
                Profile Password
              </button>
            </div>
          </div>

          <div className="table-container" style={{ overflowY: 'auto', maxHeight: '400px' }}>
            {Object.entries(groupedAccounts).map(([category, accounts]) => (
              <div key={category} className="mb-8">
                <h4 className="font-semibold text-lg text-center text-white mb-4 bg-blue-800 p-2 uppercase">{category}</h4>
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-green-200">
                      {(category !== 'gmail' && category != 'marksheet' && category != 'courier') && <th className="border px-4 py-2">Account Name</th>}
                      <th className="border px-4 py-2">Relationship</th>
                      {(category !== 'gmail' && category !== 'other' && category !== 'bank' && category !== 'crypto' && category !== 'stock' && category !== 'marksheet' && category !== 'medical' && category != 'courier') && <th className="border px-4 py-2">DOB</th>}
                      {(category !== 'marksheet') && <th className="border px-4 py-2">Mobile Number</th>}
                      {(category !== 'marksheet' && category != 'courier') && <th className="border px-4 py-2">Email</th>}
                      {(category !== 'medical' && category !== 'marksheet') && <th className="border px-4 py-2">Password</th>}

                      {category === 'courier' && (
                        <>
                          <th className="border px-4 py-2">Sender City</th>
                          <th className="border px-4 py-2">Receiver City</th>
                          <th className="border px-4 py-2">Charges</th>
                          <th className="border px-4 py-2">Delivery Date</th>
                        </>
                      )}

                      {category === 'medical' && (
                        <>
                          <th className="border px-4 py-2">Consultation Fee</th>
                          <th className="border px-4 py-2">Medicine Fee</th>
                          <th className="border px-4 py-2">Next Visit</th>
                          <th className="border px-4 py-2">Description</th>
                        </>
                      )}

                      {category === 'marksheet' && (
                        <>
                          <th className="border px-4 py-2">Roll Number</th>
                          <th className="border px-4 py-2">Percentage</th>
                          <th className="border px-4 py-2">University</th>
                        </>
                      )}

                      {(category === 'other' || category === 'bank' || category === 'insurance' || category === 'sip' || category === 'business' || category === 'loan') && <th className="border px-4 py-2">User ID</th>}

                      {(category === 'insurance' ||
                        category === 'loan' ||
                        category === 'bank' ||
                        category === 'sip' ||
                        category === 'Business') && (
                          <>
                            <th className="border px-4 py-2">PAN</th>
                            <th className="border px-4 py-2">Invested Scheme</th>
                            <th className="border px-4 py-2">Premium Amount</th>
                            <th className="border px-4 py-2">Last Updated</th>
                          </>
                        )}

                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((account) => (
                      <tr key={account._id} className="bg-gray-50">
                        {(category !== 'gmail' && category !== 'marksheet' && category != 'courier') && <td className="border px-4 py-2">{account.accountFor}</td>}
                        <td className="border px-4 py-2">{account.relationship}</td>
                        {(category !== 'gmail' && category !== 'other' && category !== 'bank' && category !== 'crypto' && category !== 'stock' && category !== 'marksheet' && category != 'medical' && category != 'courier') && <td className="border px-4 py-2">{formatDate_form(account.dob)}</td>}
                        {(category !== 'marksheet') && <td className="border px-4 py-2">{account.mobileNumber}</td>}
                        {(category !== 'marksheet' && category != 'courier') && <td className="border px-4 py-2">{account.email}</td>}
                        {(category !== 'medical' && category !== 'marksheet') && <td className="border px-4 py-2">
                          <button
                            type="button"
                            className="underline text-blue-500"
                            onClick={() => togglePasswordVisibility(account._id)}
                          >
                            {passwordVisibility[account._id] ? account.password : '••••••••'}
                          </button>
                        </td>
                        }

                        {/* For Courier category only */}
                        {category === 'courier' && (
                          <>
                            <td className="border px-4 py-2">{account.senderCity}</td>
                            <td className="border px-4 py-2">{account.receiverCity}</td>
                            <td className="border px-4 py-2">{account.Charges}</td>
                            <td className="border px-4 py-2">{formatDate_form(account.deliveryDate)}</td>
                          </>
                        )}

                        {/* For Medical category only */}
                        {category === 'medical' && (
                          <>
                            <td className="border px-4 py-2">{account.consultantpayment}</td>
                            <td className="border px-4 py-2">{account.medicinepayment}</td>
                            <td className="border px-4 py-2">{formatDate_form(account.nextVisit)}</td>
                            <td className="border px-4 py-2">{account.description}</td>
                          </>
                        )}

                        {/* For Marksheet category only */}
                        {category === 'marksheet' && (
                          <>
                            <td className="border px-4 py-2">{account.rollNumber}</td>
                            <td className="border px-4 py-2">{account.percentage}</td>
                            <td className="border px-4 py-2">{account.universityName}</td>
                          </>
                        )}

                        {/* For Other category */}
                        {(category === 'other' || category === 'bank' || category === 'insurance' || category === 'sip' || category === 'business' || category === 'loan') && <td className="border px-4 py-2">{account.AccountuserID}</td>}

                        {(category === 'insurance' ||
                          category === 'loan' ||
                          category === 'bank' ||
                          category === 'sip' ||
                          category === 'Business') && (
                            <>
                              <td className="border px-4 py-2">{account.pan}</td>
                              <td className="border px-4 py-2">{account.investedScheme}</td>
                              <td className="border px-4 py-2">{account.premiumAmount}</td>
                              <td className="border px-4 py-2">{formatDate(account.date)}</td>
                            </>
                          )}

                        <td className="border px-4 py-2 space-x-2 flex">
                          <button
                            onClick={() => handleSelectAccountForUpdate(account)}
                            className="bg-green-300 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                          >
                            Update
                          </button>
                          <DeleteAccount accountId={account._id} fetchAccounts={fetchAccounts} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountManager;
