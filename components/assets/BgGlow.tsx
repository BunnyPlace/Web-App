import React from "react";

export const BgGlow = ({ className }: { className: string }) => {
  return (
    <svg
      width="393"
      height="494"
      viewBox="0 0 393 494"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_f_241_1078)">
        <circle cx="196" cy="247" r="105" fill="#5130B5" />
      </g>
      <defs>
        <filter
          id="filter0_f_241_1078"
          x="-50.2"
          y="0.800003"
          width="492.4"
          height="492.4"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="70.6" result="effect1_foregroundBlur_241_1078" />
        </filter>
      </defs>
    </svg>
  );
};
