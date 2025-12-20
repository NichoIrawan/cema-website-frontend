'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase'; // Ensure this path matches your lib file
import { signInWithPopup } from 'firebase/auth';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleLogin = async () => {
    try {
      // 1. Trigger the Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Get the ID Token from the logged-in Google user
      const idToken = await result.user.getIdToken();

      // 3. Send the token to your Node.js backend
      const res = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (data && data.status === 'ok') {
        // Store your BACKEND's JWT token for authenticated requests
        localStorage.setItem('token', data.token);
        alert(`Login Berhasil! Selamat datang ${data.user.name}`);
        router.push('/dashboard');
      } else {
        alert(data?.error || 'Google login gagal');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      // Handle "Popup closed" or other Firebase errors
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Terjadi kesalahan saat login Google.');
      }
    }
  };

  // --- REGULAR EMAIL/PASSWORD HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        alert('Login request failed: ' + res.status);
        return;
      }

      const data = await res.json();
      if (data && data.status === 'ok') {
        localStorage.setItem('token', data.token);
        alert(`Login Berhasil! Selamat datang ${data.role}`);
        router.push('/dashboard');
      } else {
        alert(data?.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Gagal menghubungi server:', error);
      alert('Terjadi kesalahan koneksi ke server.');
    }
  };

  return (
    <div className='login-container'>
      <div className="left-container">
        <div className="brand-container">
          <img src="/images/Cema_Logo.png" alt="logo" className="logo" onError={(e) => e.currentTarget.style.display='none'} />
          <h1 className="brand">Cema<span className="highlight">Design</span></h1>
        </div>
        <div className="left-content">
          <h2 className="h-content">Welcome Back!</h2>
          <p className="p-content">Explore the best design solutions for your project.</p>
        </div>
      </div>

      <div className="right-container">
        <div className="login-form">
          <p className="welcome-text">WELCOME BACK</p>
          <h2>Log In to your Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password</label>
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
                style={{ position: 'absolute', right: '10px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" style={{ width: 'auto' }} /> Remember me
              </label>
              <div className="forgot" style={{ cursor: 'pointer' }}>Forgot Password?</div>
            </div>

            <button type="submit" className="continue-btn">Continue</button>

            <div className="divider">Or</div>
            
            <div className="social-login">
              {/* UPDATED GOOGLE BUTTON */}
              <button 
                type="button" 
                className="google-btn" 
                onClick={handleGoogleLogin}
              >
                <img src="/images/google.png" alt="Google" onError={(e) => e.currentTarget.style.display='none'} /> 
                Log in with Google
              </button>

              <button type="button" className="facebook-btn">
                <img src="/images/facebook.png" alt="Facebook" onError={(e) => e.currentTarget.style.display='none'} /> 
                Log in with Facebook
              </button>
            </div>

            <p className="signup">
              New User? 
              <Link href="/register" className="signup-link" style={{ marginLeft: '5px' }}>
                SIGN UP HERE
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}