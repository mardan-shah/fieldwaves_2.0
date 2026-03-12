import React from 'react';

interface SkewContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  as?: React.ElementType;
  hoverEffect?: boolean;
  onClick?: () => void;
  noSkewMobile?: boolean; // Cards/grids: square on mobile, skewed on desktop
}

const SkewContainer: React.FC<SkewContainerProps> = ({
  children,
  className = '',
  variant = 'outline',
  as: Component = 'div',
  hoverEffect = false,
  onClick,
  noSkewMobile = false,
}) => {

  // Simple skew logic - reverting to original
  const skewStyles = noSkewMobile
    ? "relative transform md:-skew-x-12 transition-all duration-200 ease-out"
    : "relative transform skew-x-0 sm:-skew-x-6 md:-skew-x-12 transition-all duration-200 ease-out";

  // Variant styles
  const variants = {
    primary: "bg-primary text-primary-foreground border-2 border-primary",
    secondary: "bg-secondary text-secondary-foreground border-2 border-secondary",
    outline: "bg-transparent border-2 border-primary text-primary",
    ghost: "bg-transparent border-2 border-border text-muted-foreground",
    glass: "bg-background/80 border border-border backdrop-blur-sm",
  };

  // Hover styles
  const hoverStyles = hoverEffect
    ? " hover:border-primary hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] cursor-pointer"
    : "";

  return (
    <Component
      className={`${skewStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default SkewContainer;
