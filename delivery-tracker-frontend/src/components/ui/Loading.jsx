import { Package } from 'lucide-react';

export default function Loading({ message = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-16 h-16 spinner" />
        <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" />
      </div>
      <p className="text-slate-400 animate-pulse">{message}</p>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Loading />
    </div>
  );
}

