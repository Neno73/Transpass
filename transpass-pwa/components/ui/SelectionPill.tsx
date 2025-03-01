import React from 'react';

interface SelectionPillProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SelectionPill({
  label,
  selected = false,
  onClick,
  className = ''
}: SelectionPillProps) {
  const baseStyles = "rounded-full py-2 px-4 border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20";
  
  const stateStyles = selected 
    ? "bg-primary-light text-white border-transparent"
    : "border-gray-300 text-gray-700 hover:bg-gray-50";
  
  const combinedClasses = `${baseStyles} ${stateStyles} ${className}`;
  
  return (
    <button
      type="button"
      className={combinedClasses}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

interface SelectionPillGroupProps {
  label?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export function SelectionPillGroup({
  label,
  required = false,
  options,
  selectedOptions,
  onChange,
  multiSelect = true,
  className = ''
}: SelectionPillGroupProps) {
  const handleSelect = (option: string) => {
    if (multiSelect) {
      // For multi-select mode
      if (selectedOptions.includes(option)) {
        onChange(selectedOptions.filter(item => item !== option));
      } else {
        onChange([...selectedOptions, option]);
      }
    } else {
      // For single-select mode
      onChange([option]);
    }
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-base font-medium text-gray-800">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <SelectionPill
            key={option.value}
            label={option.label}
            selected={selectedOptions.includes(option.value)}
            onClick={() => handleSelect(option.value)}
          />
        ))}
      </div>
    </div>
  );
}