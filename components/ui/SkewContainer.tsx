import React from 'react';

interface SkewContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  as?: React.ElementType;
  hoverEffect?: boolean;
  onClick?: () => void;
  noUnskew?: boolean; // Sometimes we want the content to be skewed (e.g. abstract shapes)
}

const SkewContainer: React.FC<SkewContainerProps> = ({
  children,
  className = '',
  variant = 'outline',
  as: Component = 'div',
  hoverEffect = false,
  onClick,
  noUnskew = false,
}) => {
  
  // Base styles
  const baseStyles = "relative transform -skew-x-12 transition-all duration-300 ease-out";
  
  // Variant styles
  const variants = {
    primary: "bg-[#FF5F1F] text-white border-2 border-[#FF5F1F]",
    secondary: "bg-[#B0B0B0] text-[#1a1a1a] border-2 border-[#B0B0B0]",
    outline: "bg-transparent border-2 border-[#FF5F1F] text-[#FF5F1F]",
    ghost: "bg-transparent border-2 border-[#333] text-[#B0B0B0]",
    glass: "bg-[#1a1a1a]/80 border border-[#333] backdrop-blur-sm",
  };

  // Hover styles
  const hoverStyles = hoverEffect 
    ? "hover:bg-[#FF5F1F] hover:border-[#FF5F1F] hover:text-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,95,31,0.4)] cursor-pointer" 
    : "";

  return (
    <Component 
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {/* 
        The inner container skews back (12deg) to neutralize the parent skew.
        This ensures text/images remain upright while the container shape is angled.
      */}
      <div className={`${!noUnskew ? 'transform skew-x-12' : ''} h-full w-full`}>
        {children}
      </div>
    </Component>
  );
};

export default SkewContainer;
