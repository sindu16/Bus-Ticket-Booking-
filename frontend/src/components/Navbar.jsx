import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg  bg-white shadow-sm position-fixed w-100">
            <div className="container">
                <NavLink className="navbar-brand fw-bold text-danger" to="/">Joe Travels</NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav mb-2 mb-lg-0 gap-3">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `nav-link ${styles.navItem} ${isActive ? styles.activeLink : ''}`
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/service"
                                className={({ isActive }) =>
                                    `nav-link ${styles.navItem} ${isActive ? styles.activeLink : ''}`
                                }
                            >
                                Services
                            </NavLink> 
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `nav-link ${styles.navItem} ${isActive ? styles.activeLink : ''}`
                                }
                            >
                                Tickets
                            </NavLink>
                        </li>
                       
                    </ul>
                </div>

                <div className="d-flex">
                    <Link to="/login" className="btn btn-outline-danger ms-lg-3">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
