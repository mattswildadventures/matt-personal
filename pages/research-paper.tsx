import { useRouter } from "next/router";
import { useState } from "react";
import { Flex, Box } from "theme-ui";
import Window from "../src/components/molecules/Window";
import Layout from "../src/components/pages/Layout";
import ContentPane from "../src/components/pages/research/ContentPane";
import NavigationPane from "../src/components/pages/research/NavigationPane";
import MobileDropdownNav from "../src/components/pages/research/MobileDropdownNav";
import useInBreakpoint from "../src/hooks/useInBreakpoint";
import { getRoute } from "../src/misc/routes";

export default function ResearchPaper(): JSX.Element {
  const { asPath } = useRouter();
  const [activeItem, setActiveItem] = useState<string>();
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for mobile

  return (
    <Window title={getRoute(asPath)?.title + ' - Mindset Architecture & Construction'}>
      <Flex sx={{
        flex: 1,
        minHeight: 0,
        flexDirection: isMobile ? "column" : "row"
      }}>
        <NavigationPane title={activeItem} onNavigate={(item) => setActiveItem(item)} />
        {isMobile && (
          <Box sx={{ p: "0 16px 16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <MobileDropdownNav title={activeItem} onNavigate={(item) => setActiveItem(item)} />
          </Box>
        )}
        <ContentPane title={activeItem} />
      </Flex>
    </Window>
  );
}

ResearchPaper.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
