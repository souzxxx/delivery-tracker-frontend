import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Package, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/orders';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl shadow-orange-500/30 mb-6 animate-float">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-slate-400">
            Entre na sua conta para gerenciar suas entregas
          </p>
        </div>

        {/* Form Card */}
        <Card className="animate-fade-in delay-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-fade-in">
                {error}
              </div>
            )}

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              Entrar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 animate-fade-in delay-200 bg-slate-800/30">
          <p className="text-xs text-slate-500 text-center mb-2">Credenciais de teste:</p>
          <div className="flex justify-center gap-4 text-xs">
            <code className="px-2 py-1 bg-slate-700/50 rounded text-slate-400 tracking-code">
              admin@delivery.com
            </code>
            <code className="px-2 py-1 bg-slate-700/50 rounded text-slate-400 tracking-code">
              admin123
            </code>
          </div>
        </Card>
      </div>
    </div>
  );
}

