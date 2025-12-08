'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // Opsional: untuk loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      
      // Simulasi sukses sementara (Hapus ini jika API sudah siap)
      console.log('Login Data:', formData);
      alert('Login dikirim ke server...'); 
      
      // Jika backend merespon bahwa user ini adalah admin:
      // router.push('/admin-dashboard');
      
      // Jika user biasa:
      router.push('/dashboard');

    } catch (error) {
      console.error('Login failed', error);
      alert('Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', flexDirection: 'row' }}>
      {/* --- KIRI (Branding) --- */}
      <div className="left-container">
        <div className="brand-container">
          <img 
            src="/Cema_Logo.png" 
            alt="logo" 
            className="logo" 
            onError={(e) => e.currentTarget.style.display='none'} 
          />
          <h1 className="brand">Cema<span className="highlight">Design</span></h1>
        </div>
        <div className="left-content">
          <h2 className="h-content">Welcome Back!</h2>
          <p className="p-content">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>
      </div>

      {/* --- KANAN (Form Login) --- */}
      <div className="right-container">
        <div className="login-form">
          
          <p className="welcome-text">WELCOME BACK</p>
          <h2>Log In to your Account</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
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
                <input type="checkbox" style={{ width: 'auto' }} />
                Remember me
              </label>
              <div className="forgot" style={{ cursor: 'pointer' }}>Forgot Password?</div>
            </div>

            <button type="submit" className="continue-btn" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Continue'}
            </button>

            {/* Social Login & Sign Up Link */}
            <div className="divider">Or</div>
            <div className="social-login">
              <button type="button" className="google-btn">
                <img src="/google.png" alt="G" onError={(e) => e.currentTarget.style.display='none'} /> Log in with Google
              </button>
              <button type="button" className="facebook-btn">
                <img src="/facebook.png" alt="F" onError={(e) => e.currentTarget.style.display='none'} /> Log in with Facebook
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