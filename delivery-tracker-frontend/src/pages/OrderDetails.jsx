import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { orderService, trackingService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, StatusBadge, Loading } from '../components/ui';
import { formatDate, formatAddress, ORDER_STATUS } from '../utils/constants';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  MapPin,
  Clock,
  Copy,
  Check,
  ArrowLeft,
  Edit,
  ExternalLink
} from 'lucide-react';

const eventIcons = {
  created: Package,
  in_transit: Truck,
  delivered: CheckCircle,
  canceled: XCircle,
};

const statusFlow = ['created', 'in_transit', 'delivered'];

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getById(id);
      setOrder(data);
      
      // Buscar eventos do histórico via endpoint de tracking
      if (data.tracking_code) {
        try {
          const trackingData = await trackingService.track(data.tracking_code);
          setEvents(trackingData.events || []);
        } catch (trackErr) {
          console.error('Erro ao carregar histórico:', trackErr);
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Pedido não encontrado');
      } else if (err.response?.status === 403) {
        setError('Você não tem permissão para ver este pedido');
      } else {
        setError('Erro ao carregar pedido');
      }
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!isAdmin) return; // Segurança extra no frontend
    
    setUpdating(true);
    try {
      const updated = await orderService.updateStatus(id, newStatus);
      setOrder(updated);
      
      // Recarregar eventos após atualização
      if (updated.tracking_code) {
        const trackingData = await trackingService.track(updated.tracking_code);
        setEvents(trackingData.events || []);
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
    setUpdating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(order?.tracking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getNextStatus = () => {
    const currentIndex = statusFlow.indexOf(order?.status);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return null;
    return statusFlow[currentIndex + 1];
  };

  if (loading) return <Loading message="Carregando detalhes do pedido..." />;

  if (error) {
    return (
      <Card className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">{error}</h2>
        <Link to="/orders">
          <Button variant="outline" icon={ArrowLeft} className="mt-4">
            Voltar para Meus Pedidos
          </Button>
        </Link>
      </Card>
    );
  }

  const nextStatus = getNextStatus();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/orders" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors animate-fade-in"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para Meus Pedidos
      </Link>

      {/* Header Card */}
      <Card className="mb-6 animate-fade-in delay-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-white tracking-code">
                {order.tracking_code}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                title="Copiar código"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>
            <StatusBadge status={order.status} size="lg" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to={`/track/${order.tracking_code}`}>
              <Button variant="outline" icon={ExternalLink}>
                Página de Rastreio
              </Button>
            </Link>
            
            {/* Apenas admin pode alterar status */}
            {isAdmin && order.status !== 'delivered' && order.status !== 'canceled' && (
              <>
                {nextStatus && (
                  <Button
                    onClick={() => handleStatusUpdate(nextStatus)}
                    loading={updating}
                    icon={eventIcons[nextStatus]}
                  >
                    {ORDER_STATUS[nextStatus].label}
                  </Button>
                )}
                
                {order.status !== 'canceled' && (
                  <Button
                    variant="danger"
                    onClick={() => handleStatusUpdate('canceled')}
                    loading={updating}
                    icon={XCircle}
                  >
                    Cancelar
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Addresses */}
        <div className="space-y-6">
          {/* Origin */}
          <Card className="animate-fade-in delay-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Origem</h3>
                <p className="text-sm text-slate-400">Endereço de coleta</p>
              </div>
            </div>
            <div className="pl-13">
              <p className="text-white">{formatAddress(order.origin_address)}</p>
              <p className="text-sm text-slate-400 mt-1">
                CEP: {order.origin_address.cep}
              </p>
              {order.origin_address.latitude && (
                <a 
                  href={`https://www.google.com/maps?q=${order.origin_address.latitude},${order.origin_address.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 mt-2"
                >
                  Ver no mapa <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </Card>

          {/* Destination */}
          <Card className="animate-fade-in delay-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Destino</h3>
                <p className="text-sm text-slate-400">Endereço de entrega</p>
              </div>
            </div>
            <div className="pl-13">
              <p className="text-white">{formatAddress(order.destination_address)}</p>
              <p className="text-sm text-slate-400 mt-1">
                CEP: {order.destination_address.cep}
              </p>
              {order.destination_address.latitude && (
                <a 
                  href={`https://www.google.com/maps?q=${order.destination_address.latitude},${order.destination_address.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300 mt-2"
                >
                  Ver no mapa <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="animate-fade-in delay-400">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-400" />
            Histórico
          </h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-slate-600 to-slate-700" />

            {/* Events */}
            <div className="space-y-6">
              {events.length > 0 ? events.map((event, index) => {
                const Icon = eventIcons[event.status] || Package;
                const isLatest = index === 0;
                
                return (
                  <div key={index} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`
                      relative z-10 w-12 h-12 rounded-xl flex items-center justify-center
                      ${isLatest 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30' 
                        : 'bg-slate-700 border border-slate-600'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isLatest ? 'text-white' : 'text-slate-400'}`} />
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-6 ${!isLatest && 'opacity-70'}`}>
                      <div className="flex flex-col gap-1 mb-1">
                        <span className={`font-semibold ${isLatest ? 'text-white' : 'text-slate-300'}`}>
                          {event.status_label}
                        </span>
                        <span className="text-sm text-slate-500">
                          {formatDate(event.created_at)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-slate-400 text-sm">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }) : (
                /* Fallback if no events */
                <div className="relative flex gap-4">
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Pedido criado</span>
                    <p className="text-sm text-slate-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Dates Footer */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Card className="text-center animate-fade-in delay-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Criado em</p>
          <p className="text-white font-medium">{formatDate(order.created_at)}</p>
        </Card>
        <Card className="text-center animate-fade-in delay-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Última atualização</p>
          <p className="text-white font-medium">{formatDate(order.updated_at)}</p>
        </Card>
      </div>
    </div>
  );
}

