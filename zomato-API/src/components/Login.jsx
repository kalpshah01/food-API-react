import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import Loader from './Loader';
import '../styles/auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const result = await dispatch(loginUser(formData));
      if (result.type === 'auth/loginUser/fulfilled') {
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  if (loading) return (
    <div className="auth-container">
      <Loader />
    </div>
  );

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="card-body">
          
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <i className="bi bi-bag-check-fill"></i>
            </div>
            <h1 className="mb-0">Zomato Partner</h1>
          </div>
          <p className="auth-subtitle">Sign in to your admin dashboard</p>

          <div className="auth-divider"></div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-circle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                autoComplete="email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary w-100 mb-4"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
              )}
            </button>
          </form>

          <p className="text-center mb-0" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Don&apos;t have an account?{' '}
            <a href="/register">Register your restaurant</a>
          </p>
        </div>
      </div>
    </div>
  );
}
