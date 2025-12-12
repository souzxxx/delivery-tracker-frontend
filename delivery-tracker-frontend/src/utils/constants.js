// Status do pedido
export const ORDER_STATUS = {
  created: {
    label: 'Pedido criado',
    color: 'status-created',
    icon: 'Package',
  },
  in_transit: {
    label: 'Saiu para entrega',
    color: 'status-in_transit',
    icon: 'Truck',
  },
  delivered: {
    label: 'Entregue',
    color: 'status-delivered',
    icon: 'CheckCircle',
  },
  canceled: {
    label: 'Cancelado',
    color: 'status-canceled',
    icon: 'XCircle',
  },
};

// Formatar data
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Formatar data curta
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
};

// Formatar endereço
export const formatAddress = (address) => {
  if (!address) return '';
  const parts = [
    address.street,
    address.number,
    address.complement,
    address.city,
    address.state,
  ].filter(Boolean);
  return parts.join(', ');
};

// Formatar endereço curto (cidade/estado)
export const formatAddressShort = (address) => {
  if (!address) return '';
  return `${address.city}/${address.state}`;
};

