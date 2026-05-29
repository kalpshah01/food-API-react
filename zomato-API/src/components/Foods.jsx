import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../redux/foodSlice';
import DashboardLayout from './DashboardLayout';
import FoodCard from './FoodCard';
import EmptyState from './EmptyState';
import Loader from './Loader';
import '../styles/forms.css';



const FOOD_CATEGORIES = [
  'Pizza',
  'Burger',
  'Chinese',
  'Dessert',
  'Starter',
  'Main Course',
  'South Indian',
  'North Indian',
  'Other',
];

export default function Foods() {
  const dispatch = useDispatch();
  const { foods, loading } = useSelector((state) => state.food);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const safeFoods = Array.isArray(foods) ? foods : [];

  const filteredFoods = safeFoods.filter((food) => {
    const matchesSearch = food.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2>
            <i className="bi bi-cup-hot-fill"></i> Foods
            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 400, marginLeft: '10px' }}>
              ({safeFoods.length} total)
            </span>
          </h2>
          <a href="/add-food" className="btn btn-primary">
            <i className="bi bi-plus-circle-fill me-2"></i>Add Food
          </a>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-7">
                <div className="input-group" style={{ background: 'transparent' }}>
                  <span
                    className="input-group-text"
                    style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', color: '#d4a017', borderRadius: '9px 0 0 9px' }}
                  >
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderLeft: 'none', borderRadius: '0 9px 9px 0' }}
                    placeholder="Search foods by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {FOOD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        
        {filteredFoods.length > 0 ? (
          <div className="row g-3">
            {filteredFoods.map((food) => (
              <div key={food._id} className="col-sm-6 col-lg-4 col-xl-3">
                <FoodCard food={food} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message={searchTerm ? `No foods matching "${searchTerm}"` : 'No foods added yet'}
            icon="cup-hot"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
