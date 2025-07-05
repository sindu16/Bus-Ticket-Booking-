import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styles from './AdminDashboard.module.css';


const AdminDashboard = () => {
  return (
    <>
    
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <h3>Admin Panel</h3>
        <nav>
          
          <Link to="dashboard" className={styles.link}>Dashboard</Link>
          <Link to="buses" className={styles.link}>Manage Buses</Link>
          <Link to="bookings" className={styles.link}>View Bookings</Link>
        </nav>
      </aside>

      <main className={styles.mainContent}>
       
        <Outlet /> 
      </main>
    </div>
    </>
  );
};

export default AdminDashboard;
