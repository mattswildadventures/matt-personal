import React from "react";
import researchInsights from "../../../data/researchInsights";
import { List } from "../../atoms/Container";
import NavigationPaneItem from "../../atoms/NavigationPaneItem";
import { H3 } from "../../atoms/Typography";
import useInBreakpoint from "../../../hooks/useInBreakpoint";

type NavigationPaneProps = {
  title?: string;
  onNavigate: (item: string) => void;
};

export default function NavigationPane({ title, onNavigate }: NavigationPaneProps) {
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for mobile

  // Hide navigation pane on mobile (mobile dropdown is used instead)
  if (isMobile) {
    return null;
  }

  return (
    <div sx={{ minWidth: 200 }}>
      {Object.keys(researchInsights).map((category, i) => (
        <React.Fragment key={i}>
          <H3>{category}</H3>
          <List sx={{ mb: 5, display: ["grid", null, "block"], gridTemplateColumns: "1fr 1fr 1fr" }}>
            {researchInsights[category].map((insight, j) => (
              <NavigationPaneItem
                key={j}
                icon={["PiFileText", "PiFolderOpen"]}
                text={insight.title}
                isActive={title === insight.title}
                onClick={() => onNavigate(insight.title)}
              />
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );
}