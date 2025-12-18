'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import '../login/login.css';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '',telepon: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Registrasi Berhasil! Silakan Login.');
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', flexDirection: 'row' }}>
      <div className="left-container">
        <div className="brand-container">
          <img src="/images/Cema_Logo.png" alt="logo" className="logo" onError={(e) => e.currentTarget.style.display='none'} />
          <h1 className="brand">Cema<span className="highlight">Design</span></h1>
        </div>
        <div className="left-content">
          <h2 className="h-content">Lorem Ipsum</h2>
          <p className="p-content">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
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

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" style={{ width: 'auto' }} />
                Remember me
              </label>
            </div>

            <button type="submit" className="continue-btn">Continue</button>

            <div className="divider">Or</div>

            <div className="social-login">
                <button type="button" className="google-btn">
                <img src="/images/google.png" alt="G" onError={(e) => e.currentTarget.style.display='none'} /> Log in with Google
                </button>
                <button type="button" className="facebook-btn">
                <img src="/images/facebook.png" alt="F" onError={(e) => e.currentTarget.style.display='none'} /> Log in with Facebook
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