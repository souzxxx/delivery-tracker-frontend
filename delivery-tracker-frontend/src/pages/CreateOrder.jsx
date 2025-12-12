import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import { Button, Input, Card } from '../components/ui';
import { 
  MapPin, 
  Package, 
  ArrowRight, 
  Home,
  Building,
  Hash,
  FileText,
  Check
} from 'lucide-react';

export default function CreateOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  
  const [origin, setOrigin] = useState({
    cep: '',
    number: '',
    complement: '',
  });
  
  const [destination, setDestination] = useState({
    cep: '',
    number: '',
    complement: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validação básica
    if (!origin.cep || !origin.number) {
      setError('Preencha o CEP e número da origem');
      setLoading(false);
      return;
    }
    
    if (!destination.cep || !destination.number) {
      setError('Preencha o CEP e número do destino');
      setLoading(false);
      return;
    }
    
    try {
      const orderData = {
        origin_address: {
          cep: origin.cep.replace(/\D/g, ''),
          number: origin.number,
          complement: origin.complement || null,
        },
        destination_address: {
          cep: destination.cep.replace(/\D/g, ''),
          number: destination.number,
          complement: destination.complement || null,
        },
      };
      
      const newOrder = await orderService.create(orderData);
      setSuccess(newOrder);
    } catch (err) {
      const message = err.response?.data?.detail || 'Erro ao criar pedido';
      setError(message);
    }
    
    setLoading(false);
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  // Success Screen
  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl shadow-green-500/30 mb-6 animate-pulse-glow">
            <Check className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Pedido Criado!
          </h1>
          <p className="text-slate-400 mb-6">
            Seu pedido foi registrado com sucesso
          </p>
          
          <div className="inline-block px-6 py-4 bg-slate-800/50 rounded-xl mb-8">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              Código de Rastreio
            </p>
            <p className="text-2xl font-bold text-orange-400 tracking-code">
              {success.tracking_code}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/orders/${success.id}`)}
            >
              Ver Detalhes
            </Button>
            <Button onClick={() => navigate('/orders')}>
              Meus Pedidos
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl shadow-orange-500/30 mb-6 animate-float">
          <Package className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          Criar Novo Pedido
        </h1>
        <p className="text-slate-400 text-lg">
          Preencha os endereços de origem e destino
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Card className="mb-6 bg-red-500/10 border border-red-500/30 animate-fade-in">
            <p className="text-red-400 text-center">{error}</p>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Origin */}
          <Card className="animate-fade-in delay-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Origem</h2>
                <p className="text-sm text-slate-400">De onde sai a entrega</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                label="CEP"
                placeholder="00000-000"
                value={origin.cep}
                onChange={(e) => setOrigin({ ...origin, cep: formatCEP(e.target.value) })}
                icon={Home}
                maxLength={9}
                required
              />
              <Input
                label="Número"
                placeholder="123"
                value={origin.number}
                onChange={(e) => setOrigin({ ...origin, number: e.target.value })}
                icon={Hash}
                required
              />
              <Input
                label="Complemento (opcional)"
                placeholder="Apto, Bloco, Sala..."
                value={origin.complement}
                onChange={(e) => setOrigin({ ...origin, complement: e.target.value })}
                icon={FileText}
              />
            </div>
          </Card>

          {/* Destination */}
          <Card className="animate-fade-in delay-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Destino</h2>
                <p className="text-sm text-slate-400">Para onde vai a entrega</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Input
                label="CEP"
                placeholder="00000-000"
                value={destination.cep}
                onChange={(e) => setDestination({ ...destination, cep: formatCEP(e.target.value) })}
                icon={Building}
                maxLength={9}
                required
              />
              <Input
                label="Número"
                placeholder="456"
                value={destination.number}
                onChange={(e) => setDestination({ ...destination, number: e.target.value })}
                icon={Hash}
                required
              />
              <Input
                label="Complemento (opcional)"
                placeholder="Apto, Bloco, Sala..."
                value={destination.complement}
                onChange={(e) => setDestination({ ...destination, complement: e.target.value })}
                icon={FileText}
              />
            </div>
          </Card>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-center animate-fade-in delay-300">
          <Button type="submit" loading={loading} size="lg">
            Criar Pedido
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

