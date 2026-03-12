import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface LucideIconProps extends LucideProps {
  name: string;
}

const LucideIcon: React.FC<LucideIconProps> = ({ name, ...props }) => {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default LucideIcon;
