import React from 'react';

export default function Heading({ children, size = 'xl', className = '' }) {
  const sizes = {
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '4xl': 'text-4xl',
  };

  return <h2 className={`${sizes[size]} font-bold text-dark-900 dark:text-white/80 ${className}`}>{children}</h2>;
};
