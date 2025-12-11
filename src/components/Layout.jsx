import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Flower2, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut,
  Leaf
} from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/plants', icon: Database, label: 'Plant Database' },
    { path: '/my-plants', icon: Flower2, label: 'My Plants' },
    { path: '/calendar', icon: CalendarIcon, label: 'Calendar' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Leaf size={28} />
            <span>PlantCarePlanner</span>
          </div>
          <nav className="nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <button onClick={handleSignOut} className="sign-out-btn">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;

