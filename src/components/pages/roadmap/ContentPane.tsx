import { motion } from "framer-motion";
import { useMemo } from "react";
import { Box, Heading, Text, Badge, Flex } from "theme-ui";
import useReduceMotion from "../../../hooks/useReduceMotion";
import roadmap from "../../../data/roadmap";

type ContentPaneProps = {
  title?: string;
};

export default function ContentPane({ title }: ContentPaneProps) {
  const mainTransition = useReduceMotion({ duration: 0.6 });

  const selectedItem = useMemo(() => {
    if (!title) return null;
    
    for (const category of Object.values(roadmap)) {
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
          Select a roadmap goal to view details
        </Text>
      </motion.main>
    );
  }

  return (
    <motion.main
      sx={{
        flex: 1,
        p: 4,
        overflow: "auto",
      }}
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
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "text",
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

        {/* Milestones */}
        {selectedItem.milestones && selectedItem.milestones.length > 0 && (
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
              Key Milestones
            </Heading>
            <Box sx={{ pl: 2 }}>
              {selectedItem.milestones.map((milestone, index) => (
                <Flex key={index} sx={{ alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "primary",
                      borderRadius: "50%",
                      mt: "6px",
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
                    {milestone}
                  </Text>
                </Flex>
              ))}
            </Box>
          </Box>
        )}

        {/* Objectives */}
        {selectedItem.objectives && (
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
              Core Objectives
            </Heading>
            <Box sx={{ pl: 2 }}>
              {Array.isArray(selectedItem.objectives) ? (
                selectedItem.objectives.map((objective, index) => (
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
                      {objective}
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
                  {selectedItem.objectives}
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