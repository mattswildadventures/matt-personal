import { motion } from "framer-motion";
import Image from "next/image";
import { useContext } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext } from "../../contexts/GlobalContext";
import { ThemeMode } from "../../themes";
import { MotionButton } from "./Button";
import ReactIcon from "./IconReact";

type ThemeButtonProps = {
  theme: ThemeMode;
};

export default function ThemeButton({ theme }: ThemeButtonProps) {
  const { theme: cachedTheme } = useContext(GlobalContext);
  const isActive = cachedTheme.val === theme;

  const maskStyle: ThemeUICSSObject = {
    background: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: "6px", // Mac-style 6px border radius for button elements
  };

  return (
    <MotionButton
      unsetStyle
      whileHover={{ scale: isActive ? 1 : 0.95 }}
      onClick={() => cachedTheme.set(theme)}
      sx={{ borderRadius: "6px", overflow: "hidden", position: "relative", width: "fit-content" }}
      aria-label={`${theme} theme`}
      aria-pressed={isActive}
    >
      <Image src={`/images/theme-${theme}.png`} alt={`${theme} theme preview`} layout="fixed" width={140} height={84} />
      {isActive && (
        <motion.span sx={maskStyle} animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
          <motion.span animate={{ scale: 1 }} initial={{ scale: 0 }}>
            <ReactIcon iconName="FaCheckCircle" size={40} />
          </motion.span>
        </motion.span>
      )}
    </MotionButton>
  );
}
