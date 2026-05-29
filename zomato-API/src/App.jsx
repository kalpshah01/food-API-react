import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate as RouterNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe } from './redux/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Foods from './components/Foods';
import AddFood from './components/AddFood';
import EditFood from './components/EditFood';
import Orders from './components/Orders';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      dispatch(fetchAuthMe());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/foods"
          element={
            <ProtectedRoute>
              <Foods />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-food"
          element={
            <ProtectedRoute>
              <AddFood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-food/:id"
          element={
            <ProtectedRoute>
              <EditFood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<RouterNavigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
