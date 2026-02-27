import React from "react";
import work from "../../../data/work";
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
    <div sx={{ minWidth: 200, overflow: "auto", p: 4 }}>
      {Object.keys(work).map((category, i) => (
        <React.Fragment key={i}>
          <H3>{category}</H3>
          <List sx={{ mb: 5, display: ["grid", null, "block"], gridTemplateColumns: "1fr 1fr 1fr" }}>
            {work[category].map((job, j) => (
              <NavigationPaneItem
                key={j}
                icon="folder"
                text={job.title}
                isActive={title === job.title}
                onClick={() => onNavigate(job.title)}
              />
            ))}
          </List>
        </React.Fragment>
      ))}
    </div>
  );
}
