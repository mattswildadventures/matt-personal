import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useContext } from "react";
import { ThemeProvider } from "theme-ui";
import { GlobalContext, GlobalProvider } from "../src/contexts/GlobalContext";
import meta from "../src/data/meta";
import theme from "../src/themes";
import "../src/themes/global.css";

// Theme transition overlay component
function ThemeTransitionOverlay() {
  const { isThemeTransitioning, themeTransitionColor } = useContext(GlobalContext);

  return (
    <AnimatePresence>
      {isThemeTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: themeTransitionColor,
            zIndex: 9999,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://use.typekit.net/css?family=adelle-sans:n4,n7,i4,i7" />

        {/* Open Graph / Facebook  */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />

        {/* Twitter  */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={meta.title} />
        <meta property="twitter:description" content={meta.description} />
        <meta property="twitter:image" content={meta.image} />
      </Head>

      <GlobalProvider>
        <>
          {getLayout(<Component {...pageProps} />)}
          <ThemeTransitionOverlay />
          <Analytics />
        </>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default MyApp;
