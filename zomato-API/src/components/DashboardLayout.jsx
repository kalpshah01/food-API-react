import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}
