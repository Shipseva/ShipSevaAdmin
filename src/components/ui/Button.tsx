import React, { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-gray-500 text-white hover:bg-gray-600",
  outline: "border border-gray-500 text-gray-500 hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}) => {
  const appliedClass = `${variantClasses[variant]} ${sizeClasses[size]} rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${
    className ?? ""
  }`;

  return (
    <button className={appliedClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
