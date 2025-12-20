"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Login request failed:", res.status, errText);
        alert("Login request failed: " + res.status);
        return;
      }

      const data = await res.json();
      console.log("login response", data);

      if (data && data.status === "ok") {
        // Simpan token (sesuaikan nama field dari backend)
        localStorage.setItem("token", data.token);

        alert(`Login Berhasil! Selamat datang ${data.role}`);
        router.push("/dashboard");
      } else {
        alert(data?.error || "Login gagal");
      }
    } catch (error) {
      console.error("Gagal menghubungi server:", error);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="login-container">
      <div className="left-container">
        <div className="brand-container">
          <img
            src="/images/Cema_Logo.png"
            alt="logo"
            className="logo"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <h1 className="brand">
            Cema<span className="highlight">Design</span>
          </h1>
        </div>
        <div className="left-content">
          <h2 className="h-content">Welcome Back!</h2>
          <p className="p-content">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </div>

      <div className="right-container">
        <div className="login-form">
          <p className="welcome-text">WELCOME BACK</p>
          <h2>Log In to your Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "38px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" style={{ width: "auto" }} />
                Remember me
              </label>
              <div className="forgot" style={{ cursor: "pointer" }}>
                Forgot Password?
              </div>
            </div>

            <button type="submit" className="continue-btn">
              Continue
            </button>

            <div className="divider">Or</div>
            <div className="social-login">
              <button type="button" className="google-btn">
                <img
                  src="/images/google.png"
                  alt="Google"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />{" "}
                Log in with Google
              </button>
              <button type="button" className="facebook-btn">
                <img
                  src="/images/facebook.png"
                  alt="Facebook"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />{" "}
                Log in with Facebook
              </button>
            </div>

            <p className="signup">
              New User?
              <Link
                href="/register"
                className="signup-link"
                style={{ marginLeft: "5px" }}
              >
                SIGN UP HERE
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
