import { ThemeMode } from '../themes';
import { BackgroundMode } from '../contexts/GlobalContext';

/**
 * Parse environment variables for default settings with proper validation and fallbacks
 */

export function getDefaultTheme(): ThemeMode {
  const envTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME?.toLowerCase();
  
  switch (envTheme) {
    case 'flat':
      return ThemeMode.Flat;
    case 'soft':
      return ThemeMode.Soft;
    case 'tron':
      return ThemeMode.Tron;
    case 'classic':
      return ThemeMode.Classic;
    case 'liquidglass':
      return ThemeMode.LiquidGlass;
    default:
      // Fallback to LiquidGlass theme if invalid or missing
      return ThemeMode.LiquidGlass;
  }
}

export function getDefaultBackground(): BackgroundMode {
  const envBackground = process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND?.toLowerCase();
  
  switch (envBackground) {
    case 'none':
      return BackgroundMode.None;
    case 'custom':
      return BackgroundMode.Custom;
    case 'random':
      return BackgroundMode.Random;
    default:
      // Fallback to Random nature if invalid or missing
      return BackgroundMode.Random;
  }
}

export function getDefaultReduceMotion(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_REDUCE_MOTION?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing
  return false;
}

export function getDefaultHideTaskbar(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_HIDE_TASKBAR?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing
  return false;
}

export function getDefaultGlassAnimations(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_GLASS_ANIMATIONS?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing (glass animations disabled by default)
  return false;
}

export function getDefaultShowExtendedDockDesktop(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_SHOW_EXTENDED_DOCK_DESKTOP?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to true if invalid or missing (extended dock shown by default on desktop)
  return true;
}

export function getDefaultShowExtendedDockMobile(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_SHOW_EXTENDED_DOCK_MOBILE?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing (extended dock hidden by default on mobile)
  return false;
}

/**
 * Dock Spacing Configuration
 * 
 * Controls how icons are spaced and aligned in the dock on mobile devices.
 * Desktop always uses center alignment with fixed gaps.
 */

export function getDefaultDockSpacingMode(): string {
  const envValue = process.env.NEXT_PUBLIC_DOCK_SPACING_MODE?.toLowerCase();
  
  const validModes = [
    'adaptive',      // Smart mode: switches between extended/compact spacing based on dock state
    'space-evenly',  // Equal space around each icon, spreads across full width
    'center',        // Center icons with gap spacing, compact look
    'space-between', // Space between icons only, no space at edges
    'space-around',  // Space around each icon, smaller than space-evenly
  ];
  
  if (validModes.includes(envValue || '')) {
    return envValue!;
  }
  
  // Fallback to adaptive mode (smart default that handles both scenarios)
  return 'adaptive';
}

export function getDefaultDockSpacingExtended(): string {
  const envValue = process.env.NEXT_PUBLIC_DOCK_SPACING_EXTENDED?.toLowerCase();
  
  const validSpacings = ['space-evenly', 'center', 'space-between', 'space-around'];
  
  if (validSpacings.includes(envValue || '')) {
    return envValue!;
  }
  
  // Fallback to space-evenly (works great when many icons are visible)
  // Distributes 7+ icons evenly across mobile screen width
  return 'space-evenly';
}

export function getDefaultDockSpacingCompact(): string {
  const envValue = process.env.NEXT_PUBLIC_DOCK_SPACING_COMPACT?.toLowerCase();
  
  const validSpacings = ['space-evenly', 'center', 'space-between', 'space-around'];
  
  if (validSpacings.includes(envValue || '')) {
    return envValue!;
  }
  
  // Fallback to center (works great when few icons are visible)
  // Centers 3 icons tightly together instead of spreading across full width
  return 'center';
}

export function getDefaultDockGapSize(): number {
  const envValue = process.env.NEXT_PUBLIC_DOCK_GAP_SIZE;
  
  if (envValue) {
    const parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 20) {
      return parsed;
    }
  }
  
  // Fallback to 4px gap (good balance between compact and readable)
  return 4;
}

/**
 * Social Button Display Configuration
 * 
 * Controls whether social buttons appear as individual icons or a single popup button.
 */

export function getDefaultSocialDisplayMode(isExtendedDockEnabled?: boolean): 'popup' | 'individual' {
  const envValue = process.env.NEXT_PUBLIC_SOCIAL_DISPLAY_MODE?.toLowerCase();
  
  if (envValue === 'individual') {
    return 'individual';
  }
  if (envValue === 'popup') {
    return 'popup';
  }
  
  // Smart fallback based on extended dock state:
  // - When extended dock is disabled: show individual icons (more space for fewer icons)
  // - When extended dock is enabled: show popup (conserve space with many icons)
  if (isExtendedDockEnabled !== undefined) {
    return isExtendedDockEnabled ? 'popup' : 'individual';
  }
  
  // Default fallback when dock state is unknown
  return 'popup';
}

export function getDefaultShowSeparator(): boolean {
  const envValue = process.env.NEXT_PUBLIC_SHOW_SEPARATOR?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to true (show separator by default when conditions are met)
  return true;
}

export function getDefaultDockMagnification(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_DOCK_MAGNIFICATION?.toLowerCase();

  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }

  // Fallback to true (dock magnification enabled by default)
  return true;
}

export function getDefaultShowWelcome(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_SHOW_WELCOME?.toLowerCase();

  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }

  // Fallback to true (show welcome on first visit by default)
  return true;
}

/**
 * Get all default settings as an object for easy access
 */
export function getAllDefaults() {
  return {
    theme: getDefaultTheme(),
    background: getDefaultBackground(),
    reduceMotion: getDefaultReduceMotion(),
    hideTaskbar: getDefaultHideTaskbar(),
    glassAnimations: getDefaultGlassAnimations(),
    showExtendedDockDesktop: getDefaultShowExtendedDockDesktop(),
    showExtendedDockMobile: getDefaultShowExtendedDockMobile(),
    dockSpacingMode: getDefaultDockSpacingMode(),
    dockSpacingExtended: getDefaultDockSpacingExtended(),
    dockSpacingCompact: getDefaultDockSpacingCompact(),
    dockGapSize: getDefaultDockGapSize(),
    socialDisplayMode: getDefaultSocialDisplayMode(),
    showSeparator: getDefaultShowSeparator(),
    showWelcome: getDefaultShowWelcome(),
    dockMagnification: getDefaultDockMagnification(),
  };
}