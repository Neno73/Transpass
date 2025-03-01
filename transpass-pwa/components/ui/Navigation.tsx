import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Top Navigation
interface TopNavProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function TopNav({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  className = ''
}: TopNavProps) {
  const router = useRouter();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };
  
  return (
    <div className={`h-[60px] bg-white border-b border-gray-300 flex items-center justify-center relative ${className}`}>
      {showBackButton && (
        <button 
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800"
          onClick={handleBack}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M15.8333 10H4.16667M4.16667 10L10 15.8333M4.16667 10L10 4.16667" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      
      <h1 className="text-lg font-semibold">{title}</h1>
      
      {rightAction && (
        <div className="absolute right-4">
          {rightAction}
        </div>
      )}
    </div>
  );
}

// Bottom Navigation
interface BottomNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

function BottomNavItem({
  href,
  label,
  icon,
  active = false
}: BottomNavItemProps) {
  return (
    <Link 
      href={href}
      className={`flex flex-col items-center justify-center ${active ? 'text-primary' : 'text-gray-500'}`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-sm">{label}</span>
    </Link>
  );
}

interface BottomNavProps {
  items: Array<Omit<BottomNavItemProps, 'active'>>;
  className?: string;
}

export function BottomNav({
  items,
  className = ''
}: BottomNavProps) {
  const router = useRouter();
  
  return (
    <div className={`h-[56px] bg-white border-t border-gray-300 flex items-center justify-around px-4 ${className}`}>
      {items.map((item) => (
        <BottomNavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          active={router.pathname === item.href}
        />
      ))}
    </div>
  );
}