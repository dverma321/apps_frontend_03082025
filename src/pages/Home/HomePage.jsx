import React from 'react';
import './HomePage.css'; // We'll create this CSS file next
import { FaCode, FaServer, FaDatabase, FaBriefcase, FaGraduationCap, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="resume-container">
      {/* Header Section */}
      <header className="resume-header">
        <div className="header-content">
          <h1>Divyanshu Verma</h1>
          <h2>SAP UI5 Designer / Fiori Consultant | MERN Developer</h2>
          <div className="contact-info">
            <span><FaPhone /> +91 8058-70-5827</span>
            <span><FaEnvelope /> divyanshuverma36@example.com</span>
            <span><FaMapMarkerAlt /> Udaipur, Rajasthan, India</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="resume-main">
        {/* Left Column */}
        <div className="resume-left">
          {/* About Section */}
          <section className="resume-section">
            <h3 className="section-title">About Me</h3>
            <p>
              Experienced SAP Fiori/UI5 Developer and MERN stack enthusiast with a passion for creating 
              elegant, efficient solutions. Strong background in both frontend development and enterprise 
              application design.
            </p>
          </section>

          {/* Skills Section */}
          <section className="resume-section">
            <h3 className="section-title">Technical Skills</h3>
            <div className="skills-grid">
              <div className="skill-category">
                <h4><FaCode /> Frontend</h4>
                <ul>
                  <li>SAP UI5/Fiori</li>
                  <li>React.js</li>
                  <li>JavaScript/TypeScript</li>
                  <li>HTML5/CSS3</li>
                  <li>Bootstrap/Tailwind</li>
                </ul>
              </div>
              <div className="skill-category">
                <h4><FaServer /> Backend</h4>
                <ul>
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>OData Services</li>
                  <li>RESTful APIs</li>
                </ul>
              </div>
              <div className="skill-category">
                <h4><FaDatabase /> Database & Tools</h4>
                <ul>
                  <li>MongoDB</li>
                  <li>SQL</li>
                  <li>SAP BTP</li>
                  <li>Git/GitHub</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Education Section */}
          <section className="resume-section">
            <h3 className="section-title"><FaGraduationCap /> Education</h3>
            <div className="timeline-item">
              <h4>Bachelor's Degree</h4>
              <div className="timeline-meta">
                <span className="timeline-date">2012 - 2016</span>
                <span className="timeline-location">Rajasthan Technical University</span>
              </div>
              <p>Electrical Engineering</p>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="resume-right">
          {/* Experience Section */}
          <section className="resume-section">
            <h3 className="section-title"><FaBriefcase /> Experience</h3>
            
            <div className="timeline-item">
              <h4>Fiori Developer – Novel Veritas Pvt. Ltd.</h4>
              <div className="timeline-meta">
                <span className="timeline-date">Present</span>
                <span className="timeline-location">Udaipur, India</span>
              </div>
              <ul className="timeline-description">
                <li>Developed SAP Fiori apps integrated with BTP</li>
                <li>Implemented CRUD operations with OData services</li>
                <li>Customized Fiori elements apps</li>
                <li>Worked on SAPUI5 standalone applications</li>
              </ul>
              <div className="skill-tags">
                <span>SAPUI5</span>
                <span>Fiori</span>
                <span>OData</span>
                <span>BTP</span>
              </div>
            </div>

            <div className="timeline-item">
              <h4>Technical Support – Swiggy (FiveSDigital)</h4>
              <div className="timeline-meta">
                <span className="timeline-date">2022</span>
                <span className="timeline-location">Remote</span>
              </div>
              <ul className="timeline-description">
                <li>Provided technical support and resolved customer issues</li>
                <li>Managed customer queries through multiple channels</li>
                <li>Maintained high customer satisfaction ratings</li>
              </ul>
              <div className="skill-tags">
                <span>Customer Support</span>
                <span>Troubleshooting</span>
                <span>Communication</span>
              </div>
            </div>

            <div className="timeline-item">
              <h4>Assistant Junior Engineer – RVUNL POWER PLANT</h4>
              <div className="timeline-meta">
                <span className="timeline-date">2017</span>
                <span className="timeline-location">Rajasthan, India</span>
              </div>
              <ul className="timeline-description">
                <li>Worked on electrical and mechanical systems</li>
                <li>Assisted in maintenance operations</li>
                <li>Participated in safety and operational procedures</li>
              </ul>
              <div className="skill-tags">
                <span>Engineering</span>
                <span>Maintenance</span>
                <span>Operations</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="resume-footer">
        <div className="social-links">
          <a href="https://linkedin.com/in/divyanshu-verma-106360153" target="_blank" rel="noopener noreferrer">
            <FaLinkedin /> LinkedIn
          </a>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FaGithub /> GitHub
          </a>
        </div>
        <p>© {new Date().getFullYear()} Divyanshu Verma. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;