import { motion } from "framer-motion";
import useMatchTheme from "../../hooks/useMatchTheme";
import { ThemeMode } from "../../themes";
import ReactIcon from "./IconReact";

type FolderIconProps = {
  isOpen?: boolean;
  size?: number;
  className?: string;
};

const AnimatedFolderIcon = ({ isOpen = false, size = 24, className }: FolderIconProps) => {
  const iconStyle = process.env.NEXT_PUBLIC_FOLDER_ICON_COLOR || 'theme';
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  
  const getFolderColor = () => {
    if (iconStyle === 'macos') {
      return '#007AFF'; // macOS blue
    }
    
    // Theme-based coloring with fallbacks
    if (isTronTheme) {
      return '#288e9f';
    }
    if (isClassicTheme) {
      return '#f9a48c';
    }
    if (isSoftTheme) {
      return '#93a1d2';
    }
    
    // Default flat theme
    return '#1abc9c';
  };

  const folderColor = getFolderColor();
  const folderBodyColor = isOpen ? folderColor : `${folderColor}dd`; // Slightly transparent when closed
  const folderTabColor = folderColor;

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, display: 'inline-block' }}
      animate={isOpen ? "open" : "closed"}
      initial="closed"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Folder Body */}
        <motion.path
          d="M4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V8C20 6.89543 19.1046 6 18 6H10L8 4H6C4.89543 4 4 4.89543 4 6Z"
          fill={folderBodyColor}
          variants={{
            closed: { scale: 1, y: 0 },
            open: { scale: 1.05, y: -1 }
          }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        />
        
        {/* Folder Tab */}
        <motion.path
          d="M4 6H8L10 6H18C19.1046 6 20 6.89543 20 8V6C20 4.89543 19.1046 4 18 4H10L8 4H6C4.89543 4 4 4.89543 4 6Z"
          fill={folderTabColor}
          variants={{
            closed: { y: 0, opacity: 0.9 },
            open: { y: -2, opacity: 1 }
          }}
          transition={{ duration: 0.2, ease: "easeInOut", delay: 0.05 }}
        />
        
        {/* Inner Shadow (appears when open) */}
        {isOpen && (
          <motion.path
            d="M6 8H18V18H6V8Z"
            fill="rgba(0,0,0,0.1)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.15, delay: 0.1 }}
          />
        )}
      </svg>
    </motion.div>
  );
};

const ClassicFolderIcon = ({ isOpen = false, size = 24 }: FolderIconProps) => {
  const iconName = isOpen ? "PiFolderOpen" : "PiFolder";
  return <ReactIcon iconName={iconName} size={size} />;
};

export default function FolderIcon({ isOpen = false, size = 24, className }: FolderIconProps) {
  const iconStyle = process.env.NEXT_PUBLIC_FOLDER_ICON_STYLE || 'classic';
  
  if (iconStyle === 'animated') {
    return <AnimatedFolderIcon isOpen={isOpen} size={size} className={className} />;
  }
  
  return <ClassicFolderIcon isOpen={isOpen} size={size} />;
}