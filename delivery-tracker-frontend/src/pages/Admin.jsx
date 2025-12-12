import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { Button, Card, StatusBadge, Loading } from '../components/ui';
import { formatDate, formatAddressShort, ORDER_STATUS } from '../utils/constants';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  MapPin,
  ArrowRight,
  Filter,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders(statusFilter);
      setOrders(data);
    } catch (err) {
      setError('Erro ao carregar pedidos');
      console.error(err);
    }
    setLoading(false);
  };

  // Stats
  const stats = {
    total: orders.length,
    created: orders.filter(o => o.status === 'created').length,
    in_transit: orders.filter(o => o.status === 'in_transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    canceled: orders.filter(o => o.status === 'canceled').length,
  };

  const statCards = [
    { key: null, label: 'Total', value: stats.total, icon: Package, color: 'bg-slate-500/20', textColor: 'text-slate-300' },
    { key: 'created', label: 'Criados', value: stats.created, icon: Clock, color: 'bg-blue-500/20', textColor: 'text-blue-400' },
    { key: 'in_transit', label: 'Em Trânsito', value: stats.in_transit, icon: Truck, color: 'bg-orange-500/20', textColor: 'text-orange-400' },
    { key: 'delivered', label: 'Entregues', value: stats.delivered, icon: CheckCircle, color: 'bg-green-500/20', textColor: 'text-green-400' },
    { key: 'canceled', label: 'Cancelados', value: stats.canceled, icon: XCircle, color: 'bg-red-500/20', textColor: 'text-red-400' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard Admin
            </h1>
            <p className="text-slate-400">
              Gerencie todos os pedidos do sistema
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isActive = statusFilter === stat.key;
          
          return (
            <button
              key={stat.label}
              onClick={() => setStatusFilter(stat.key)}
              className={`
                animate-fade-in text-left transition-all
                ${isActive ? 'ring-2 ring-orange-500' : ''}
              `}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card hover className={`${isActive ? 'bg-orange-500/10' : ''}`}>
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Filter Indicator */}
      {statusFilter && (
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Filtrando por:</span>
            <StatusBadge status={statusFilter} />
            <button
              onClick={() => setStatusFilter(null)}
              className="text-sm text-orange-400 hover:text-orange-300"
            >
              Limpar filtro
            </button>
          </div>
        </div>
      )}

      {error && (
        <Card className="mb-6 bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-center">{error}</p>
        </Card>
      )}

      {loading ? (
        <Loading message="Carregando pedidos..." />
      ) : (
        <>
          {/* Orders Table */}
          {orders.length > 0 ? (
            <Card padding={false} className="overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                        Origem
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                        Destino
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                        Criado em
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {orders.map((order, index) => (
                      <tr 
                        key={order.id}
                        className="hover:bg-slate-800/30 transition-colors animate-fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-white tracking-code">
                            {order.tracking_code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} size="sm" />
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span className="text-sm">{formatAddressShort(order.origin_address)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-4 h-4 text-green-400" />
                            <span className="text-sm">{formatAddressShort(order.destination_address)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-sm text-slate-400">
                            {formatDate(order.created_at)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-12">
              <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-slate-400">
                {statusFilter ? 'Nenhum pedido com este status' : 'Ainda não há pedidos no sistema'}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

