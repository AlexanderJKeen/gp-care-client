import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark bg-opacity-100 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/"> 
        <img src="./images/nhs.png" alt="." width="60" height="30"/> GP Care
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bookings">Book Appointment</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Admin">Admin</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;