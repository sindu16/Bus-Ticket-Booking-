import React from 'react';
import styles from './Footer.module.css';
import { FaInstagram, FaFacebookF, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
<footer className={` navbar-light bg-white shadow-sm  ${styles.footer}`}>
      <div className="container py-5">
        <div className="row gy-4">

          <div className="col-md-4">
            <h2 className={styles.logo}>Joe Travels</h2>
            <p className={styles.description}>
            Booking your bus tickets has never been this easy! Our online platform lets you choose your destination,
             compare fares, select your seats, and confirm your journey—all from the comfort of your home. Travel smart, travel stress-free!
            </p>
            <div className={styles.socialIcons}>
              <FaInstagram />
              <FaFacebookF />
              <FaYoutube />
              <FaXTwitter />
            </div>
          </div>

          <div className="col-md-2">
            <h5 className={styles.title}>Quick Links</h5>
            <ul className={styles.linkList}>
              <li>About Us</li>
              <li>My Account</li>
              <li>Reserve your ticket</li>
              <li>Create your account</li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className={styles.title}>Top Reserved Routes</h5>
            <ul className={styles.linkList}>
              <li>Chennai - Vellore</li>
              <li>Salem- Erode</li>
              <li>Coimbatore - Ooty</li>
              <li>Madurai - Trichy</li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5 className={styles.title}>Support Links</h5>
            <ul className={styles.linkList}>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Help & Support Center</li>
              <li>FAQs</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
