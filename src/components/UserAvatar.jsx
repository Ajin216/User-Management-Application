import React, { useState } from 'react';

export const UserAvatar = ({ src, name = '', size = 'md', className = '' }) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    }
    return (parts[0]?.[0] || 'U').toUpperCase();
  };

  const initials = getInitials(name);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-base',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 text-2xl',
  }[size] || 'w-10 h-10 text-xs';

  return (
    <div
      className={`relative shrink-0 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-100 via-indigo-50 to-purple-100 border border-slate-200/80 flex items-center justify-center font-bold text-indigo-700 shadow-2xs select-none ${sizeClasses} ${className}`}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
