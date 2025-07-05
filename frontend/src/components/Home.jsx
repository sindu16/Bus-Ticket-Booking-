import React from 'react';
import styles from './Home.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className={`${styles.heroContainer}`}>
      <div className={styles.homeTop}>

      
      <h6 className='text-muted'>Get Your bus tickets</h6>
      <h1 className='fw-bold mb-4'>Find Best Bus For You !</h1>

      <div className={styles.searchBar}>
        <div className={styles.searchInputGroup}>
          <FaMapMarkerAlt className={styles.inputIcon} />
         
        </div>
         <input
            className={`form-control ${styles.searchInput}`}
            type='text'
            placeholder='Origin...'
          />

        <input
          className={`form-control ${styles.searchInput}`}
          type='text'
          placeholder='Departure...'
        />
        <Link  to='/login' className='btn btn-danger mb-3'>Search</Link>
      </div>
      </div>
    </div>
  );
};

export default Home;
