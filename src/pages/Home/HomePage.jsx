import React, { useState, useEffect } from "react";
import "./HomePage.css";

import "@fortawesome/fontawesome-free/css/all.min.css";


const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");


    // Simulate fetching products from an API


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = import.meta.env.DEV
                    ? import.meta.env.VITE_LOCAL_API_URL
                    : import.meta.env.VITE_PROD_API_URL;

                const token = localStorage.getItem("jwtoken") || "";

                const res = await fetch(`${apiUrl}/android/only-android-apps`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Failed to fetch products: ${res.status} - ${errorText}`);
                }

                const data = await res.json();
                const productsArray = Array.isArray(data) ? data : data.apps || [];
                
                setProducts(productsArray.slice(0, 8)); // Take only 8 products
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // for sending email from the home page

    const handleSubmit = async (e) => {
        e.preventDefault();

        const apiUrl = import.meta.env.DEV
            ? import.meta.env.VITE_LOCAL_API_URL
            : import.meta.env.VITE_PROD_API_URL;

        try {
            const response = await fetch(`${apiUrl}/contact/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();
            setResponseMessage(data.message);

            // Clear form fields
            setName("");
            setEmail("");
            setMessage("");

            // Clear the response message after 3 seconds
            setTimeout(() => {
                setResponseMessage("");
            }, 3000);
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setResponseMessage("Something went wrong. Please try again.");
        }
    };


    return (
        <div className="app">
            {/* Hero Section */}

            <section className="hero">
                <div className="container">
                    <div className="hero-box">

                        {/* Image */}
                        <div className="hero-image-container">
                            <img
                                src="/images/gallery/bittu_halfshirt.jpg"
                                alt="Divyanshu Verma"
                                className="hero-image"
                            />
                        </div>

                        {/* Content */}
                        <div className="hero-content">
                            <h1 className="hero-title">Divyanshu Verma</h1>
                            <h2 className="hero-subtitle">MERN Developer</h2>
                            <p className="hero-description">
                                Welcome to my portfolio! I'm a passionate and creative MERN stack
                                developer with a knack for building scalable, user-friendly, and
                                modern web applications. I love turning ideas into reality through
                                code and always strive to learn and grow in the ever-evolving tech
                                world.
                            </p>
                            <a href="#services" className="btn hero-button">
                                Explore My Services
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section-services" id="services">
                <div className="header-section">
                    <h2 className="title">My Services</h2>
                    <p className="description">
                        I offer a wide range of services to help you achieve your goals.
                    </p>
                </div>
                <div className="service-cards">
                    <div className="single-service">
                        <div className="circle-before"></div>
                        <div className="content">
                            <div className="icon">
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <h3 className="title">Android Developer</h3>
                            <p className="description">
                                Building modern and responsive Android applications.
                            </p>
                            <a href="#!">Learn More</a>
                        </div>
                    </div>
                    <div className="single-service">
                        <div className="circle-before"></div>
                        <div className="content">
                            <div className="icon">
                                <i className="fas fa-desktop"></i>
                            </div>
                            <h3 className="title">Desktop Developer</h3>
                            <p className="description">
                                Creating powerful desktop applications for various platforms.
                            </p>
                            <a href="#!">Learn More</a>
                        </div>
                    </div>
                    <div className="single-service">
                        <div className="circle-before"></div>
                        <div className="content">
                            <div className="icon">
                                <i className="fas fa-globe"></i>
                            </div>
                            <h3 className="title">Website Developer</h3>
                            <p className="description">
                                Designing and developing responsive and dynamic websites.
                            </p>
                            <a href="#!">Learn More</a>
                        </div>
                    </div>
                    <div className="single-service">
                        <div className="circle-before"></div>
                        <div className="content">
                            <div className="icon">
                                <i className="fas fa-robot"></i>
                            </div>
                            <h3 className="title">AI Expert</h3>
                            <p className="description">
                                Implementing AI and machine learning solutions.
                            </p>
                            <a href="#!">Learn More</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Gallery */}

            <section className="products-gallery">
                <h2>Trending Apps</h2>
                <small>Mostly downloaded by users</small>
                <div className="gallery">
                    {products.map((product) => (
                        <div key={product.id} className="gallery-item">
                            <img src={product.image} alt={product.name} />
                            <p>{product.name}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* Contact Form */}

            <section className="contact">
                <div className="header-section">
                    <h2 className="title">Contact Me</h2>
                    <p className="description">
                        Have a project in mind? Let's work together!
                    </p>
                </div>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                    <button type="submit">Send Message</button>
                </form>

                {responseMessage && <p className="response-message">{responseMessage}</p>}
            </section>


        </div>
    );
};

export default HomePage;