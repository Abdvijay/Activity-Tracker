import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="landing-container">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="glass-card fade-in p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-slate-800 tracking-tight">Welcome Back</h2>
              
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 font-medium">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                  <input 
                    type="text" 
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white/50" 
                    required 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 bg-white/50" 
                      required 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
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
                <button type="submit" className="premium-btn w-full mt-2">Login</button>
              </form>
              
              <div className="mt-8 text-center space-y-3">
                <div>
                  <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="text-sm text-slate-500">
                  Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
