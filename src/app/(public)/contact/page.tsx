import './contact.css';

export default function ContactPage() {
    return (
      <main>
        <div className="right-up-bg">
          <img src="/images/right-up-bg.png" alt="right-up-bg" />
        </div>
        <div className="left-bottom-bg">
          <img src="/images/bg-contact-us.png" alt="left-bottom-bg" />
        </div>
        
        <div>
  
          <section className="contact-section">
            <h1>Contact Us</h1>
            <p className="subtitle">Any question or remarks? Just write us a message!</p>
  
            <div className="contact-container">
              <div className="contact-info">
                <div className="bg-bottom-right">
                  <img src="/images/bottom-right-bg.png" alt="bg-bottom-right" />
                </div>
                <h2>Contact Information</h2>
                <p className="info-text">Say something to start a live chat!</p>
  
                <div className="info-item">
                  <i className="icon">
                    <img src="/images/icon-call.png" alt="icon-call" />
                  </i>
                  <span>+1012 3456 789</span>
                </div>
                <div className="info-item">
                  <i className="icon">
                    <img src="/images/icon-email.png" alt="icon-email" />
                  </i>
                  <span>demo@gmail.com</span>
                </div>
                <div className="info-item">
                  <i className="icon">
                    <img src="/images/icon-map.png" alt="icon-map" />
                  </i>
                  <span>132 Dartmouth Street Boston,<br /> Massachusetts 02156 United States</span>
                </div>
  
                <div className="social-icons">
                  <a href="#">
                    <img src="/images/twitter-icon.png" alt="icon-twitter" />
                  </a>
                  <a href="#">
                    <img src="/images/ig-icon.png" alt="icon-ig" />
                  </a>
                  <a href="#"> 
                    <img src="/images/dc-icon.png" alt="icon-dc" />
                  </a>
                </div>
              </div>
  
              <div className="contact-form">
                <form>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" placeholder="John" />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" placeholder="Doe" />
                    </div>
                  </div>
  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="text" placeholder="+1012 3456 789" />
                    </div>
                  </div>
  
                  <div className="form-group">
                    <label>Select Subject?</label>
                    <div className="radio-group">
                      <label><input type="radio" name="subject" defaultChecked /> About Home Design </label>
                      <label><input type="radio" name="subject" /> About Home Construction</label>
                      <label><input type="radio" name="subject" /> About Error Payment</label>
                      <label><input type="radio" name="subject" /> About System Bug</label>
                      <label><input type="radio" name="subject" /> About Project</label>
                      <label><input type="radio" name="subject" /> Consultation</label>
                      <label><input type="radio" name="subject" /> Others</label>
                    </div>
                  </div>
  
                  <div className="form-group">
                    <label>Message</label>
                    <textarea placeholder="Write your message.."></textarea>
                  </div>
  
                  <button type="submit" className="send-btn">Send Message</button>
                </form>
              </div>
            </div>
            
           
          </section>
  
          
        </div>
      </main>
    );
  }