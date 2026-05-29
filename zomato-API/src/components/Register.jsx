import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import Loader from './Loader';
import '../styles/auth.css';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%231a1a1a' rx='50'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23dc2626' opacity='0.6'/%3E%3Cellipse cx='50' cy='90' rx='32' ry='22' fill='%23dc2626' opacity='0.3'/%3E%3C/svg%3E";

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('phone', formData.phone);
    form.append('address', formData.address);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const result = await dispatch(registerUser(form));
      if (result.type === 'auth/registerUser/fulfilled') {
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  if (loading) return (
    <div className="auth-container">
      <Loader />
    </div>
  );

  return (
    <div className="auth-container">
      <div className="card auth-card" style={{ maxWidth: '520px' }}>
        <div className="card-body">
          
          <div className="auth-brand">
            <div className="auth-brand-icon">
              <i className="bi bi-bag-check-fill"></i>
            </div>
            <h1 className="mb-0">Zomato Partner</h1>
          </div>
          <p className="auth-subtitle">Register your restaurant</p>

          <div className="auth-divider"></div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-circle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Restaurant Name</label>
              <input
                id="reg-name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your restaurant name"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                id="reg-email"
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

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                id="reg-password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                id="reg-phone"
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Restaurant Address</label>
              <textarea
                id="reg-address"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full restaurant address"
                rows="2"
              ></textarea>
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Restaurant Logo / Image</label>
              <input
                id="reg-image"
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="form-control"
              />
              {preview && (
                <div className="mt-3 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="auth-preview-img"
                    style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <button
              id="reg-submit"
              type="submit"
              className="btn btn-primary w-100 mb-4"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Registering...</>
              ) : (
                <><i className="bi bi-shop me-2"></i>Register Restaurant</>
              )}
            </button>
          </form>

          <p className="text-center mb-0" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <a href="/login">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
}
