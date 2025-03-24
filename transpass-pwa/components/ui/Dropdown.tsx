import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  fullWidth = false,
  icon,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-dark mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          className={`
            flex items-center justify-between
            ${fullWidth ? "w-full" : "w-auto"}
            ${icon ? "pl-10" : "pl-4"}
            pr-4
            py-2.5
            text-left
            border
            border-gray-300
            rounded-xl
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-primary-light
            focus:border-primary
            transition-all
            duration-200
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              {icon}
            </div>
          )}
          <span className={selectedOption ? "text-gray-dark" : "text-gray"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-gray transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`
                  px-4 py-2.5 cursor-pointer hover:bg-primary-lightest
                  ${
                    option.value === value
                      ? "bg-primary-lightest text-primary font-medium"
                      : "text-gray-dark"
                  }
                `}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
