# Zomato Partner Admin Panel

A complete production-ready Restaurant Partner Admin Panel built with React, Vite, Redux Toolkit, and Bootstrap 5.

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + Redux Persist
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **UI Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons

## Features

- 🔐 Authentication (Login & Register)
- 📊 Dashboard with Analytics
- 🍕 Food Management (CRUD)
- 📦 Order Management
- 👤 Profile Management
- 🎨 Responsive Design
- 📱 Mobile-Friendly Sidebar
- 🔄 Redux State Management
- 💾 Persistent Authentication
- ⚡ Fast & Optimized

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── app/
│   └── store.js              # Redux store configuration
├── redux/
│   ├── auth/
│   │   ├── authSlice.js
│   │   └── authThunk.js
│   ├── food/
│   │   ├── foodSlice.js
│   │   └── foodThunk.js
│   ├── order/
│   │   ├── orderSlice.js
│   │   └── orderThunk.js
│   └── rootReducer.js
├── routes/
│   ├── ProtectedRoute.jsx
│   └── PublicRoute.jsx
├── layouts/
│   └── DashboardLayout.jsx
├── components/
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── Loader.jsx
│   ├── EmptyState.jsx
│   ├── FoodCard.jsx
│   └── OrderTable.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Foods.jsx
│   ├── AddFood.jsx
│   ├── EditFood.jsx
│   ├── Orders.jsx
│   └── Profile.jsx
├── styles/
│   ├── auth.css
│   ├── dashboard.css
│   ├── sidebar.css
│   └── forms.css
├── App.jsx
└── main.jsx
```

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd zomato-admin-panel
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## API Integration

### Base URL
```
https://zomato-clone-api-5e4m.onrender.com/api
```

### Authentication

All API requests automatically include JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

On 401 errors, the user is automatically logged out and redirected to login.

## Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/dashboard` - Dashboard with analytics
- `/foods` - Food management
- `/add-food` - Add new food
- `/edit-food/:id` - Edit food
- `/orders` - Order management
- `/profile` - Restaurant profile

## Redux Store Structure

```javascript
{
  auth: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false
  },
  food: {
    foods: [],
    loading: false,
    error: null,
    selectedFood: null
  },
  order: {
    orders: [],
    loading: false,
    error: null
  }
}
```

## Key Features

### Authentication
- User registration with image upload
- Email/password login
- JWT token persistence
- Auto logout on 401
- Protected routes

### Food Management
- View all foods
- Add new food items with image
- Edit existing foods
- Delete foods with confirmation
- Filter by category
- Search functionality

### Order Management
- View all orders
- Update order status
- Real-time status tracking
- Order details display

### Dashboard
- Total foods count
- Available foods count
- Pending orders count
- Delivered orders count
- Restaurant profile card
- Recent orders table

## Styling

The application uses Bootstrap 5 with custom CSS for:
- Authentication pages with gradient backgrounds
- Responsive dashboard layout
- Interactive sidebar with active state highlighting
- Card-based UI components
- Form validation styles
- Smooth transitions and hover effects

## Development

### Code Quality
- Functional components with hooks
- Clean architecture
- Modular code organization
- Reusable components
- ES6 imports/exports

### Performance Optimization
- Code splitting with React Router
- Image lazy loading
- Redux memoization
- State persistence

## Build

The application is optimized for production:
- Minified CSS and JavaScript
- Optimized assets
- Tree shaking
- Code chunking

## License

MIT License

## Support

For issues and feature requests, please contact the development team.
