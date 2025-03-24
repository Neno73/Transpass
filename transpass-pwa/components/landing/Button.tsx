import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="overflow-hidden self-stretch px-5 py-2.5 bg-indigo-900 rounded-[1251px]"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;