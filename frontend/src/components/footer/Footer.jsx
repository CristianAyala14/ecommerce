import React from 'react';
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Enlaces */}
        <div className="footer-section">
          <p>Enlaces</p>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/products">Productos</Link></li>
            <li><Link to="/about">Sobre nosotros</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="footer-section">
          <p>Contacto</p>
          <p>Email: contacto@miempresa.com</p>
          <p>Tel: +54 9 11 1234 5678</p>
        </div>

      
        {/* Redes sociales */}
        <div className="footer-section">
          <p>Síguenos</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF size="0.5em"/></a>
            <a href="#"><FaInstagram size="0.5em"/></a>
            <a href="#"><FaTwitter size="0.5em"/></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className='last-sign'>&copy; {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
