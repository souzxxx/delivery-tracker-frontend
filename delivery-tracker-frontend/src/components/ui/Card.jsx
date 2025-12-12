export default function Card({
  children,
  className = '',
  hover = false,
  glass = true,
  padding = true,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl
        ${glass ? 'glass' : 'bg-slate-800'}
        ${padding ? 'p-6' : ''}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

