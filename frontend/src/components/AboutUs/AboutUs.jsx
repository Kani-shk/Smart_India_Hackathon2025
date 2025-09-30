import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <section className="aboutus-section">
      <div className="aboutus-container">
        <div className="aboutus-header">
          <h1 id="aboutus" className="aboutus-title">About Our Organization</h1>
          <p className="aboutus-subtitle">
            Dedicated to fighting hunger and building stronger communities through compassion, 
            collaboration, and sustainable food distribution programs.
          </p>
        </div>

        <div className="aboutus-content">
          <div>
            <p className="aboutus-text">
              We are a community-driven organization committed to addressing food insecurity 
              and hunger in our local communities. Our mission began with a simple belief: 
              no one should go hungry when there's surplus food available.
            </p>
            <p className="aboutus-text">
              Through strategic partnerships with restaurants, event organizers, and generous 
              individuals, we rescue food that would otherwise go to waste and distribute it 
              to families and individuals who need it most.
            </p>
            
            <div className="aboutus-mission">
              <h3 className="mission-title">Our Mission</h3>
              <p className="mission-text">
                To eliminate food waste while fighting hunger by creating an efficient network 
                that connects food donors with those in need, building a more sustainable and 
                compassionate community for all.
              </p>
            </div>
          </div>
          
          <div className="aboutus-image">
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Community food distribution" />
          </div>
        </div>

        <div className="aboutus-stats">
          <h2 className="stats-title">Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">2,500+</span>
              <span className="stat-label">Meals Distributed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Families Helped</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Partner Restaurants</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Volunteers</span>
            </div>
          </div>
        </div>

        <div className="aboutus-values">
          <h2 className="values-title">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Community Partnership</h3>
              <p className="value-description">
                We believe in the power of collaboration. By working together with local 
                businesses, volunteers, and community members, we create lasting positive change.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">♻️</div>
              <h3 className="value-title">Sustainability</h3>
              <p className="value-description">
                Our approach focuses on reducing food waste while addressing hunger, creating 
                an environmentally responsible solution that benefits everyone.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3 className="value-title">Dignity & Respect</h3>
              <p className="value-description">
                We treat every individual with dignity and respect, ensuring our services 
                are provided with compassion and without judgment.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3 className="value-title">Transparency</h3>
              <p className="value-description">
                We maintain complete transparency in our operations, showing exactly how 
                donations are used and the impact they create in our community.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3 className="value-title">Rapid Response</h3>
              <p className="value-description">
                When emergencies arise, we act quickly to provide immediate relief and support 
                to those affected by disasters or unexpected circumstances.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3 className="value-title">Growth & Innovation</h3>
              <p className="value-description">
                We continuously improve our methods and expand our reach, always seeking 
                new ways to serve our community more effectively and efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;