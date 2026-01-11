
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  href: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, Icon, href }) => {
  return (
    <a href={href} className="nas-service-card group">
      <div className="nas-service-icon">
        <Icon size={44} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="nas-service-title">{title}</h3>
      <p className="nas-service-desc">{description}</p>
    </a>
  );
};

export default ServiceCard;
