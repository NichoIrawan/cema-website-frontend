"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase"; // Pastikan path ini sesuai
import { signInWithPopup } from "firebase/auth";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  // --- STATE ---
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // State untuk Popup Manual (Tanpa library tambahan)
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success", // 'success' atau 'error'
  });

  // Base URL dari Environment Variable
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- HELPER UNTUK TUTUP POPUP ---
  const closePopup = () => {
    setPopup({ ...popup, show: false });
    // Jika login sukses, arahkan ke dashboard setelah popup ditutup
    if (popup.type === "success") {
      router.push("/dashboard");
    }
  };

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    try {
      // 1. Trigger Google Popup
      const result = await signInWithPopup(auth, googleProvider);

      // 2. Ambil ID Token
      const idToken = await result.user.getIdToken();

      // 3. Kirim ke Backend
      const res = await fetch(`${API_URL}/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data && data.status === "ok") {
        localStorage.setItem("token", data.token);
        // Tampilkan Popup Sukses
        setPopup({
          show: true,
          message: `Login Berhasil! Selamat datang ${
            data.user?.name || "User"
          }`,
          type: "success",
        });
      } else {
        // Tampilkan Popup Gagal
        setPopup({
          show: true,
          message: data?.error || "Google login gagal",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      if (error.code !== "auth/popup-closed-by-user") {
        setPopup({
          show: true,
          message: "Terjadi kesalahan saat login Google.",
          type: "error",
        });
      }
    }
  };

  // --- REGULAR EMAIL/PASSWORD HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        setPopup({
          show: true,
          message: `Request gagal: ${res.status}`,
          type: "error",
        });
        return;
      }

      const data = await res.json();

      if (data && data.status === "ok") {
        localStorage.setItem("token", data.token);
        // Tampilkan Popup Sukses
        setPopup({
          show: true,
          message: `Login Berhasil! Selamat datang ${data.role || "User"}`,
          type: "success",
        });
      } else {
        // Tampilkan Popup Gagal
        setPopup({
          show: true,
          message: data?.error || "Login gagal, cek email/password.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Gagal menghubungi server:", error);
      setPopup({
        show: true,
        message: "Terjadi kesalahan koneksi ke server.",
        type: "error",
      });
    }
  };

  return (
    <div className="login-container">
      {/* --- KOMPONEN POPUP CUSTOM --- */}
      {popup.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)", // Layar hitam transparan
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              maxWidth: "400px",
              width: "80%",
            }}
          >
            <h3
              style={{
                color: popup.type === "success" ? "#2ecc71" : "#e74c3c",
                marginBottom: "10px",
              }}
            >
              {popup.type === "success" ? "Berhasil!" : "Gagal!"}
            </h3>
            <p style={{ marginBottom: "20px", color: "#333" }}>
              {popup.message}
            </p>
            <button
              onClick={closePopup}
              style={{
                backgroundColor:
                  popup.type === "success" ? "#2ecc71" : "#e74c3c",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {popup.type === "success" ? "Lanjut" : "Tutup"}
            </button>
          </div>
        </div>
      )}
      {/* --- END POPUP --- */}

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
              <button
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
              >
                <img
                  src="/images/google.png"
                  alt="Google"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                Log in with Google
              </button>

              <button type="button" className="facebook-btn">
                <img
                  src="/images/facebook.png"
                  alt="Facebook"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
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
