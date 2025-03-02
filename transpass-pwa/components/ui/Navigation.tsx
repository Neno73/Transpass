import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  LineChart, 
  User, 
  BarChart3, 
  QrCode, 
  History, 
  Settings, 
  ChevronLeft, 
  Plus
} from 'lucide-react';

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
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };
  
  return (
    <div className={`h-[60px] bg-white border-b border-gray-300 flex items-center justify-center relative ${className}`}>
      {showBackButton && (
        <button 
          className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
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
      <span className="text-xs">{label}</span>
    </Link>
  );
}

interface BottomNavProps {
  userType: 'company' | 'user';
  className?: string;
}

export function BottomNav({
  userType,
  className = ''
}: BottomNavProps) {
  const pathname = usePathname();
  
  const companyItems = [
    {
      href: '/company/dashboard',
      label: 'Home',
      icon: <Home size={22} />,
    },
    {
      href: '/company/products',
      label: 'Products',
      icon: <Package size={22} />,
    },
    {
      href: '/company/products/create',
      label: 'Create',
      icon: <Plus size={22} className="text-white" />,
      className: 'bg-primary text-white rounded-full p-3 -mt-5 border-4 border-white shadow-lg'
    },
    {
      href: '/company/analytics',
      label: 'Analytics',
      icon: <BarChart3 size={22} />,
    },
    {
      href: '/company/profile',
      label: 'Profile',
      icon: <User size={22} />,
    },
  ];

  const userItems = [
    {
      href: '/user/dashboard',
      label: 'Home',
      icon: <Home size={22} />,
    },
    {
      href: '/scan',
      label: 'Scan',
      icon: <QrCode size={22} />,
    },
    {
      href: '/user/history',
      label: 'History',
      icon: <History size={22} />,
    },
    {
      href: '/user/profile',
      label: 'Profile',
      icon: <User size={22} />,
    },
  ];
  
  const items = userType === 'company' ? companyItems : userItems;
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 h-[70px] bg-white border-t border-gray-300 flex items-center justify-around px-2 ${className} z-50`}>
      {items.map((item) => (
        <div 
          key={item.href} 
          className={`flex-1 flex justify-center ${item.className || ''}`}
        >
          <BottomNavItem
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
          />
        </div>
      ))}
    </div>
  );
}