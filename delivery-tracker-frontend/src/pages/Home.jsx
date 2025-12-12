import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card } from '../components/ui';
import { 
  Package, 
  Search, 
  Truck, 
  Shield, 
  Zap, 
  MapPin,
  ArrowRight,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Zap,
      title: 'Rápido e Simples',
      description: 'Crie pedidos em segundos com apenas o CEP e número',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: MapPin,
      title: 'Rastreamento em Tempo Real',
      description: 'Acompanhe cada etapa da sua entrega com precisão',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: 'Seguro e Confiável',
      description: 'Seus dados protegidos com criptografia de ponta',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Globe,
      title: 'Acesse de Qualquer Lugar',
      description: 'Sistema responsivo para web e dispositivos móveis',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const steps = [
    { number: '01', title: 'Crie sua conta', description: 'Cadastre-se gratuitamente em menos de 1 minuto' },
    { number: '02', title: 'Registre o pedido', description: 'Informe origem e destino da entrega' },
    { number: '03', title: 'Acompanhe', description: 'Receba atualizações em tempo real' },
  ];

  return (
    <div className="min-h-[80vh]">
      {/* Hero Section */}
      <section className="text-center py-16 lg:py-24 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/30 mb-8">
          <Truck className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-400 font-medium">Sistema de Rastreamento Inteligente</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Rastreie suas entregas
          <br />
          <span className="gradient-text">com facilidade</span>
        </h1>
        
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          O DeliveryTracker oferece uma maneira simples e eficiente de gerenciar
          e acompanhar todas as suas entregas em um só lugar.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/orders/new">
                <Button size="lg" className="min-w-[200px]">
                  <Package className="w-5 h-5" />
                  Novo Pedido
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Meus Pedidos
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="min-w-[200px]">
                  Começar Agora
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/track">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  <Search className="w-5 h-5" />
                  Rastrear Pedido
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Quick Track */}
      <section className="py-12 animate-fade-in delay-100">
        <Card className="max-w-2xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5" />
          <div className="relative text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Tem um código de rastreio?
            </h2>
            <p className="text-slate-400 mb-6">
              Consulte o status da sua entrega agora mesmo
            </p>
            <Link to="/track">
              <Button icon={Search}>
                Rastrear Pedido
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="text-center mb-12 animate-fade-in delay-200">
          <h2 className="text-3xl font-bold text-white mb-4">
            Por que escolher o DeliveryTracker?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Desenvolvido para simplificar a gestão de entregas com tecnologia moderna
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                hover 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className={`
                  w-14 h-14 mx-auto mb-4 rounded-2xl 
                  bg-gradient-to-br ${feature.color}
                  flex items-center justify-center
                  shadow-lg
                `}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">
            Como funciona?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Três passos simples para começar a rastrear suas entregas
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative inline-block mb-6">
                <span className="text-7xl font-bold text-slate-800">
                  {step.number}
                </span>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 animate-fade-in">
          <Card className="text-center py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-purple-500/10" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl shadow-orange-500/30 mb-6 animate-float">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Pronto para começar?
              </h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Crie sua conta gratuita e comece a rastrear suas entregas hoje mesmo
              </p>
              <Link to="/register">
                <Button size="lg">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}

