import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  className = ''
}: ProgressIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className={`flex justify-center space-x-2 my-6 ${className}`}>
      {steps.map(step => (
        <div 
          key={step}
          className={`h-1.5 w-24 rounded-full ${
            step < currentStep 
              ? 'bg-primary' 
              : step === currentStep 
                ? 'bg-primary-light' 
                : 'bg-primary-lightest'
          }`}
        ></div>
      ))}
    </div>
  );
}

interface StepIndicatorProps {
  steps: Array<{
    label: string;
    description?: string;
  }>;
  currentStep: number;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  className = ''
}: StepIndicatorProps) {
  return (
    <div className={className}>
      {/* Progress bar */}
      <div className="flex justify-center space-x-2 mb-6">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`h-1.5 w-24 rounded-full ${
              index + 1 < currentStep 
                ? 'bg-primary' 
                : index + 1 === currentStep 
                  ? 'bg-primary-light' 
                  : 'bg-primary-lightest'
            }`}
          />
        ))}
      </div>
      
      {/* Current step details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-1">
          {steps[currentStep - 1]?.label || ''}
        </h2>
        {steps[currentStep - 1]?.description && (
          <p className="text-gray-500">
            {steps[currentStep - 1].description}
          </p>
        )}
      </div>
    </div>
  );
}