import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  required = false,
  className = '',
  children
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={htmlFor} 
        className="text-base font-medium text-gray-800"
      >
        {label} {required && <span className="text-error">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

export function Input({
  className = '',
  error,
  ...props
}: InputProps) {
  return (
    <input
      className={`w-full h-12 rounded-lg border ${error ? 'border-error' : 'border-gray-300'} px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary ${className}`}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
  maxLength?: number;
  showCount?: boolean;
  value?: string;
}

export function Textarea({
  className = '',
  error,
  maxLength,
  showCount = true,
  value = '',
  ...props
}: TextareaProps) {
  return (
    <>
      <textarea
        className={`w-full min-h-[150px] rounded-lg border ${error ? 'border-error' : 'border-gray-300'} p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary ${className}`}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {maxLength && showCount && (
        <p className="text-xs text-gray-500">
          {value.length}/{maxLength} characters
        </p>
      )}
    </>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export function Select({
  className = '',
  options,
  error,
  ...props
}: SelectProps) {
  return (
    <select
      className={`w-full h-12 rounded-lg border ${error ? 'border-error' : 'border-gray-300'} px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik02IDcuNUwwLjgwMzg0OSAxLjVMMTEuMTk2MiAxLjVMNiA3LjVaIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPgo=')] bg-no-repeat bg-[position:right_16px_center] ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  className?: string;
}

export function Checkbox({
  label,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <label className={`flex items-center cursor-pointer ${className}`}>
      <input 
        type="checkbox" 
        className="sr-only" 
        {...props} 
      />
      <span className="relative w-5 h-5 border border-gray-300 rounded flex-shrink-0 mr-2 bg-white flex items-center justify-center">
        <span className={`absolute inset-0 bg-primary rounded flex items-center justify-center ${props.checked ? 'opacity-100' : 'opacity-0'}`}>
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </span>
      <span className="text-gray-800">{label}</span>
    </label>
  );
}