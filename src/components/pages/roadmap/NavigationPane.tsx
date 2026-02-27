import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { Box, Divider, Flex, Heading, Text } from "theme-ui";
import { GlobalContext } from "../../../contexts/GlobalContext";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useReduceMotion from "../../../hooks/useReduceMotion";
import { zIndex } from "../../../themes/common";
import roadmap from "../../../data/roadmap";

type NavigationPaneProps = {
  title?: string;
  onNavigate?: (item: string) => void;
};

export default function NavigationPane({
  title,
  onNavigate,
}: NavigationPaneProps) {
  const router = useRouter();
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for mobile
  const { hideTaskbar } = useContext(GlobalContext);
  const mainTransition = useReduceMotion({ duration: 0.6 });
  
  const [activeCategory, setActiveCategory] = useState<string>();

  // Auto-select first category on load
  useEffect(() => {
    if (!activeCategory) {
      const categories = Object.keys(roadmap);
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
        if (roadmap[categories[0]]?.length > 0) {
          onNavigate?.(roadmap[categories[0]][0].title);
        }
      }
    }
  }, [activeCategory, onNavigate]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Auto-select first item in category
    if (roadmap[category]?.length > 0) {
      onNavigate?.(roadmap[category][0].title);
    }
  };

  const handleItemClick = (itemTitle: string) => {
    onNavigate?.(itemTitle);
  };

  // Hide navigation pane on mobile (mobile dropdown is used instead)
  if (isMobile) {
    return null;
  }

  return (
    <motion.aside
      sx={{
        width: ["100%", null, "320px"],
        height: ["auto", null, "100%"],
        borderRight: ["none", null, "1px solid rgba(255, 255, 255, 0.1)"],
        borderBottom: ["1px solid rgba(255, 255, 255, 0.1)", null, "none"],
        overflow: "auto",
        overscrollBehavior: "contain",
        zIndex: zIndex.window,
        p: 4,
      }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={mainTransition}
    >
      <Heading
        variant="h3"
        sx={{
          mb: 4,
          fontSize: ["18px", null, "20px"],
          fontWeight: "600",
          color: "text",
        }}
      >
        Roadmap
      </Heading>

      {Object.entries(roadmap).map(([category, items]) => (
        <Fragment key={category}>
          <Box
            as="button"
            onClick={() => handleCategoryClick(category)}
            sx={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              p: 2,
              borderRadius: "8px",
              mb: 2,
              transition: "all 0.2s ease",
              backgroundColor: activeCategory === category ? "rgba(255, 255, 255, 0.1)" : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            <Text
              sx={{
                fontSize: "16px",
                fontWeight: "600",
                color: "text", // Use consistent text color instead of highlight
                mb: 1,
              }}
            >
              {category}
            </Text>
          </Box>

          {/* Show items when category is active */}
          {activeCategory === category && (
            <Box sx={{ ml: 3, mb: 3 }}>
              {items.map((item) => (
                <Box
                  key={item.title}
                  as="button"
                  onClick={() => handleItemClick(item.title)}
                  sx={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    p: 2,
                    borderRadius: "6px",
                    mb: 1,
                    transition: "all 0.2s ease",
                    backgroundColor: title === item.title ? "rgba(255, 255, 255, 0.08)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  <Text
                    sx={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "text", // Use consistent text color instead of highlight
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Text>
                </Box>
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3, opacity: 0.1 }} />
        </Fragment>
      ))}
    </motion.aside>
  );
}