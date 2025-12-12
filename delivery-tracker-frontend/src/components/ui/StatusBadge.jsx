import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { ORDER_STATUS } from '../../utils/constants';

const iconMap = {
  Package,
  Truck,
  CheckCircle,
  XCircle,
};

export default function StatusBadge({ status, showIcon = true, size = 'md' }) {
  const statusInfo = ORDER_STATUS[status] || ORDER_STATUS.created;
  const Icon = iconMap[statusInfo.icon];
  
  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${statusInfo.color}
      ${sizes[size]}
    `}>
      {showIcon && Icon && <Icon className={iconSizes[size]} />}
      {statusInfo.label}
    </span>
  );
}

