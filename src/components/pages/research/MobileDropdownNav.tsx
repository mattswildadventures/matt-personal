import { motion } from "framer-motion";
import { useState, useEffect, useRef, useContext } from "react";
import { Box, Button, Text } from "theme-ui";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { ThemeMode } from "../../../themes";
import useReduceMotion from "../../../hooks/useReduceMotion";
import research from "../../../data/researchInsights";

type MobileDropdownNavProps = {
  title?: string;
  onNavigate?: (item: string) => void;
};

export default function MobileDropdownNav({
  title,
  onNavigate,
}: MobileDropdownNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useContext(GlobalContext);
  const isDarkTheme = theme.val === ThemeMode.Tron;
  const mainTransition = useReduceMotion({ duration: 0.2 });

  // Find current category based on selected title
  const currentCategory = title ? Object.entries(research).find(([_, items]) => 
    items.some(item => item.title === title)
  )?.[0] : undefined;

  // Auto-select first category and item on load
  useEffect(() => {
    if (!title) {
      const categories = Object.keys(research);
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
        if (research[categories[0]]?.length > 0) {
          onNavigate?.(research[categories[0]][0].title);
        }
      }
    }
  }, [title, onNavigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleItemClick = (itemTitle: string) => {
    onNavigate?.(itemTitle);
    setIsOpen(false);
  };

  const currentItem = title ? Object.values(research)
    .flat()
    .find(item => item.title === title) : null;

  return (
    <Box ref={dropdownRef} sx={{ position: "relative", mb: 3 }}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          width: "100%",
          textAlign: "left",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "10px",
          p: "16px 20px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: isOpen ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ flex: 1, pr: 2 }}>
            <Text
              sx={{
                fontSize: "13px",
                color: "muted",
                fontWeight: "500",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                mb: "8px",
                display: "block",
              }}
            >
              {currentCategory || "Select Category"}
            </Text>
            <Text
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                color: "text",
                lineHeight: 1.3,
                display: "block",
              }}
            >
              {currentItem?.title || "Select Paper"}
            </Text>
          </Box>
          <Box
            sx={{
              transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
              transition: "transform 0.3s ease",
              fontSize: "14px",
              color: "muted",
              ml: 2,
            }}
          >
            ▼
          </Box>
        </Box>
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: isDarkTheme ? "rgba(0, 29, 35, 0.95)" : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: isDarkTheme ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            mt: "8px",
            maxHeight: "70vh",
            overflow: "auto",
            boxShadow: isDarkTheme ? "0 8px 32px rgba(0, 0, 0, 0.6)" : "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          {Object.entries(research).map(([category, items], categoryIndex) => (
            <Box key={category}>
              <Box
                sx={{
                  backgroundColor: isDarkTheme ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                  borderBottom: isDarkTheme ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <Text
                  sx={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "muted",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    p: "12px 20px 8px",
                  }}
                >
                  {category}
                </Text>
              </Box>
              {items.map((item, itemIndex) => (
                <Button
                  key={item.title}
                  onClick={() => handleItemClick(item.title)}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    p: "12px 20px",
                    transition: "all 0.2s ease",
                    backgroundColor: title === item.title 
                      ? "rgba(59, 130, 246, 0.15)" 
                      : "transparent",
                    borderBottom: itemIndex < items.length - 1 
                      ? isDarkTheme ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.05)"
                      : "none",
                    "&:hover": {
                      backgroundColor: title === item.title 
                        ? "rgba(59, 130, 246, 0.2)" 
                        : isDarkTheme ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Text
                    sx={{
                      fontSize: "14px",
                      fontWeight: title === item.title ? "600" : "500",
                      color: title === item.title ? "rgba(59, 130, 246, 1)" : "text",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </Text>
                </Button>
              ))}
              {categoryIndex < Object.entries(research).length - 1 && (
                <Box sx={{ 
                  height: "1px", 
                  backgroundColor: isDarkTheme ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)" 
                }} />
              )}
            </Box>
          ))}
        </motion.div>
      )}
      
      {/* Backdrop to close dropdown */}
      {isOpen && (
        <Box
          onClick={() => setIsOpen(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
          }}
        />
      )}
    </Box>
  );
}