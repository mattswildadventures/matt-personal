import { Variants } from "framer-motion";
import { ForwardedRef, forwardRef, MouseEventHandler } from "react";
import { ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useIsLandscape from "../../hooks/useIsLandscape";
import useMatchTheme from "../../hooks/useMatchTheme";
import { ThemeMode } from "../../themes";
import { MotionButton } from "../atoms/Button";
import ReactIcon from "../atoms/IconReact";

type ButtonConfigProps = {
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ButtonConfig = ({ isActive, onClick }: ButtonConfigProps, ref: ForwardedRef<HTMLElement>) => {
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);

  const size = isLandscape && isMobile ? 32 : 40;

  const variants: Variants = {
    default: { rotateZ: 0 },
    active: { rotateZ: 180 },
  };

  const buttonStyle: ThemeUICSSObject = {
    size,
    ...(useMatchTheme(ThemeMode.Cyberpunk) && {
      "&:hover": {
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(255, 0, 128, 0.4)",
      },
    }),
  };

  return (
    <MotionButton
      ref={ref}
      unsetStyle
      sx={buttonStyle}
      focusStyle={{ borderRadius: "50%" }}
      variants={variants}
      animate={isActive ? "active" : "default"}
      onClick={onClick}
      aria-label="Site config"
    >
      <ReactIcon iconName="PiGearFill" size={size} />
    </MotionButton>
  );
};

export default forwardRef(ButtonConfig);
