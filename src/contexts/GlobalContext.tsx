import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { useColorMode } from "theme-ui";
import { ThemeMode } from "../themes";
import {
  getDefaultTheme,
  getDefaultBackground,
  getDefaultReduceMotion,
  getDefaultHideTaskbar,
  getDefaultGlassAnimations,
  getDefaultShowExtendedDockDesktop,
  getDefaultShowExtendedDockMobile,
  getDefaultShowWelcome
} from "../utils/envDefaults";

type Context<T = boolean> = {
  val: T;
  set: Dispatch<SetStateAction<T>>;
};

export enum BackgroundMode {
  None = "none",
  Custom = "custom",
  Random = "random",
}

// Helper to determine if a theme is dark
const isDarkTheme = (theme: ThemeMode): boolean => {
  return theme === ThemeMode.Tron || theme === ThemeMode.Cyberpunk;
};

type GlobalContextType = {
  theme: Context<ThemeMode>;
  reduceMotion: Context;
  hideTaskbar: Context;
  background: Context<BackgroundMode>;
  glassAnimations: Context;
  showExtendedDockDesktop: Context;
  showExtendedDockMobile: Context;
  showWelcome: Context;
  // Theme transition state
  isThemeTransitioning: boolean;
  themeTransitionColor: string;
};

type GlobalProviderProps = {
  children: ReactNode;
};

export const GlobalContext = createContext<GlobalContextType>({
  theme: { val: getDefaultTheme(), set: () => {} },
  reduceMotion: { val: getDefaultReduceMotion(), set: () => {} },
  hideTaskbar: { val: getDefaultHideTaskbar(), set: () => {} },
  background: { val: getDefaultBackground(), set: () => {} },
  glassAnimations: { val: getDefaultGlassAnimations(), set: () => {} },
  showExtendedDockDesktop: { val: getDefaultShowExtendedDockDesktop(), set: () => {} },
  showExtendedDockMobile: { val: getDefaultShowExtendedDockMobile(), set: () => {} },
  showWelcome: { val: getDefaultShowWelcome(), set: () => {} },
  isThemeTransitioning: false,
  themeTransitionColor: "white",
});

export const GlobalProvider = ({ children }: GlobalProviderProps): JSX.Element => {
  const [_theme, _setTheme] = useColorMode();
  const [theme, setTheme] = useState(getDefaultTheme());

  // Theme transition state
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);
  const [themeTransitionColor, setThemeTransitionColor] = useState("white");

  // need these `useState + useEffect` intermediaries to resolve
  // the problem when using localStorage with Next's Static Generation
  const [_reduceAnim, _setReduceAnim] = useLocalStorage("reduceMotion", getDefaultReduceMotion());
  const [reduceMotion, setReduceAnim] = useState(getDefaultReduceMotion());

  const [_hideTaskbar, _setHideTaskbar] = useLocalStorage("hideTaskbar", getDefaultHideTaskbar());
  const [hideTaskbar, setHideTaskbar] = useState(getDefaultHideTaskbar());

  const [_background, _setBackground] = useLocalStorage("background", getDefaultBackground());
  const [background, setBackground] = useState(getDefaultBackground());

  const [_glassAnimations, _setGlassAnimations] = useLocalStorage("glassAnimations", getDefaultGlassAnimations());
  const [glassAnimations, setGlassAnimations] = useState(getDefaultGlassAnimations());

  const [_showExtendedDockDesktop, _setShowExtendedDockDesktop] = useLocalStorage("showExtendedDockDesktop", getDefaultShowExtendedDockDesktop());
  const [showExtendedDockDesktop, setShowExtendedDockDesktop] = useState(getDefaultShowExtendedDockDesktop());

  const [_showExtendedDockMobile, _setShowExtendedDockMobile] = useLocalStorage("showExtendedDockMobile", getDefaultShowExtendedDockMobile());
  const [showExtendedDockMobile, setShowExtendedDockMobile] = useState(getDefaultShowExtendedDockMobile());

  const [_showWelcome, _setShowWelcome] = useLocalStorage("showWelcome", getDefaultShowWelcome());
  const [showWelcome, setShowWelcome] = useState(getDefaultShowWelcome());

  useEffect(() => {
    // workaround for Theme UI's color mode being default to user preference,
    // which is light/dark, altering that to match site's default
    setTheme(_theme === "light" || _theme === "dark" ? getDefaultTheme() : (_theme as ThemeMode));
  }, [_theme]);
  useEffect(() => setReduceAnim(_reduceAnim as boolean), [_reduceAnim]);
  useEffect(() => setHideTaskbar(_hideTaskbar as boolean), [_hideTaskbar]);
  useEffect(() => setBackground(_background as BackgroundMode), [_background]);
  useEffect(() => setGlassAnimations(_glassAnimations as boolean), [_glassAnimations]);
  useEffect(() => setShowExtendedDockDesktop(_showExtendedDockDesktop as boolean), [_showExtendedDockDesktop]);
  useEffect(() => setShowExtendedDockMobile(_showExtendedDockMobile as boolean), [_showExtendedDockMobile]);
  useEffect(() => setShowWelcome(_showWelcome as boolean), [_showWelcome]);

  // Theme setter with crossfade transition
  const setThemeWithTransition = useCallback((newTheme: ThemeMode) => {
    // Skip transition if reduce motion is enabled or if same theme
    if (reduceMotion || newTheme === theme) {
      _setTheme(newTheme as any);
      return;
    }

    // Determine transition color based on theme direction
    // Going to dark theme = black overlay, going to light theme = white overlay
    const transitionColor = isDarkTheme(newTheme) ? "black" : "white";
    setThemeTransitionColor(transitionColor);

    // Start transition
    setIsThemeTransitioning(true);

    // Apply theme after overlay fades in
    setTimeout(() => {
      _setTheme(newTheme as any);

      // End transition after theme is applied
      setTimeout(() => {
        setIsThemeTransitioning(false);
      }, 200);
    }, 200);
  }, [_setTheme, reduceMotion, theme]);

  const context: GlobalContextType = {
    theme: {
      val: theme,
      set: setThemeWithTransition as Dispatch<SetStateAction<ThemeMode>>,
    },
    reduceMotion: {
      val: reduceMotion,
      set: _setReduceAnim as Dispatch<SetStateAction<boolean>>,
    },
    hideTaskbar: {
      val: hideTaskbar,
      set: _setHideTaskbar as Dispatch<SetStateAction<boolean>>,
    },
    background: {
      val: background,
      set: _setBackground as Dispatch<SetStateAction<BackgroundMode>>,
    },
    glassAnimations: {
      val: glassAnimations,
      set: _setGlassAnimations as Dispatch<SetStateAction<boolean>>,
    },
    showExtendedDockDesktop: {
      val: showExtendedDockDesktop,
      set: _setShowExtendedDockDesktop as Dispatch<SetStateAction<boolean>>,
    },
    showExtendedDockMobile: {
      val: showExtendedDockMobile,
      set: _setShowExtendedDockMobile as Dispatch<SetStateAction<boolean>>,
    },
    showWelcome: {
      val: showWelcome,
      set: _setShowWelcome as Dispatch<SetStateAction<boolean>>,
    },
    isThemeTransitioning,
    themeTransitionColor,
  };

  return <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>;
};
