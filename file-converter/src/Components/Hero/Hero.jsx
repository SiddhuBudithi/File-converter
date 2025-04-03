import React from "react";
import "../CSS/Hero.css";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const handleLearnMore = () => {
        navigate("/login");
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <h1>TWOKEY CLOUD WORKSPACE</h1>
                <p>
                    Welcome to Twokey Cloud Workspace - your ultimate solution for secure and collaborative cloud-based file management. 
                    Streamline your workflow, enhance productivity, and experience unparalleled data security with Twokey.
                </p>
                <button onClick={handleLearnMore} className="hero-button">Learn More</button>
            </div>
            <div className="hero-image">
                <img src="https://www.twokey.net/assets/HeroAni/hero1.webp" alt="Twokey Cloud Workspace" />
            </div>
        </section>
    );
};

export default Hero;
