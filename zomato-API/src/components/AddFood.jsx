import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addFood } from '../redux/foodSlice';
import DashboardLayout from './DashboardLayout';
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

const EMPTY_FORM = {
  title: '',
  price: '',
  category: '',
  description: '',
  image: null,
};



export default function AddFood() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

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

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setPreview(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
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
    if (formData.image) form.append('image', formData.image);

    try {
      const result = await dispatch(addFood(form));
      if (result.type === 'food/addFood/fulfilled') {
        const addedTitle = formData.title;
        resetForm();
        setSuccessMsg(`"${addedTitle}" added! You can add another food below.`);
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrors({ submit: result.payload || 'Failed to add food. Please try again.' });
      }
    } catch {
      setErrors({ submit: 'Unexpected error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2><i className="bi bi-plus-circle-fill"></i> Add New Food</h2>
          <a href="/foods" className="btn btn-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i> Back to Foods
          </a>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
            <i className="bi bi-check-circle-fill"></i>
            <strong>{successMsg}</strong>
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
                      id="food-title"
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
                        id="food-price"
                        type="number"
                        className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0"
                        min="1"
                      />
                      {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    <div className="col-md-7 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        id="food-category"
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
                      id="food-description"
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your food item"
                      rows="5"
                    ></textarea>
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                  </div>
                </div>

                
                <div className="col-md-4">
                  <label className="form-label">Food Image</label>
                  <input
                    id="food-image"
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
                    />
                  </div>
                  {preview && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm w-100 mt-2"
                      onClick={() => {
                        setPreview(null);
                        setFormData((p) => ({ ...p, image: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <i className="bi bi-x-circle me-1"></i>Remove Image
                    </button>
                  )}
                </div>
              </div>

              <div className="d-flex gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                <button id="food-submit" type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Adding...</>
                  ) : (
                    <><i className="bi bi-plus-circle me-2"></i>Add Food</>
                  )}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm} disabled={submitting}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i>Reset
                </button>
                <a href="/foods" className="btn btn-secondary ms-auto">
                  <i className="bi bi-x me-1"></i>Cancel
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
