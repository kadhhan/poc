import React from 'react';

interface CompassLogoProps {
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  onDark?: boolean;
  customLogoSrc?: string;
}

/**
 * Official Compass Logistics Brand Logo Component
 *
 * Renders the exact official logo as provided from:
 * https://cargonewswire.com/wp-content/uploads/2020/06/UFO-Welcomes-Compass-Logistics-International-as-New-Members-630x420.png
 */
export const CompassLogo: React.FC<CompassLogoProps> = ({
  className = 'h-8 w-auto',
  style,
  glow = false,
  customLogoSrc,
}) => {
  const logoSrc = customLogoSrc || '/compass-logo.png';

  return (
    <img
      src={logoSrc}
      alt="Compass Logistics Logo"
      className={`${className} object-contain select-none`}
      style={{
        ...style,
        ...(glow
          ? {
              filter: 'drop-shadow(0 0 14px rgba(141, 198, 63, 0.75))',
            }
          : {}),
      }}
      loading="eager"
      decoding="async"
    />
  );
};
