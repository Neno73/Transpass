import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  className?: string;
}

export function Accordion({
  title,
  children,
  initiallyOpen = false,
  className = ''
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  
  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <button 
        className="w-full flex justify-between items-center p-4 bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path 
            d="M6 9L12 15L18 9" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}

interface AccordionGroupProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    initiallyOpen?: boolean;
  }>;
  className?: string;
}

export function AccordionGroup({
  items,
  className = ''
}: AccordionGroupProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item) => (
        <Accordion 
          key={item.id} 
          title={item.title}
          initiallyOpen={item.initiallyOpen}
        >
          {item.content}
        </Accordion>
      ))}
    </div>
  );
}