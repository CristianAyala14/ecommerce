import "./Header.css";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {useAuthContext} from "../../contexts/authContext"

export default function Header() {

  const {logOut} = useAuthContext()
  
  return (
    <div className="header-container">
      <Link to="/dashboard">
        <img className="logo" src={logo} alt="Logo" />
      </Link>

      <nav className="nav-container">
        <ul className="nav-list">
          <NavLink to="/dashboard" className="nav-item">
            <i className="fa-solid fa-gauge"></i>
            <span className="nav-text">Dashboard</span>
          </NavLink>

          <NavLink to="/products" className="nav-item">
            <i className="fa-solid fa-newspaper"></i>
            <span className="nav-text">Productos</span>
          </NavLink>

          <NavLink to="/categories" className="nav-item">
            <i className="fa-solid fa-icons"></i>
            <span className="nav-text">Categorias</span>
          </NavLink>

          <NavLink to="/orders" className="nav-item">
            <i className="fa-solid fa-bag-shopping"></i>
            <span className="nav-text">Ordenes</span>
          </NavLink>
        </ul>
      </nav>

      <div>
        <button className="logOut-button" onClick={logOut}>
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
        <Link to="/profile">
          <button className="user-button">
            <i className="fa-solid fa-user"></i>
          </button>
        </Link>
      </div>
      
    </div>
  );
}
