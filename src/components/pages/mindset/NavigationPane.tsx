import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState, useRef } from "react";
import { Box, Divider, Flex, Heading, Text } from "theme-ui";
import { GlobalContext } from "../../../contexts/GlobalContext";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useReduceMotion from "../../../hooks/useReduceMotion";
import { zIndex } from "../../../themes/common";
import mindset from "../../../data/mindset";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionValue(0);
  
  // Create rubber band collapse effect - collapses faster than scroll
  const navHeight = useTransform(scrollY, [0, 100], [300, 60]); // Collapses to compact height quickly
  const navOpacity = useTransform(scrollY, [0, 80], [1, 0.3]); // Fades out categories
  const titleScale = useTransform(scrollY, [0, 60], [1, 0.85]); // Shrinks title
  const contentOpacity = useTransform(scrollY, [0, 40], [1, 0]); // Hides content even faster

  // Auto-select first category on load
  useEffect(() => {
    if (!activeCategory) {
      const categories = Object.keys(mindset);
      if (categories.length > 0) {
        setActiveCategory(categories[0]);
        if (mindset[categories[0]]?.length > 0) {
          onNavigate?.(mindset[categories[0]][0].title);
        }
      }
    }
  }, [activeCategory, onNavigate]);

  // Scroll listener for rubber band effect (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollContainer = document.querySelector('[data-scroll-container="mindset"]');
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        // Update motion value - this drives all our transforms
        scrollY.set(scrollTop);
      }
    };

    const scrollContainer = document.querySelector('[data-scroll-container="mindset"]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile, scrollY]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Auto-select first item in category
    if (mindset[category]?.length > 0) {
      onNavigate?.(mindset[category][0].title);
    }
  };

  const handleItemClick = (itemTitle: string) => {
    onNavigate?.(itemTitle);
  };

  // Hide navigation pane on mobile - dropdown will handle navigation
  if (isMobile) {
    return null;
  }

  return (
    <motion.aside
      sx={{
        width: "320px",
        height: "100%",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        overflow: "auto",
        overscrollBehavior: "contain",
        touchAction: "pan-y",
        zIndex: zIndex.window,
        p: 4,
      }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={mainTransition}
    >
      <div>
        <Heading
          variant="h3"
          sx={{
            mb: 4,
            fontSize: "20px",
            fontWeight: "600",
            color: "text",
          }}
        >
          My Mindset
        </Heading>
      </div>

      <div>
        {Object.entries(mindset).map(([category, items]) => (
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
                  color: "text",
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
                        color: "text",
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
      </div>
    </motion.aside>
  );
}