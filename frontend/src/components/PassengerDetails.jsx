import  { useState } from 'react';
import styles from './PassengerDetails.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PassengerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    from = 'From',
    to = 'To',
    departure = '00:00',
    arrival = '00:00',
    selectedSeats = [],
    totalPrice = 0,
    pricePerSeat = 0,
    busNo = 'N/A',
    company = 'Company',
    duration= 'time',
     ampmarrival ='PM',
     ampmdeparture='AM',
    journeyDate = '',
    busType =''
  } = location.state || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [pickupStation, setPickupStation] = useState('');
  const [dropStation, setDropStation] = useState('');

  const validateForm = () => {
    // Check if all fields are filled
    if (
      name.trim() === '' ||
      email.trim() === '' ||
      phone.trim() === '' ||
      altPhone.trim() === '' ||
      pickupStation.trim() === '' ||
      dropStation.trim() === ''
    ) {
      alert('Please fill in all the fields before proceeding to payment.');
      return false;
    }

    // Validate Email format using a simple regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return false;
    }

    // Validate Phone number format using a regex (allowing 10-digit phone numbers)
    const phoneRegex = /^[6-9]\d{9}$/; // Matches 10-digit phone numbers starting with 6-9
    if (!phoneRegex.test(phone)) {
      alert('Please enter a valid phone number (10 digits).');
      return false;
    }

    // Validate Alternative Phone number format
    if (altPhone.trim() && !phoneRegex.test(altPhone)) {
      alert('Please enter a valid alternative phone number (10 digits).');
      return false;
    }

    return true;
  };


  const handlePayment = () => {
    if (!validateForm()) return;

    const options = {
      key: "rzp_test_EPupCME1guz73J",
      amount: totalPrice * 100,
      currency: "INR",
      name: "Joe Travels",
      image: "https://your-logo-url.com/logo.png",
      handler: function (response) {
        alert('Payment Successful! ID:' + response.razorpay_payment_id);
      },
      prefill: {
        name,
        email,
        contact: phone,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };



  const handleInvoiceClick = async () => {
    if (!validateForm()) return;
  
    const bookingData = {
      user: name,
      name,
      email,
      phone,
      altPhone,
      pickupStation,
      dropStation,
      seatCount: selectedSeats.length,
      selectedSeats,
      from,
      to,
      departure,
      arrival,
      busName: company,
      busNo,
      pricePerSeat,
      totalPrice,
      journeyDate,
      duration,
      ampmarrival,
      ampmdeparture,
      busType

    };
  
    try {
      await axios.post('http://localhost:5000/api/bookings', bookingData);
      navigate('/invoice', { state: bookingData });
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Error saving booking');
    }
  };
  

  return (
    <div className={`container-fluid  ${styles.container}`}>
      <div className="row">
        {/* Left Section: Passenger Information */}
        <div className="col-lg-6 col-md-12">
          <div className={styles.left}>
            <h4>Passenger Information</h4>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="form-control" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
            <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" />
            <input type="tel" placeholder="Alternative Phone" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} className="form-control" />
            <input type="text" placeholder="Pickup Station" value={pickupStation} onChange={(e) => setPickupStation(e.target.value)} className="form-control" />
            <input type="text" placeholder="Drop Station" value={dropStation} onChange={(e) => setDropStation(e.target.value)} className="form-control" />
            <button className={styles.buttonpays} onClick={handlePayment}> ← Proceed To Pay </button>
          </div>
        </div>

        {/* Right Section: Ticket Details */}
        <div className="col-lg-6 col-md-12">
          <div className={styles.right}>
            <h4>Your Ticket Report Status</h4>
            <div className={styles.ticketBox}>
              <p><strong>Your Destination</strong></p>
              <p><span>Origin:</span> {from} ({departure} {ampmdeparture})</p>
              <p><span>Destination:</span> {to} ({arrival} {ampmarrival})</p>
              <p><span>Duration:</span> {duration}</p>
              <p><span>Bus No:</span> {busNo}</p>
              <p><span>Bus Name:</span> {company}</p>
              <p><span>Bus Type:</span> {busType}</p>
              <p><span>Journey Date:</span> {journeyDate}</p>
              <p><strong>Your Seats</strong></p>
              <div className={styles.seats}>
                {selectedSeats.map((seat) => (
                  <span key={seat}>{seat}</span>
                ))}
              </div>
              <p><strong>Total Fare Price</strong></p>
              <p className={styles.totalPrice}>NPR {totalPrice}</p>
              <small>(Including all taxes)</small>
            </div>
            <button onClick={handleInvoiceClick} className={styles.payInvoice}>Invoice →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
