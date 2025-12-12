import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Package, 
  Search, 
  Plus, 
  LogOut, 
  User, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = isAuthenticated ? [
    { to: '/orders', label: 'Meus Pedidos', icon: Package },
    { to: '/orders/new', label: 'Novo Pedido', icon: Plus },
    { to: '/track', label: 'Rastrear', icon: Search },
    ...(isAdmin ? [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }] : []),
  ] : [
    { to: '/track', label: 'Rastrear', icon: Search },
    { to: '/login', label: 'Entrar', icon: User },
  ];

  return (
    <nav className="glass border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Delivery</span>
              <span className="gradient-text">Tracker</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${isActive(to) 
                    ? 'bg-orange-500/20 text-orange-400' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            
            {isAuthenticated && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-700">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">
                    {isAdmin ? 'Administrador' : 'Usuário'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-700/50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${isActive(to) 
                      ? 'bg-orange-500/20 text-orange-400' 
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="my-2 border-t border-slate-700/50" />
                  <div className="px-4 py-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{user?.name}</p>
                      <p className="text-sm text-slate-400">
                        {isAdmin ? 'Administrador' : 'Usuário'}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

