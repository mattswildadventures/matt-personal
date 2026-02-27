import { AnimatePresence } from "framer-motion";
import { ThemeUICSSObject } from "theme-ui";
import { fade } from "../../../animations/fade";
import researchInsights, { ResearchPrinciple } from "../../../data/researchInsights";
import useMatchTheme from "../../../hooks/useMatchTheme";

import { ThemeMode } from "../../../themes";
import { MotionBox } from "../../atoms/Container";
import { H2, P, SubTitle } from "../../atoms/Typography";

function Principles({ principles }: { principles: ResearchPrinciple[] }) {
  return (
    <div sx={{
      mt: 4,
      pt: 3,
      borderTop: "1px solid",
      borderColor: "rgba(255, 255, 255, 0.08)",
    }}>
      <div sx={{
        fontSize: 0,
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
        color: "muted",
        mb: 3,
      }}>
        Key Principles
      </div>
      {principles.map((principle, i) => (
        <div
          key={i}
          sx={{
            mb: 3,
            pl: 3,
            borderLeft: "2px solid",
            borderColor: "primary",
          }}
        >
          <div sx={{ fontWeight: 600, fontSize: 1, mb: 1 }}>
            {principle.name}
          </div>
          <div sx={{ fontSize: 1, color: "muted", lineHeight: 1.6 }}>
            {principle.description}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContentPane({ title }: { title?: string }) {
  const alignment: ThemeUICSSObject = { textAlign: ["center", null, "unset"] };
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);
  let content = (
    <MotionBox {...fade} sx={{ color: "muted", textAlign: "center" }}>
      Select a topic to explore
    </MotionBox>
  );

  if (title) {
    const insight = Object.values(researchInsights)
      .flat()
      .find((item) => item.title === title);

    if (insight?.isCover) {
      // Cover layout: image only
      content = (
        <MotionBox key={title} {...fade} sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}>
          <div sx={{
            width: "100%",
            height: "100%",
            minHeight: 300,
            backgroundImage: "url(/images/research-cover.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 8,
          }} />
        </MotionBox>
      );
    } else if (insight) {
      // Standard insight layout with optional principles
      content = (
        <MotionBox key={title} {...fade} sx={{ textAlign: "left" }}>
          <H2 style={alignment}>{insight.title}</H2>
          <SubTitle style={{ ...alignment, fontStyle: "italic" }}>{insight.subtitle}</SubTitle>
          {insight.content.map((paragraph, i) => (
            <P key={i}>{paragraph}</P>
          ))}
          {insight.principles && insight.principles.length > 0 && (
            <Principles principles={insight.principles} />
          )}
        </MotionBox>
      );
    }
  }

  return (
    <div
      sx={{
        bg: (isTronTheme || isCyberpunkTheme) ? "transparent" : "background",
        px: 5,
        py: 4,
        flex: 1,
        overflow: "auto",
        overscrollBehavior: "contain",
        zIndex: 1,
      }}
    >
      <AnimatePresence exitBeforeEnter>{content}</AnimatePresence>
    </div>
  );
}
