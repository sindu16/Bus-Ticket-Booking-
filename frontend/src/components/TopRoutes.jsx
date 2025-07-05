import React from 'react';
import styles from './TopRoutes.module.css';
import { FaWifi, FaUtensils, FaTv, FaChargingStation } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const routes = [
  { from: 'Chennai', to: 'Coimbatore', duration: '8 Hrs', price: 950, bus: 'TN73AZ 2155', company: 'TN Express' },
  { from: 'Madurai', to: 'Trichy', duration: '3 Hrs', price: 400, bus: 'TN23AT 7311', company: 'Madurai Travels' },
  { from: 'Salem', to: 'Erode', duration: '2 Hrs', price: 300, bus: 'TN83BW 3216', company: 'Salem Quick' },
  { from: 'Tirunelveli', to: 'Madurai', duration: '4 Hrs', price: 500, bus: 'TN52FE 9518', company: 'Tirunelveli Express' },
  { from: 'Chennai', to: 'Vellore', duration: '2 Hrs', price: 350, bus: 'TN85SK 5283', company: 'Chennai Rapid' },
  { from: 'Coimbatore', to: 'Ooty', duration: '4 Hrs', price: 600, bus: 'TN28GH 2538', company: 'Ooty Riders' },
];

const TopRoutes = () => {
  return (
    <div className={`container ${styles.topRoutesSection}`}>
      <h2 className={styles.title}>Top Search <span>Routes</span></h2>
      <div className="row">
        {routes.map((route, idx) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4" key={idx}>
            <div className={styles.card}>
              <div className={styles.routecolumn}>
                <div>
                  <small>Bus Name</small>
                  <p className="fw-bold">{route.company}</p>
                </div>
                <div>
                  <small>Bus No.</small>
                  <p className="fw-bold">{route.bus}</p>
                </div>
              </div>

              <div className={styles.routeHeader}>
                <div>
                  <small>From</small>
                  <h5>{route.from}</h5>
                </div>
                <div className={styles.duration}>{route.duration}</div>
                <div>
                  <small>To</small>
                  <h5>{route.to}</h5>
                </div>
              </div>

              <div className={styles.features}>
                <FaWifi />
                <FaUtensils />
                <FaTv />
                <FaChargingStation />
              </div>

              <div className={styles.cardFooter}>
                <span>Rs. {route.price}</span>
                <Link
                  to="/login"
                  onClick={() =>
                    localStorage.setItem('busDetails', JSON.stringify({
                      from: route.from,
                      to: route.to,
                      departure: '06:00 AM',
                      arrival: route.duration,
                      price: route.price,
                      bus: route.bus,
                      company: route.company
                    }))
                  }
                  className={styles.reserveBtn}
                >
                  Reserve Seat
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopRoutes;
