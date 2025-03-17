import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./New.css";


const New = () => {
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
        <div className="main-container">
            <div className="top-content">
                {/* Left Section - Text and Social Icons */}
                <div className="text-section">
                    {/* Social Icons */}
                    <div className="social-icons">
                        <a href="https://wa.me/918058705827" target="_blank" rel="noopener noreferrer" className="whatsapp">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                        <a href="https://www.facebook.com/fbdivyanshuverma" target="_blank" rel="noopener noreferrer" className="facebook">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://twitter.com/vdivyanshu" target="_blank" rel="noopener noreferrer" className="twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/divyanshu-verma-106360153" target="_blank" rel="noopener noreferrer" className="linkedin">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="https://user.qzone.qq.com/yourqqid" target="_blank" rel="noopener noreferrer" className="qq">
                            <i className="fab fa-qq"></i>
                        </a>
                        <a href="https://www.wechat.com/" target="_blank" rel="noopener noreferrer" className="wechat">
                            <i className="fab fa-weixin"></i>
                        </a>
                        <a href="https://www.hellotalk.com/ok_divyanshuverma_26610" target="_blank" rel="noopener noreferrer" className="hellotalk">
                            <i className="fas fa-comments"></i>
                        </a>
                    </div>

                    {/* Heading */}

                    <h1 className="title"> <span className="text-blue-500 font-bold">SAP UI5 / Fiori Consultant</span> <span className="text-green-500">And</span> <span className="text-red-500 font-bold">MERN Developer</span></h1>
                    <h2 className="subtitle">Divyanshu Verma</h2>

                    {/* Description */}
                    <p className="description">
                        Expert in SAP Fiori, SAPUI5, and MERN stack, creating seamless enterprise and web solutions.
                    </p>

                    {/* Buttons Container */}
                    <div className="buttons">
                        <button className="learn-more"><a href="#services">
                            Services
                        </a></button>
                        <button className="hire-me"><a href="#hire">
                            Hire Me
                        </a></button>
                    </div>
                </div>

                {/* Right Section - Image */}
                <div className="image-section">
                    <img
                        src="/images/png/div_front.jpg" // Replace with actual image
                        alt="Web Developer"
                        className="profile-img"
                    />
                </div>

            </div>

            <div className="app">

                {/* Products Gallery */}

                <section className="products-gallery">
                    <h2 className="title">Trending Apps</h2>
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
                                <h3 className="title">SAP UI5 Consultant  </h3>
                                <p className="description">
                                    Implementing AI and machine learning solutions.
                                </p>
                                <a href="#!">Learn More</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="contact" id="hire">
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
        </div>
    );
};

export default New;
