import { motion } from "framer-motion";
import { useMemo, useContext } from "react";
import { Box, Heading, Text, Badge, Flex } from "theme-ui";
import { GlobalContext } from "../../../contexts/GlobalContext";
import { ThemeMode } from "../../../themes";
import useReduceMotion from "../../../hooks/useReduceMotion";
import mindset from "../../../data/mindset";

type ContentPaneProps = {
  title?: string;
};

export default function ContentPane({ title }: ContentPaneProps) {
  const { theme } = useContext(GlobalContext);
  const currentTheme = theme.val;
  const mainTransition = useReduceMotion({ duration: 0.6 });

  // Theme-specific badge colors
  const getBadgeColors = () => {
    switch (currentTheme) {
      case ThemeMode.Flat: // Default theme
        return {
          backgroundColor: "rgba(44, 62, 80, 0.1)", // Light version of primary
          color: "#2c3e50" // Dark text for contrast
        };
      case ThemeMode.Soft:
        return {
          backgroundColor: "rgba(35, 34, 70, 0.1)", // Light version of soft text
          color: "#232246" // Dark text matching theme
        };
      case ThemeMode.Classic:
        return {
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Light version 
          color: "#000" // Dark text matching theme
        };
      case ThemeMode.Tron:
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)", // Light background
          color: "#fff" // Light text matching theme
        };
      case ThemeMode.LiquidGlass:
        return {
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Light dark background
          color: "#000" // Dark text matching theme
        };
      default:
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "rgba(255, 255, 255, 0.8)"
        };
    }
  };

  const selectedItem = useMemo(() => {
    if (!title) return null;
    
    for (const category of Object.values(mindset)) {
      const item = category.find((item) => item.title === title);
      if (item) return item;
    }
    return null;
  }, [title]);

  if (!selectedItem) {
    return (
      <motion.main
        sx={{
          flex: 1,
          p: 4,
          overflow: "auto",
          overscrollBehavior: "contain",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={mainTransition}
      >
        <Text
          sx={{
            fontSize: "18px",
            color: "muted",
            textAlign: "center",
          }}
        >
          Select a mindset item to view details
        </Text>
      </motion.main>
    );
  }

  return (
    <motion.main
      sx={{
        flex: 1,
        p: [3, null, 4],
        overflow: "auto",
        overscrollBehavior: "contain",
      }}
      data-scroll-container="mindset"
      key={selectedItem.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={mainTransition}
    >
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Flex sx={{ alignItems: "center", gap: 3, mb: 2 }}>
            <Heading
              variant="h2"
              sx={{
                fontSize: ["24px", null, "28px"],
                fontWeight: "700",
                color: "text",
              }}
            >
              {selectedItem.title}
            </Heading>
            <Badge
              sx={{
                ...getBadgeColors(),
                fontSize: "12px",
                fontWeight: "500",
                px: 2,
                py: 1,
              }}
            >
              {selectedItem.timeline}
            </Badge>
          </Flex>
          
          <Text
            sx={{
              fontSize: "16px",
              color: "text",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            {selectedItem.description}
          </Text>
        </Box>

        {/* Remark */}
        {selectedItem.remark && (
          <Box sx={{ mb: 4 }}>
            <Flex
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "0 8px 8px 0",
              }}
            >
              <Box
                sx={{
                  width: "3px",
                  backgroundColor: "primary",
                  flexShrink: 0,
                }}
              />
              <Text
                sx={{
                  fontSize: "15px",
                  color: "muted",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  p: 3,
                }}
              >
                {selectedItem.remark}
              </Text>
            </Flex>
          </Box>
        )}

        {/* Principles */}
        {selectedItem.principles && selectedItem.principles.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Heading
              variant="h4"
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                color: "text",
                mb: 3,
              }}
            >
              Core Principles
            </Heading>
            <Box sx={{ pl: 2 }}>
              {selectedItem.principles.map((principle, index) => (
                <Flex key={index} sx={{ alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      width: "6px",
                      height: "6px",
                      backgroundColor: "primary",
                      borderRadius: "50%",
                      mt: "8px",
                      mr: 3,
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    sx={{
                      fontSize: "15px",
                      color: "text",
                      lineHeight: 1.6,
                    }}
                  >
                    {principle}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
        )}

        {/* Practices */}
        {selectedItem.practices && (
          <Box sx={{ mb: 4 }}>
            <Heading
              variant="h4"
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                color: "text",
                mb: 3,
              }}
            >
              Key Practices
            </Heading>
            <Box sx={{ pl: 2 }}>
              {Array.isArray(selectedItem.practices) ? (
                selectedItem.practices.map((practice, index) => (
                  <Flex key={index} sx={{ alignItems: "flex-start", mb: 2 }}>
                    <Box
                      sx={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "secondary",
                        borderRadius: "50%",
                        mt: "8px",
                        mr: 3,
                        flexShrink: 0,
                      }}
                    />
                    <Text
                      sx={{
                        fontSize: "15px",
                        color: "text",
                        lineHeight: 1.6,
                      }}
                    >
                      {practice}
                    </Text>
                  </Flex>
                ))
              ) : (
                <Text
                  sx={{
                    fontSize: "15px",
                    color: "text",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedItem.practices}
                </Text>
              )}
            </Box>
          </Box>
        )}

        {/* Links */}
        {selectedItem.links && Object.keys(selectedItem.links).length > 0 && (
          <Box sx={{ mt: 5 }}>
            <Heading
              variant="h4"
              sx={{
                fontSize: "18px",
                fontWeight: "600",
                color: "text",
                mb: 3,
              }}
            >
              Related Resources
            </Heading>
            <Flex sx={{ gap: 3, flexWrap: "wrap" }}>
              {Object.values(selectedItem.links).map((link: any, index) => {
                const [title, url] = link;
                return (
                <Box
                  key={index}
                  as="a"
                  {...({ href: url } as any)}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "text",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      color: "text",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "4px",
                      height: "4px",
                      backgroundColor: "primary",
                      borderRadius: "50%",
                    }}
                  />
                  {title}
                </Box>
                );
              })}
            </Flex>
          </Box>
        )}
      </Box>
    </motion.main>
  );
}