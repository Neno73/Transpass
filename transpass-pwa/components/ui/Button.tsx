import React from 'react';

// PrimaryButton component
interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function PrimaryButton({
  label,
  fullWidth = false,
  icon,
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      className={`bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-full 
        ${fullWidth ? 'w-full' : ''} 
        ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''} 
        flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {label}
    </button>
  );
}

// SecondaryButton component
interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  fullWidth?: boolean;
  variant?: 'outline' | 'text';
  icon?: React.ReactNode;
  className?: string;
}

export function SecondaryButton({
  label,
  fullWidth = false,
  variant = 'outline',
  icon,
  className = '',
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      className={`font-medium py-3 px-4 rounded-full 
        ${variant === 'outline' 
          ? 'border border-primary text-primary bg-white hover:bg-gray-50' 
          : 'text-primary hover:bg-gray-50'}
        ${fullWidth ? 'w-full' : ''} 
        ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''} 
        flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {label}
    </button>
  );
}

// IconButton component
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  ariaLabel: string;
  variant?: 'default' | 'primary' | 'transparent';
  className?: string;
}

export function IconButton({
  icon,
  ariaLabel,
  variant = 'default',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`w-10 h-10 rounded-full flex items-center justify-center 
        ${variant === 'primary' 
          ? 'bg-primary text-white hover:bg-primary-dark' 
          : variant === 'transparent'
            ? 'bg-transparent hover:bg-gray-100'
            : 'bg-primary-lightest hover:bg-gray-100'}
        ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''} 
        ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}

// Legacy Button component for backward compatibility
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'icon' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  label?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  children,
  label,
  fullWidth = false,
  ariaLabel,
  ...props
}: ButtonProps) {
  // Primary button
  if (variant === 'primary' && label) {
    return (
      <PrimaryButton 
        label={label} 
        fullWidth={fullWidth}
        icon={icon}
        className={className}
        {...props}
      />
    );
  }
  
  // Secondary button
  if ((variant === 'secondary' || variant === 'outline') && label) {
    return (
      <SecondaryButton 
        label={label} 
        fullWidth={fullWidth}
        variant="outline"
        icon={icon}
        className={className}
        {...props}
      />
    );
  }
  
  // Text button
  if ((variant === 'text' || variant === 'ghost') && label) {
    return (
      <SecondaryButton 
        label={label}
        fullWidth={fullWidth}
        variant="text"
        icon={icon}
        className={className}
        {...props}
      />
    );
  }
  
  // Icon button
  if (variant === 'icon' && icon && ariaLabel) {
    return (
      <IconButton 
        icon={icon}
        ariaLabel={ariaLabel}
        className={className}
        {...props}
      />
    );
  }
  
  // Fallback to old implementation
  const baseStyles = "font-medium transition-colors";
  
  const variantStyles = {
    primary: "bg-primary hover:bg-primary-dark text-white rounded-full disabled:opacity-60",
    secondary: "bg-transparent border border-primary text-primary rounded-full hover:bg-gray-50",
    outline: "bg-transparent border border-primary text-primary rounded-full hover:bg-gray-50",
    text: "bg-transparent text-primary hover:bg-gray-50",
    ghost: "bg-transparent text-primary hover:bg-gray-50",
    icon: "bg-primary-lightest text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-100"
  };
  
  const sizeStyles = {
    sm: variant === 'icon' ? "w-8 h-8" : "px-4 py-2 text-sm h-10",
    md: variant === 'icon' ? "w-10 h-10" : "px-6 py-3 text-md h-12",
    lg: variant === 'icon' ? "w-12 h-12" : "px-8 py-4 text-md h-14"
  };
  
  const fullWidthStyle = fullWidth ? 'w-full' : '';
  
  // Handle variant mappings for backward compatibility
  const mappedVariant = variant === 'outline' ? 'secondary' : 
                        variant === 'ghost' ? 'text' : 
                        variant;
                        
  const styleVariant = (mappedVariant as keyof typeof variantStyles) in variantStyles 
    ? mappedVariant as keyof typeof variantStyles 
    : 'primary';
  
  const combinedClasses = `${baseStyles} ${variantStyles[styleVariant]} ${sizeStyles[size]} ${fullWidthStyle} ${className}`;
  
  if (variant === 'icon' && icon) {
    return (
      <button 
        className={combinedClasses} 
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </button>
    );
  }
  
  return (
    <button 
      className={`${combinedClasses} flex items-center justify-center gap-2`} 
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children || label}
    </button>
  );
}