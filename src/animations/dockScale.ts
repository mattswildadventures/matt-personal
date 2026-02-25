import { Variants } from "framer-motion";

// Calculate transform origin based on stored click position
const getTransformOrigin = () => {
  try {
    const stored = sessionStorage.getItem('windowOrigin');
    if (stored) {
      const origin = JSON.parse(stored);
      // Convert screen coordinates to transform origin percentages
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const originX = (origin.x / viewportWidth) * 100;
      const originY = (origin.y / viewportHeight) * 100;
      
      return `${originX}% ${originY}%`;
    }
  } catch (e) {
    console.warn('Error reading window origin:', e);
  }
  
  // Fallback to center origin
  return "50% 50%";
};

export const dockScaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 20
    },
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 20
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 40
    },
  },
};

// Fallback animation for when no origin is stored
export const dockScaleInFallback: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    transition: { type: "tween" },
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: "tween", duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { type: "tween", duration: 0.2 },
  },
};