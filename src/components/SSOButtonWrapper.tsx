import React from 'react';

interface SSOButtonWrapperProps {
  onClick: (e: React.MouseEvent) => void;
  icon: string;
  text: string;
  dataCy?: string;
}

const SSOButtonWrapper: React.FC<SSOButtonWrapperProps> = ({ onClick, icon, text, dataCy }) => {
  return (
    <button
      className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      onClick={onClick}
      data-cy={dataCy}
    >
      <img src={icon} alt="" className="w-5 h-5" />
      <span className="text-gray-700">{text}</span>
    </button>
  );
};

export default SSOButtonWrapper; 
