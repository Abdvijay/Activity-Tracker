import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({ username: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      const res = await api.post('/api/auth/reset-password/', {
        username: formData.username,
        new_password: formData.newPassword
      });
      setMessage(res.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
      setMessage('');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="landing-container">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="glass-card fade-in p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-slate-800 tracking-tight">Reset Password</h2>
              <p className="text-slate-500 text-center mb-6 text-sm">Enter your username and your new password.</p>
              
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium">{error}</div>}
              {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-6 font-medium">{message}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white/50" 
                    name="username" required onChange={handleChange} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white/50" 
                      name="newPassword" required onChange={handleChange} 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}  
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white/50" 
                      name="confirmPassword" required onChange={handleChange} 
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="premium-btn w-full mt-4">Reset Password</button>
              </form>
              
              <div className="mt-8 text-center text-sm text-slate-500">
                Remembered your password? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
