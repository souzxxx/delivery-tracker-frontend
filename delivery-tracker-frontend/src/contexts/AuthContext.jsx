import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await userService.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Erro ao carregar usuário:', err);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const { access_token } = await authService.login(email, password);
      localStorage.setItem('access_token', access_token);
      
      const userData = await userService.getMe();
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Erro ao fazer login';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      await userService.register({ name, email, password });
      // Fazer login automaticamente após cadastro
      return await login(email, password);
    } catch (err) {
      const message = err.response?.data?.detail || 'Erro ao criar conta';
      setError(message);
      return { success: false, error: message };
    }
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAdmin,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

