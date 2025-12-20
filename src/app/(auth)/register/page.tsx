'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase'; // Ensure this path is correct
import { signInWithPopup } from 'firebase/auth';
import '../login/login.css';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', telepon: '', password: '' });

  // --- GOOGLE REGISTER/LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data && data.status === 'ok') {
        localStorage.setItem('token', data.token);
        alert(`Registrasi/Login Berhasil! Selamat datang ${data.user.name}`);
        router.push('/dashboard');
      } else {
        alert(data?.error || 'Google Authentication gagal');
      }
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Terjadi kesalahan saat menggunakan Google.');
      }
    }
  };

  // --- REGULAR FORM SUBMISSION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === 'ok') {
        alert('Registrasi Berhasil! Silakan Login.');
        router.push('/login');
      } else {
        alert(data.error || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Gagal menghubungi server.');
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', flexDirection: 'row' }}>
      <div className="left-container">
        <div className="brand-container">
          <img src="/images/Cema_Logo.png" alt="logo" className="logo" onError={(e) => e.currentTarget.style.display='none'} />
          <h1 className="brand">Cema<span className="highlight">Design</span></h1>
        </div>
        <div className="left-content">
          <h2 className="h-content">Join Us!</h2>
          <p className="p-content">Create an account to start your design journey with CemaDesign.</p>
        </div>
      </div>

      <div className="right-container">
        <div className="login-form">
          <p className="welcome-text">CREATE YOUR NEW ACCOUNT</p>
          <h2>Register your Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Nomor Telepon" 
                value={formData.telepon}
                onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <input 
                type="email" 
                placeholder="johnsondoe@nomail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button type="submit" className="continue-btn">Continue</button>

            <div className="divider">Or</div>

            <div className="social-login">
              <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                <img src="/images/google.png" alt="G" /> Log in with Google
              </button>
              <button type="button" className="facebook-btn">
                <img src="/images/facebook.png" alt="F" /> Log in with Facebook
              </button>
            </div>

            <p className="signup">
              Have Account? 
              <Link href="/login" className="signup-link" style={{ marginLeft: '5px' }}>
                SIGN IN HERE
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}