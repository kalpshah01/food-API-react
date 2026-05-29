import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteFood } from '../redux/foodSlice';
import { useState } from 'react';
import { resolveImageUrl } from '../utils/imageUtils';

const FOOD_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%231a1a1a'/%3E%3Ccircle cx='150' cy='85' r='38' fill='%23252525'/%3E%3Ctext x='150' y='98' font-family='Arial' font-size='32' fill='%23d4a017' opacity='0.4' text-anchor='middle'%3E%F0%9F%8D%BD%3C/text%3E%3Ctext x='150' y='145' font-family='Arial' font-size='11' fill='%234b5563' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function FoodCard({ food }) {
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  
  const rawImg = food.image || food.imageUrl || food.img || null;
  const resolvedImg = resolveImageUrl(rawImg);
  const [imgSrc, setImgSrc] = useState(resolvedImg || FOOD_PLACEHOLDER);

  const handleDelete = async () => {
    if (showConfirm) {
      await dispatch(deleteFood(food._id));
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="card h-100" style={{ overflow: 'hidden' }}>
      
      <div className="food-img-wrapper">
        <img
          src={imgSrc}
          alt={food.title}
          onError={() => setImgSrc(FOOD_PLACEHOLDER)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>


      <div className="card-body food-card-body d-flex flex-column">
        <h5 className="food-title">{food.title}</h5>
        <p className="food-desc mb-3">{food.description || 'No description provided.'}</p>

        <div className="d-flex align-items-center gap-2 mb-3 mt-auto flex-wrap">
          <span className="badge-price">₹{food.price}</span>
          {food.category && <span className="badge-category">{food.category}</span>}
          <span
            className={`badge ms-auto ${food.availability !== false ? 'badge-available' : 'badge-unavailable'}`}
          >
            {food.availability !== false ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="d-flex gap-2">
          <Link to={`/edit-food/${food._id}`} className="btn btn-primary btn-sm flex-grow-1">
            <i className="bi bi-pencil me-1"></i>Edit
          </Link>
          <button
            className={`btn btn-sm flex-grow-1 ${showConfirm ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={handleDelete}
          >
            {showConfirm ? (
              <><i className="bi bi-check-lg me-1"></i>Confirm</>
            ) : (
              <><i className="bi bi-trash me-1"></i>Delete</>
            )}
          </button>
        </div>

        {showConfirm && (
          <button
            className="btn btn-sm btn-secondary w-100 mt-2"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
