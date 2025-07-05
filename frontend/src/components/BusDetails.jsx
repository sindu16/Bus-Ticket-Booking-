import  { useState } from 'react';
import styles from './BusDetails.module.css';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import bus1 from '../assets/bus.jpg';
import bus2 from '../assets/bus2.jpg';
import bus3 from '../assets/bus3.jpg';
// import bus4 from '../assets/bus5.jpg'

const amenities = [
  { name: 'Super AC', available: true },
  { name: 'Charging Port', available: true },
  { name: 'Internet/Wifi', available: true },
  { name: 'AC & Air Suspension', available: true },
  { name: 'Sleeper Seat', available: false },
  { name: 'Snacks', available: false },
  { name: '2*2 VIP Sofa', available: true },
  { name: 'Cooler fan', available: true },
  { name: 'LED TV', available: true },
  { name: 'Water Bottles', available: true },
  { name: 'Luxury Seat', available: true },
  { name: 'Comfortable Seat', available: true },
];

const policies = [
  'Please note that this ticket is non-refundable.',
  'Passengers must keep their tickets until the journey ends; otherwise, they will need to purchase a new one.',
  'Tickets can be cancelled 24 hours before the departure time for a 50% fee.',
  'Bus services may be cancelled, rescheduled, or delayed due to natural disasters or other unforeseen circumstances.',
  'Passengers must arrive at the boarding point 30 minutes before the departure time. The company is not responsible for missed buses due to late arrivals.',
];

const busImages = [
  bus1,
  bus2,
  // bus4,
  bus3,
];

const BusDetails = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={styles.busDetailsContainer}>
      <p className={styles.description}>
  Book your bus tickets easily with our user-friendly platform. 
  Enjoy a hassle-free travel experience with a wide range of buses,
  trusted operators, and multiple route options across Tamil Nadu and beyond.
   Get real-time seat availability, transparent pricing, and secure online payments.
    <strong>Want to explore more details about this bus?</strong>
</p>


      <button className={`btn btn-outline-danger ${styles.hideButton}`} onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'Hide Bus Details' : 'Show Bus Details'}
      </button>

      {showDetails && (
        <>
          <div className={styles.detailsGrid}>
            <div className={styles.amenities}>
              <h5>Bus Amenities</h5>
              <ul>
                {amenities.map((item, idx) => (
                  <li key={idx} className={item.available ? styles.available : styles.unavailable}>
                    {item.available ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.policies}>
              <h5>Reservation Policies</h5>
              <ul>
                {policies.map((policy, idx) => (
                  <li key={idx}>{policy}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.imageGallery}>
            {busImages.map((src, idx) => (
              <img key={idx} src={src} alt={`bus-${idx}`} className={styles.busImage} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BusDetails;
