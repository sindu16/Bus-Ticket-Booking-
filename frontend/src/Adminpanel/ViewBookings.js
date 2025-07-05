import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewBookings.module.css';


const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings');
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  return (
  <>

    <div className={` ${styles.container}`}>
      <h2 className={styles.heading}>All Bookings</h2>
      <table className={styles.bookingTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Seats</th>
            <th>Bus</th>
            <th>Bus No</th>
            <th>From</th>
            <th>To</th>
            <th>Price Per Seat</th>
            <th>Total</th>
            <th>Journey Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{b.user}</td>
              <td>{b.seatCount}</td>
              <td>{b.busName}</td>
              <td>{b.busNo}</td>
              <td>{b.from}</td>
              <td>{b.to}</td>
              <td>₹{b.pricePerSeat}</td>
              <td>₹{b.totalPrice}</td>
              <td>{new Date(b.journeyDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default ViewBookings;
