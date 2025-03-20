import React from "react";

interface FeaturePillProps {
  text: string;
  className?: string;
}

const FeaturePill: React.FC<FeaturePillProps> = ({ text, className = "" }) => {
  // Dynamically calculate padding based on text length
  const getPadding = () => {
    if (text.length < 12) return "px-24";
    if (text.length < 18) return "px-16";
    if (text.length < 22) return "px-10";
    return "px-5";
  };

  return (
    <div
      className={`gap-2.5 self-stretch ${getPadding()} py-7 w-full bg-indigo-50 border border-indigo-200 border-solid shadow-sm min-h-[82px] rounded-[50px] max-md:px-5 ${className}`}
    >
      {text}
    </div>
  );
};

export default FeaturePill;