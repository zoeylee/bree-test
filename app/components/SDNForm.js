import React, { useState } from 'react';
import axios from 'axios';
import './css/_SDNForm.css';
import { countries } from '../data/getCountry';
import { API_ENDPOINT } from '../config/config';

const CustomerStatus = {
  Hit: "Hit",
  Clear: "Clear"
}

const SDNForm = () => {
  const [formData, setFormData] = useState({ fullname: '', birthYear: '', country: '' });
  const [result, setResult] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let year = 1900; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse();
  };

  const handleChange = (e) => {
    changeSelectStyle(e);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const changeSelectStyle = (e) => {
    if (e.target.name === "fullname") {
      return;
    }
    if (e.target.value !== "") {
      e.target.classList.remove("select-disabled-option");
    }
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname) newErrors.fullname = true;
    if (!formData.birthYear) newErrors.birthYear = true;
    if (!formData.country) newErrors.country = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINT, formData);
      if (response.data) {
        setResult(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      }
      else {
        setErrorMessage(error.message);
      }
    }
    setIsLoading(false);
  };

  const renderResult = () => {
    if (!result) return null;
    if (!result.result) return null;
    const res = result.result
    const hitResult = res.parameters.map(hit => (
      <span key={hit.columnName} style={{ paddingRight: '10px' }}>
        {`${hit.columnName}: ${hit.isHit ? '✅' : '❌'} `}
      </span>));
    return (
      <div className="result">
        <p>Result:</p>
        <div style={{ paddingLeft: '10px' }}>
          <p>Customer Status: <span style={{ color: res.customerStatus === CustomerStatus.Hit ? '#3c763d' : '#faa0a0' }}>
            {res.customerStatus}
          </span></p>
          {res.customerStatus === CustomerStatus.Hit && (
            <p>Parameters: {hitResult}</p>
          )}
        </div>
      </div>
    );
  };

  const renderFailed = () => {
    if (!errorMessage) return null;
    return (
      <div className="errorMessage">
        <p>Error: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Full Name"
            onChange={handleChange}
            className={`form-input ${errors.fullname ? 'error' : ''}`}
          />
          <label>Date of Birth</label>
          <select
            id="birthYear"
            name="birthYear"
            onChange={handleChange}
            className={`select-disabled-option form-select ${errors.birthYear ? 'error' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>Select Birth Year</option>
            {generateYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <label>Country</label>
          <select
            id="country"
            name="country"
            onChange={handleChange}
            className={`select-disabled-option form-select ${errors.country ? 'error' : ''}`}
            defaultValue=""
          >
            <option value="" disabled>Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <button type="submit" className="form-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Check SDN'}
          </button>
        </form>
        {renderFailed()}
      </div>
      {renderResult()}
    </div>
  );
};

export default SDNForm;
