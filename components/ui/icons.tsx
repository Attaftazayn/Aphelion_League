import React from 'react'

export function TennisBall({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }: React.SVGProps<SVGSVGElement> & { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
      <path d="M5.636 18.364a9 9 0 0 1 0-12.728" />
    </svg>
  )
}
