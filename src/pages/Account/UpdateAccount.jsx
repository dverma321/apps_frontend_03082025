import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const UpdateAccount = ({ accountId, fetchAccounts, selectedAccount }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountFor: '',
    mobileNumber: '',
    email: '',
    relationship: '',
    premiumAmount: '',
    investedScheme: '',
    dob: '',   
    password: '',
    confirmPassword: '',
    category: '',
    description: '',
    consultantpayment: '',
    medicinepayment: '',
    nextVisit: '',
    companyName: '',
    senderCity: '',
    receiverCity: '',
    deliveryDate: '',
    Charges: '',
    percentage: '',
    universityName: '',
    rollNumber: '',
    AccountuserID: '',
  });

  const clearForm = () => {
    setAccountFor('');
    setMobileNumber('');
    setEmail('');
    setRelationship('');
    setPremiumAmount('');
    setInvestedScheme('');
    setDob('');    
    setPassword('');
    setConfirmPassword('');
    setCategory('');
    setPan('');
    setDescription('');
    setconsultantpayment('');
    setmedicinepayment('');
    setNextVisit('');


    // clearing delivery data

    setSenderCity('');
    setReceiverCity('');
    setDeliveryDate('');
    setCharges('');
    setCompanyName('');

    // for marksheet

    setPercentage('');
    setUniversityName('');
    setRollNumber('');

    // for other

    setAccountuserID('');

  };


  useEffect(() => {
    console.log("useEffect triggered with selectedAccount:", selectedAccount);
    if (selectedAccount) {
      setFormData({
        accountFor: selectedAccount.accountFor || '',
        mobileNumber: selectedAccount.mobileNumber || '',
        email: selectedAccount.email || '',
        relationship: selectedAccount.relationship || '',
        premiumAmount: selectedAccount.premiumAmount || '',
        investedScheme: selectedAccount.investedScheme || '',
        dob: selectedAccount.dob || '',
        password: selectedAccount.password || '',
        confirmPassword: '',
        category: selectedAccount.category || '',
        description: selectedAccount.description || '',
        consultantpayment: selectedAccount.consultantpayment || '',
        medicinepayment: selectedAccount.medicinepayment || '',
        nextVisit: selectedAccount.nextVisit || '',
        companyName: selectedAccount.companyName || '',
        senderCity: selectedAccount.senderCity || '',
        receiverCity: selectedAccount.receiverCity || '',
        deliveryDate: selectedAccount.deliveryDate || '',
        Charges: selectedAccount.Charges || '',
        percentage: selectedAccount.percentage || '',
        universityName: selectedAccount.universityName || '',
        rollNumber: selectedAccount.rollNumber || '',
        AccountuserID: selectedAccount.AccountuserID || '',
      });
    }
  }, [selectedAccount]);

  const handleChange = (e) => {
    console.log(`Changing ${e.target.name} to ${e.target.value}`); // Debug log
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const apiUrl = import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_API_URL
      : import.meta.env.VITE_PROD_API_URL;

    try {
      const response = await fetch(`${apiUrl}/account/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Account updated successfully!');
        clearForm();
        // Optionally navigate to another page
        navigate('/displayfiles'); // Redirect or handle success
      } else {
        console.error('Failed to update account');
        alert('Failed to update account.');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
          <option value="sip">SIP</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Relationship Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Relationship</label>
        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select a relationship</option>
          <option value="self">Self</option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="brother">Brother</option>
          <option value="sister">Sister</option>
          <option value="daughter">Daughter</option>
          <option value="son">Son</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Conditionally show Premium Amount and Invested Scheme */}
      {(formData.category === 'insurance' || formData.category === 'sip') && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Premium Amount</label>
            <input
              type="number"
              name="premiumAmount"
              value={formData.premiumAmount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Invested Scheme</label>
            <input
              type="text"
              name="investedScheme"
              value={formData.investedScheme}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </>
      )}

      {/* Additional fields - userID for other category and business */}
      {(formData.category === 'sip' || formData.category === 'insurance' || formData.category === 'other' || formData.category === 'Business' || formData.category === 'bank' || formData.category === 'crypto' || formData.category === 'stock' || formData.category === 'exam' || formData.category === 'payslip') && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">User ID</label>
            <input
              type="text"
              name="AccountuserID"
              value={formData.AccountuserID}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </>
      )}

      {/* Date of Birth */}
      <div className="mb-4">
        <label className="block text-gray-700">Date of Birth</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="bg-green-300 text-white font-semibold p-2 rounded hover:bg-green-500"
      >
        Update
      </button>
    </form>
  );
};

export default UpdateAccount;
