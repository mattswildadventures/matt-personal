import { motion } from "framer-motion";
import { MouseEventHandler, ReactNode, useRef } from "react";
import { ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useMatchTheme from "../../../hooks/useMatchTheme";
import { ThemeMode } from "../../../themes";
import { MotionButton } from "../Button";
import Icon, { IconName } from "../Icon";

export type DockIconProps = {
  iconName?: IconName;
  customIcon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  href?: string;
  index?: number;
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: () => void;
  scale?: number;
  isNavigationIcon?: boolean;
  customSize?: number; // Optional custom size for responsive behavior
};

export default function DockIcon({
  iconName,
  customIcon,
  label,
  onClick,
  isActive,
  href,
  index = 0,
  onMouseEnter,
  onMouseLeave,
  scale = 1,
  isNavigationIcon = false,
  customSize,
}: DockIconProps) {
  const isMobile = useInBreakpoint(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);
  
  const baseSize = customSize || (isMobile ? 40 : 48);
  const currentSize = baseSize * scale;

  const iconContainerStyle: ThemeUICSSObject = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end", // Anchor icon to bottom so it extends upward
    height: baseSize, // Fixed height — prevents dock bar from expanding
    overflow: "visible", // Allow magnified icon to extend past the wrapper
    transition: "width 0.2s ease-out",
    willChange: "width",
  };

  const iconStyle: ThemeUICSSObject = {
    width: currentSize,
    height: currentSize,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bg: "dockIconBg",
    color: "dockIconColor",
    backdropFilter: "blur(10px)",
    border: "1px solid",
    borderColor: "dockIconBorder",
    cursor: "pointer",
    transition: "all 0.2s ease-out",
    willChange: "transform, background",
    transform: "translate3d(0, 0, 0)", // Force hardware acceleration
    transformOrigin: "bottom center", // Scale from bottom for whileTap

    // Enhanced touch target for mobile
    minWidth: isMobile ? "44px" : "auto", // Minimum 44px touch target
    minHeight: isMobile ? "44px" : "auto",

    "&:hover": {
      bg: "dockIconHoverBg",
      transform: isMobile ? "scale(1.05)" : "translateY(-2px)", // Different hover for mobile
    },

    "&:active": {
      bg: "dockIconActiveBg",
      transform: "translateY(0px) scale(0.95)",
      transition: "all 0.1s ease-out", // Faster feedback on touch
    },

    // Touch-specific styles
    "@media (hover: none) and (pointer: coarse)": {
      "&:hover": {
        bg: "dockIconBg", // Reset hover for touch devices
        transform: "none",
      },
      "&:active": {
        bg: "dockIconActiveBg",
        transform: "scale(0.9)",
      },
    },

    // Cyberpunk theme glow effects
    ...(isCyberpunkTheme && {
      boxShadow: (theme: any) => `0 0 15px ${theme.colors?.dockGlow}, 0 0 30px ${theme.colors?.dockShadow}, inset 0 0 15px ${theme.colors?.dockGlow}`,

      "&:hover": {
        bg: "dockIconHoverBg",
        boxShadow: (theme: any) => `0 0 20px ${theme.colors?.dockGlow}, 0 0 40px ${theme.colors?.dockShadow}, inset 0 0 20px ${theme.colors?.dockGlow}`,
        transform: isMobile ? "scale(1.05)" : "translateY(-2px)",
      },

      "&:active": {
        bg: "dockIconActiveBg",
        transform: "translateY(0px) scale(0.95)",
      },
    }),
  };

  const dotIndicatorStyle: ThemeUICSSObject = {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "9px",
    height: "9px",
    minWidth: "9px", // Prevent theme scaling
    minHeight: "9px", // Prevent theme scaling
    maxWidth: "9px", // Prevent theme scaling
    maxHeight: "9px", // Prevent theme scaling
    borderRadius: "50%",
    bg: "highlight", // Use theme highlight color like NavLink
    opacity: isActive && isNavigationIcon ? 1 : 0, // Only show for navigation icons when active
    transition: "opacity 0.2s ease-out",
    zIndex: 10, // Ensure it's above other elements
    
    // Theme-specific styling to match NavLink
    ...(useMatchTheme(ThemeMode.Classic) && {
      boxShadow: "0 0 0 1px #000",
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      bg: "red",
      boxShadow: (theme) => `0 0 0 1px ${theme.colors?.shadow}`,
    }),

    ...(isCyberpunkTheme && {
      bg: "highlight",
      boxShadow: "0 0 8px rgba(0, 255, 255, 0.8), 0 0 16px rgba(0, 255, 255, 0.4)",
    }),
  };

  const bounceVariants = {
    initial: { y: 0 },
    bounce: { 
      y: [-2, -8, -2, 0],
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        times: [0, 0.3, 0.7, 1]
      }
    }
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // Trigger bounce animation on click
    const element = buttonRef.current?.parentElement;
    if (element) {
      element.style.animation = "none";
      setTimeout(() => {
        element.style.animation = "dockIconBounce 0.4s ease-out";
      }, 10);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter(index);
    }
  };

  return (
    <motion.div
      sx={iconContainerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      variants={bounceVariants}
      initial="initial"
    >
      <MotionButton
        ref={buttonRef}
        unsetStyle
        sx={iconStyle}
        onClick={handleClick}
        href={href}
        aria-label={label}
        aria-current={isNavigationIcon && isActive ? "page" : undefined}
        whileTap={isMobile ? { scale: 1.1 } : { scale: 0.95 }}
      >
        {customIcon || (iconName && <Icon iconName={iconName} size={Math.floor(currentSize * 0.6)} />)}
      </MotionButton>
      
      {/* Active indicator dot */}
      {isNavigationIcon && <div sx={dotIndicatorStyle} />}
      
      {/* CSS keyframes for bounce animation */}
      <style jsx>{`
        @keyframes dockIconBounce {
          0% { transform: translateY(0px); }
          30% { transform: translateY(-8px); }
          70% { transform: translateY(-2px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </motion.div>
  );
}