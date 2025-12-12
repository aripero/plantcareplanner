import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { LogIn, Leaf } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Suppress Cross-Origin-Opener-Policy warnings (browser security warnings, not actual errors)
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args[0]?.toString() || '';
        if (message.includes('Cross-Origin-Opener-Policy') || 
            message.includes('window.closed')) {
          return; // Suppress these specific warnings
        }
        originalConsoleError.apply(console, args);
      };
      
      await signInWithPopup(auth, googleProvider);
      
      // Restore original console.error
      console.error = originalConsoleError;
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Leaf className="login-icon" size={48} />
          <h1>PlantCarePlanner</h1>
          <p>Your automated plant care assistant</p>
        </div>
        
        <div className="login-content">
          <p className="login-description">
            Manage your plants with automated care schedules and reminders.
            Sign in with Google to get started.
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="google-sign-in-btn"
          >
            <LogIn size={20} />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
          
          <p className="login-note">
            Any user can sign in and access the app. No restrictions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

