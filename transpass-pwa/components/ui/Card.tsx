import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ 
  className = '', 
  children
}: CardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-card ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ 
  className = '', 
  children 
}: CardHeaderProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ 
  className = '', 
  children 
}: CardContentProps) {
  return (
    <div className={`p-4 bg-gray-100 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ 
  className = '', 
  children 
}: CardFooterProps) {
  return (
    <div className={`p-4 mt-auto ${className}`}>
      {children}
    </div>
  );
}