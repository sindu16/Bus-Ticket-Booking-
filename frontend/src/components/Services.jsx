import React from 'react';
import styles from './Services.module.css';
import { FaLock, FaUndo, FaHeadset } from 'react-icons/fa';

const Services = () => {
  return (
    <div className={styles.servicesSection}>
      <h2 className={styles.title}>
        Our <span>Services</span>
      </h2>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <FaLock className={styles.icon} />
          <h5>Secure Payment</h5>
          <p>Integrate secure payment gateways for users to pay for their tickets</p>
        </div>

        <div className={styles.card}>
          <FaUndo className={styles.icon} />
          <h5>Refund Policy</h5>
          <p>Offer options for the users to purchase refundable tickets with clear terms</p>
        </div>

        <div className={styles.card}>
          <FaHeadset className={styles.icon} />
          <h5>24/7 Support</h5>
          <p>Get assistance anytime through chat, email, or phone</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
