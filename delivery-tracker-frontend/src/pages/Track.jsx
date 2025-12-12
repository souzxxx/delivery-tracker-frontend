import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackingService } from '../services/api';
import { Button, Input, Card, StatusBadge, Loading } from '../components/ui';
import { formatDate, formatAddressShort } from '../utils/constants';
import { 
  Search, 
  MapPin, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';

const eventIcons = {
  created: Package,
  in_transit: Truck,
  delivered: CheckCircle,
  canceled: XCircle,
};

export default function Track() {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [trackingCode, setTrackingCode] = useState(code || '');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (code) {
      handleTrack(code);
    }
  }, [code]);

  const handleTrack = async (codeToTrack = trackingCode) => {
    if (!codeToTrack.trim()) {
      setError('Digite um código de rastreio');
      return;
    }
    
    setError('');
    setLoading(true);
    setTrackingData(null);
    
    try {
      const data = await trackingService.track(codeToTrack.trim());
      setTrackingData(data);
      
      // Atualizar URL sem recarregar
      if (!code || code !== codeToTrack) {
        navigate(`/track/${codeToTrack}`, { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Código de rastreio não encontrado');
      } else {
        setError('Erro ao buscar rastreio. Tente novamente.');
      }
    }
    
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingData?.tracking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl shadow-blue-500/30 mb-6 animate-float">
          <Search className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          Rastrear Pedido
        </h1>
        <p className="text-slate-400 text-lg">
          Acompanhe sua entrega em tempo real
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8 animate-fade-in delay-100">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Digite o código de rastreio (ex: DT-A1B2C3D4)"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
              icon={Package}
              className="tracking-code text-lg"
            />
          </div>
          <Button type="submit" loading={loading} size="lg">
            Rastrear
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center animate-fade-in">
            {error}
          </div>
        )}
      </Card>

      {/* Loading */}
      {loading && <Loading message="Buscando informações..." />}

      {/* Tracking Result */}
      {trackingData && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Status Card */}
          <Card className="relative overflow-hidden">
            {/* Background gradient based on status */}
            <div className={`absolute inset-0 opacity-5 ${
              trackingData.status === 'delivered' ? 'bg-green-500' :
              trackingData.status === 'in_transit' ? 'bg-orange-500' :
              trackingData.status === 'canceled' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            
            <div className="relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Código de Rastreio</p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white tracking-code">
                      {trackingData.tracking_code}
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
                </div>
                <StatusBadge status={trackingData.status} size="lg" />
              </div>

              {/* Route Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Origem</p>
                  <p className="text-white font-medium flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    {formatAddressShort(trackingData.origin)}
                  </p>
                </div>
                
                <div className="hidden sm:flex items-center px-4">
                  <div className="w-20 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 rounded-full" />
                  <Truck className="w-6 h-6 text-orange-400 mx-2 animate-pulse" />
                  <div className="w-20 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 rounded-full" />
                </div>
                
                <div className="flex-1 text-center sm:text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Destino</p>
                  <p className="text-white font-medium flex items-center justify-center sm:justify-end gap-2">
                    <MapPin className="w-4 h-4 text-green-400" />
                    {formatAddressShort(trackingData.destination)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Histórico de Eventos
            </h3>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-slate-600 to-slate-700" />

              {/* Events */}
              <div className="space-y-6">
                {trackingData.events.map((event, index) => {
                  const Icon = eventIcons[event.status] || Package;
                  const isLatest = index === 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative flex gap-4 animate-fade-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
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
                })}
              </div>
            </div>
          </Card>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Criado em</p>
              <p className="text-white font-medium">{formatDate(trackingData.created_at)}</p>
            </Card>
            <Card className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Atualizado em</p>
              <p className="text-white font-medium">{formatDate(trackingData.updated_at)}</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

