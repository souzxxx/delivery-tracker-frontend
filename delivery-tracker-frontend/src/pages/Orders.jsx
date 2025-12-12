import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { Button, Card, StatusBadge, Loading } from '../components/ui';
import { formatDate, formatAddressShort } from '../utils/constants';
import { 
  Package, 
  Plus, 
  MapPin, 
  ArrowRight, 
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError('Erro ao carregar pedidos');
      console.error(err);
    }
    setLoading(false);
  };

  const filteredOrders = orders.filter(order =>
    order.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.destination_address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading message="Carregando seus pedidos..." />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Meus Pedidos
          </h1>
          <p className="text-slate-400">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} encontrados
          </p>
        </div>
        <Link to="/orders/new">
          <Button icon={Plus} size="lg">
            Novo Pedido
          </Button>
        </Link>
      </div>

      {/* Search */}
      {orders.length > 0 && (
        <Card className="mb-6 animate-fade-in delay-100">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>
        </Card>
      )}

      {error && (
        <Card className="mb-6 bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-center">{error}</p>
        </Card>
      )}

      {/* Empty State */}
      {orders.length === 0 && !error && (
        <Card className="text-center py-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700/50 rounded-2xl mb-6">
            <Package className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nenhum pedido ainda
          </h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            Você ainda não criou nenhum pedido. Comece agora mesmo a rastrear suas entregas!
          </p>
          <Link to="/orders/new">
            <Button icon={Plus}>
              Criar Primeiro Pedido
            </Button>
          </Link>
        </Card>
      )}

      {/* Orders List */}
      {filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <Link 
              key={order.id} 
              to={`/orders/${order.id}`}
              className="block animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card hover className="group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-white tracking-code">
                        {order.tracking_code}
                      </span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>
                    
                    {/* Route */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span>{formatAddressShort(order.origin_address)}</span>
                      </div>
                      <ArrowRight className="hidden sm:block w-4 h-4 text-slate-600" />
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <span>{formatAddressShort(order.destination_address)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date & Arrow */}
                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase">Criado em</p>
                      <p className="text-sm text-slate-300">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 group-hover:bg-orange-500 flex items-center justify-center transition-all">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {orders.length > 0 && filteredOrders.length === 0 && (
        <Card className="text-center py-12">
          <Filter className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-slate-400">
            Tente buscar por outro termo
          </p>
        </Card>
      )}
    </div>
  );
}

