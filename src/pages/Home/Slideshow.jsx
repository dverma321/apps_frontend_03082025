import React, { useState, useEffect } from "react";
import "./Slideshow.css"; // Import CSS for styling

const images = [
  "/images/gallery/bittu_green.jpg",
  "/images/gallery/bittu_halfshirt.jpg",
  "/images/gallery/bittu_green.jpg" 
];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="slideshow-container">
      <button className="prev" onClick={prevSlide}>
        ❮
      </button>

      <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} className="slide" />

      <button className="next" onClick={nextSlide}>
        ❯
      </button>

      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
