"use client";
import React from "react";
import { cn } from "../utils/cn";

export const HoverBorderGradient = ({
  children,
  containerClassName,
  className,
  as: Component = "button",
  ...props
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: any;
  [key: string]: any;
}) => {
  return (
    <div className={cn("relative rounded-lg p-[1px] group", containerClassName)}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
      <Component
        className={cn("relative bg-neutral-900 px-8 py-4 rounded-lg", className)}
        {...props}
      >
        {children}
      </Component>
    </div>
  );
};