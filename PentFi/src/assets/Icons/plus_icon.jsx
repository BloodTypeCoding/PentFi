import React from 'react';

const PlusIcon = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ color: '#FFFFFF' }} // Completamente blanco por defecto
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
};

export default PlusIcon;