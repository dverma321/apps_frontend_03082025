import React, { useState, useEffect } from 'react';
import './Add_Account.css';

const AddAccount = ({ fetchAccounts, selectedAccount }) => {
  const [accountFor, setAccountFor] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [premiumAmount, setPremiumAmount] = useState('');
  const [investedScheme, setInvestedScheme] = useState('');
  const [dob, setDob] = useState('');
  const [date, setDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [category, setCategory] = useState('');
  const [pan, setPan] = useState('');
  const [description, setDescription] = useState('');
  const [consultantpayment, setconsultantpayment] = useState('');
  const [medicinepayment, setmedicinepayment] = useState('');
  const [nextVisit, setNextVisit] = useState('');

  // for courier

  const [companyName, setCompanyName] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [receiverCity, setReceiverCity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [Charges, setCharges] = useState('');

  // For marksheet category
  const [percentage, setPercentage] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // For Other category

  const [AccountuserID, setAccountuserID] = useState('');

  // For additional information for sip, insurance, loan 

  const [folioNumber, setFolioNumber] = useState('');
  const [app, setApp] = useState(''); 


  useEffect(() => {

    function formatDate(date) {
      if (!date || date === "" || isNaN(new Date(date).getTime())) {
        // If the date is blank or invalid, return an empty string
        return "";
      }
      if (!(date instanceof Date)) {
        date = new Date(date); // Ensure it's a Date object
      }
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero for single-digit months
      let day = date.getDate().toString().padStart(2, '0'); // Add leading zero for single-digit days
      return `${day}/${month}/${year}`;
    }


    if (selectedAccount) {
      setAccountFor(selectedAccount.accountFor || '');
      setMobileNumber(selectedAccount.mobileNumber || '');
      setEmail(selectedAccount.email || '');
      setRelationship(selectedAccount.relationship || '');
      setPremiumAmount(selectedAccount.premiumAmount || '');
      setInvestedScheme(selectedAccount.investedScheme || '');
      setDob(formatDate(selectedAccount.dob) || '');      
      setPassword(selectedAccount.password || '');
      setConfirmPassword(selectedAccount.confirmPassword || '');
      setCategory(selectedAccount.category || '');
      setPan(selectedAccount.pan || '');
      setDescription(selectedAccount.description || '');
      setconsultantpayment(selectedAccount.consultantpayment || '');
      setmedicinepayment(selectedAccount.medicinepayment || '');
      setNextVisit(selectedAccount.nextVisit || '');

      // Additional fields for courier
      setCompanyName(selectedAccount.companyName || '');
      setSenderCity(selectedAccount.senderCity || '');
      setReceiverCity(selectedAccount.receiverCity || '');
      setDeliveryDate(selectedAccount.deliveryDate || '');
      setCharges(selectedAccount.Charges || '');

      // Additional fields for marksheet category
      setPercentage(selectedAccount.percentage || '');
      setUniversityName(selectedAccount.universityName || '');
      setRollNumber(selectedAccount.rollNumber || '');

      setAccountuserID(selectedAccount.AccountuserID || '');

    } else {
      clearForm();
    }
  }, [selectedAccount]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const apiUrl = import.meta.env.DEV
      ? import.meta.env.VITE_LOCAL_API_URL
      : import.meta.env.VITE_PROD_API_URL;
    const token = localStorage.getItem('jwtoken');

    const accountData = {
      accountFor,
      mobileNumber,
      email,
      relationship,
      premiumAmount,
      investedScheme,
      dob,
      password,
      confirmPassword,
      category,
      pan,
      description,
      medicinepayment,
      consultantpayment,
      nextVisit,

      // for courier
      senderCity,
      receiverCity,
      deliveryDate,
      Charges,
      companyName,

      // for marksheet
      percentage,
      universityName,
      rollNumber,

      // for other

      AccountuserID,

    };

    try {
      let response;
      if (selectedAccount) {
        response = await fetch(`${apiUrl}/account/accounts/${selectedAccount._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountData),
        });
      } else {
        response = await fetch(`${apiUrl}/account/add_account`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountData),
        });
      }

      if (response.ok) {
        fetchAccounts();
        alert(`${selectedAccount ? 'Updated' : 'Added'} successfully!`);
        clearForm();
      } else {
        const errorResponse = await response.json(); // Parse the error response from the backend
        if (errorResponse.error) {
          alert(errorResponse.error); // Display the specific error message from the backend
        } else {
          alert('Failed to submit account. Please try again.');
        }
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-lg rounded-lg add_account_form"
    >
      {/* Category Dropdown */}
      <div className="mb-2">
        <label className="block text-gray-700 font-semibold">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
          required
        >
          <option value="">Select a category</option>
          <option value="medical">Medical</option>
          <option value="insurance">Insurance</option>
          <option value="courier">Courier</option>
          <option value="Business">Business</option>
          <option value="purchase_bill">Purchased Bill</option>
          <option value="bank">Bank</option>
          <option value="payslip">Payslip</option>
          <option value="bills">Home Bills</option>
          <option value="marksheet">Marksheet</option>
          <option value="crypto">Crypto Currency</option>
          <option value="stock">Share Market</option>
          <option value="exam">Exam</option>
          <option value="sip">SIP</option>
          <option value="loan">Loan</option>
          <option value="gmail">Gmail</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Relationship Dropdown */}
      <div className="mb-2">
        <label className="block text-gray-700 font-semibold">Relationship</label>
        <select
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
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


      {/* Added Additional Fields -  show Premium Amount and Invested Scheme */}
      {(category === "insurance" || category === "sip" || category === "loan") && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Premium Amount</label>
            <input
              type="number"
              value={premiumAmount}
              onChange={(e) => setPremiumAmount(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Invested Scheme</label>
            <input
              type="text"
              value={investedScheme}
              onChange={(e) => setInvestedScheme(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          {/* Dropdown for PAN Number */}
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">PAN Number</label>
            <select
              value={pan}
              onChange={(e) => setPan(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            >
              <option value="">Select PAN Number</option>
              <option value="AVFPV0431L">DIVYANSHU VERMA</option>
              <option value="monalisha">MONALISHA VERMA</option>
              <option value="AEIPV2300L">URMILA VERMA</option>
              <option value="ACHPV8681K">KAMAL VERMA</option>
              <option value="pragya">PRAGYA</option>
              <option value="BWDPV0505P">HIMANSHU VERMA</option>
            </select>
          </div>
        </>
      )}

      {/* Hide - Account For if category is "gmail" and courier */}
      {(category !== "gmail" && category !== "courier" && category !== 'marksheet') && (
        <div className="mb-2">
          <label className="block text-gray-700 font-semibold">Account For</label>
          <input
            value={accountFor}
            onChange={(e) => setAccountFor(e.target.value)}
            className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
          />
        </div>
      )}

      {/* Additional fields - userID for other category and business */}
      {(category === 'sip' || category === 'insurance' || category === 'loan' || category === 'other' || category === 'Business' || category === 'bank' || category === 'crypto' || category === 'stock' || category === 'exam' || category === 'payslip') && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">User ID</label>
            <input
              type="text"
              value={AccountuserID}
              onChange={(e) => setAccountuserID(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

        </>
      )}

      {/* Hide - Email if category is "courier" and marksheet */}
      {(category !== "courier" && category !== "marksheet") && (
        <div className="mb-2">
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
          />
        </div>
      )}

      {/* Additional Fields - Courier Category Fields */}

      {category === "courier" && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Sender City</label>

            <input
              type="text"
              value={senderCity}
              onChange={(e) => setSenderCity(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Receiver City</label>
            <input
              type="text"
              value={receiverCity}
              onChange={(e) => setReceiverCity(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Courier Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Charges</label>
            <input
              type="number"
              value={Charges}
              onChange={(e) => setCharges(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Estimate Date of Delivery</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
        </>
      )}

      {/* Hide - Mobile Number for category marksheet only */}
      {(category !== "marksheet") && (
        <div className="mb-2">
          <label className="block text-gray-700 font-semibold">Mobile Number</label>
          <input
            type="text"
            maxLength={10}
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
          />
        </div>
      )}

      {/* Additional fields - marksheet category */}
      {category === 'marksheet' && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Roll Number</label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Percentage</label>
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">University Name</label>
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="w-full px-4 py-2 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
        </>
      )}

      {/* Password Date - conditionally rendered for "sip" and "insurance" */}
      {(category === "insurance" || category === "sip") && (
        <div className="mb-2">
          <label className="block text-gray-700 font-semibold">DOB / Password Date</label>
          <input
            type="date"
            value={(dob)}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
          />
        </div>
      )}

      {/* Password - hide if category is "medical" or courier or marksheet */}
      {(category !== "medical" && category !== "courier" && category !== "marksheet") && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"              
              value={password}             
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
              required
            />
          </div>
        </>
      )}

      {/* Add additional fields for Medical Category Fields */}
      {category === "medical" && (
        <>
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Consultant Payment</label>
            <input
              type="text"
              value={consultantpayment}
              onChange={(e) => setconsultantpayment(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Medicine Payment</label>
            <input
              type="text"
              value={medicinepayment}
              onChange={(e) => setmedicinepayment(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold">Next Visit</label>
            <input
              type="date"
              value={nextVisit}
              onChange={(e) => setNextVisit(e.target.value)}
              className="w-full px-4 py-1 border border-green-400 rounded-lg focus:ring focus:ring-green-200"
            />
          </div>
        </>
      )}


      {/* Submit Button */}
      <button
        type="submit"
        className="rounded-lg add_account_button"
      >
        {selectedAccount ? 'Update' : 'Add'} Account
      </button>
    </form>
  );
};

export default AddAccount;
