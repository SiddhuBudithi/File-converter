import React from "react";
import "../CSS/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h3>TWOKEY</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <div className="social-icons">
                        <i className="fab fa-github"></i>
                        <i className="fab fa-discord"></i>
                        <i className="fab fa-twitter"></i>
                        <i className="fab fa-linkedin"></i>
                        <i className="fab fa-youtube"></i>
                    </div>
                </div>

                <div className="footer-column">
                    <h3>Company</h3>
                    <p>Home</p>
                    <p>About</p>
                    <p>Product</p>
                </div>

                <div className="footer-column">
                    <h3>Contact</h3>
                    <p>Email Us</p>
                    <p>Support</p>
                </div>

                <div className="footer-column">
                    <h3>Product</h3>
                    <p>Pricing</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
