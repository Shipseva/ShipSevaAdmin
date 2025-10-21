import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, className, icon, required, ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`block w-full border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-colors ${
            icon ? "pl-10" : "px-3"
          } py-3 pr-3 ${
            error ? "border-red-500" : "border-gray-300"
          } bg-white ${className ?? ""}`}
          {...props}
        />
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Input;
