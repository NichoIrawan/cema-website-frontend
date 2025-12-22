"use client";
import { useState, useRef, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import "./contact.css";

export default function ContactPage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [loading, setLoading] = useState(false);

  // State untuk Toast Pop-up
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success", // 'success' | 'error'
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    subject: "About Home Design",
    message: "",
  });

  // Fungsi untuk menampilkan Toast
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });

    // Sembunyikan otomatis setelah 3 detik
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = recaptchaRef.current?.getValue();

    if (!token) {
      showToast("Please complete the reCAPTCHA", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, captchaToken: token }),
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast("Message sent successfully!", "success");
        // Reset form & captcha
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          subject: "About Home Design",
          message: "",
        });
        recaptchaRef.current?.reset();
      } else {
        showToast("Failed to send message. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("An error occurred. Please check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ position: "relative" }}>
      {/* MANUAL TOAST COMPONENT */}
      {toast.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: toast.type === "success" ? "#4CAF50" : "#F44336",
            color: "white",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            animation: "slideIn 0.3s ease-out",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "500",
          }}
        >
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      )}

      {/* Background Ornaments */}
      <div className="right-up-bg">
        <img src="/images/right-up-bg.png" alt="right-up-bg" />
      </div>
      <div className="left-bottom-bg">
        <img src="/images/bg-contact-us.png" alt="left-bottom-bg" />
      </div>

      <section className="contact-section">
        <h1>Contact Us</h1>
        <p className="subtitle">
          Any question or remarks? Just write us a message!
        </p>

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
              <span>
                132 Dartmouth Street Boston,
                <br /> Massachusetts 02156 United States
              </span>
            </div>

            <div className="social-icons">
              <a href="#">
                <img src="/images/twitter-icon.png" alt="twitter" />
              </a>
              <a href="#">
                <img src="/images/ig-icon.png" alt="ig" />
              </a>
              <a href="#">
                <img src="/images/dc-icon.png" alt="discord" />
              </a>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="+1012 3456 789"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Select Subject?</label>
                <div className="radio-group">
                  {[
                    "About Home Design",
                    "About Home Construction",
                    "About Error Payment",
                    "About System Bug",
                    "About Project",
                    "Consultation",
                    "Others",
                  ].map((sub) => (
                    <label key={sub} className="radio-label">
                      <input
                        type="radio"
                        name="subject"
                        value={sub}
                        checked={formData.subject === sub}
                        onChange={handleChange}
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message.."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div
                className="captcha-container"
                style={{ marginBottom: "20px" }}
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                />
              </div>

              <button type="submit" className="send-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tambahkan keyframes untuk animasi toast di file CSS kamu atau global.css */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
