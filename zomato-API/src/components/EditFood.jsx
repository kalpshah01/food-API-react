import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateFood } from '../redux/foodSlice';
import DashboardLayout from './DashboardLayout';
import EmptyState from './EmptyState';
import '../styles/forms.css';

const FOOD_CATEGORIES = [

  'Chinese',
  'Dessert',
  'Starter',
  'Main Course',
  'Salad',
  'Soup',
  'Pasta',
  'South Indian',
  'North Indian',
];

const API_BASE = 'https://zomato-clone-api-5e4m.onrender.com';

function resolveImageUrl(img) {
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return `${API_BASE}${img}`;
  return img;
}

const FOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'%3E%3Crect width='300' height='220' fill='%231a1a1a'/%3E%3Ctext x='150' y='120' font-family='Arial' font-size='48' fill='%23d4a017' opacity='0.3' text-anchor='middle'%3E%F0%9F%8D%BD%3C/text%3E%3C/svg%3E";

export default function EditFood() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { foods } = useSelector((state) => state.food);
  const food = foods.find((f) => f._id === id);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    availability: true,
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (food) {
      setFormData({
        title: food.title || '',
        price: food.price || '',
        category: food.category || '',
        description: food.description || '',
        availability: food.availability !== false,
        image: null,
      });
      setPreview(resolveImageUrl(food.image));
    }
  }, [food]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Enter a valid price';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
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
    setSubmitting(true);
    const form = new FormData();
    form.append('title', formData.title.trim());
    form.append('price', formData.price);
    form.append('category', formData.category);
    form.append('description', formData.description.trim());
    form.append('isAvailable', formData.availability);
    if (formData.image) form.append('image', formData.image);

    try {
      const result = await dispatch(updateFood({ id, formData: form, availability: formData.availability }));
      if (result.type === 'food/updateFood/fulfilled') {
        setSuccessMsg('Food updated successfully!');
        setTimeout(() => navigate('/foods'), 1200);
      } else {
        setErrors({ submit: result.payload || 'Failed to update food. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Unexpected error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!food) return (
    <DashboardLayout>
      <EmptyState message="Food not found. Go back and try again." icon="exclamation-circle" />
    </DashboardLayout>
  );

  const isAvailable = formData.availability;

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2>
            <i className="bi bi-pencil-fill"></i> Edit Food
          </h2>
          <a href="/foods" className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Back to Foods
          </a>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-check-circle-fill"></i>
            {successMsg} Redirecting...
          </div>
        )}

        {errors.submit && (
          <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-exclamation-circle-fill"></i>
            {errors.submit}
          </div>
        )}

        <div className="card">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-4">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">Food Title *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Chicken Biryani"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-5 mb-3">
                      <label className="form-label">Price (₹) *</label>
                      <input
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="1"
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                    <div className="col-md-7 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Category --</option>
                        {FOOD_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Describe your food item"
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label d-block">Availability</label>
                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, availability: !prev.availability }))}
                      style={{
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        border: isAvailable ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(220,38,38,0.4)',
                        background: isAvailable ? 'rgba(16,185,129,0.08)' : 'rgba(220,38,38,0.08)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '52px',
                          height: '28px',
                          background: isAvailable
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #dc2626, #b91c1c)',
                          borderRadius: '14px',
                          border: isAvailable
                            ? '1px solid rgba(16,185,129,0.4)'
                            : '1px solid rgba(220,38,38,0.4)',
                          transition: 'all 0.3s ease',
                          boxShadow: isAvailable
                            ? '0 0 12px rgba(16,185,129,0.3)'
                            : '0 0 12px rgba(220,38,38,0.3)',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: isAvailable ? '27px' : '3px',
                            width: '20px',
                            height: '20px',
                            background: '#fff',
                            borderRadius: '50%',
                            transition: 'left 0.3s ease',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: isAvailable ? '#10b981' : '#ef4444',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {isAvailable ? (
                          <><i className="bi bi-check-circle-fill me-1"></i>Available</>
                        ) : (
                          <><i className="bi bi-x-circle-fill me-1"></i>Unavailable</>
                        )}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '6px', color: isAvailable ? '#6b7280' : '#ef4444' }}>
                      {isAvailable ? 'This item is visible to customers' : 'This item is hidden from customers'}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Food Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="form-control mb-3"
                  />
                  <div className="img-preview-wrapper">
                    <img
                      src={preview || FOOD_PLACEHOLDER}
                      alt="Preview"
                      style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.src = FOOD_PLACEHOLDER; }}
                    />
                  </div>
                  {preview && preview !== FOOD_PLACEHOLDER && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '6px', textAlign: 'center' }}>
                      {formData.image ? '📎 New image selected' : '🌐 Current saved image'}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</>
                  ) : (
                    <><i className="bi bi-check-circle me-2"></i>Save Changes</>
                  )}
                </button>
                <a href="/foods" className="btn btn-secondary ms-auto">
                  <i className="bi bi-x me-1"></i> Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
