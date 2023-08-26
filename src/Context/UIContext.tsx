"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { CSSReset, ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/nunito/500.css";
import "animate.css";

const theme = extendTheme({
  fonts: {
    heading: `'Nunito', sans-serif`,
    body: `'Nunito', sans-serif`,
  },
  semanticTokens: {
    colors: {
      "chakra-body-text": { _light: "white" },
      "chakra-placeholder-color": { _light: "white" },
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        lineHeight: "base",
      },
      h2: {
        color: "white",
      },
      label: {
        color: "white",
      },
    },
  },
  colors: {
    gray: {
      400: "#a0aec0",
      600: "#4a5560",
      900: "#1e1e1e",
    },
    red: {
      300: "#ed708e",
      500: "#d83161",
    },
    orange: {
      200: "#f7ae8e",
    },
    yellow: {
      200: "#f8f39e",
    },
    teal: {
      300: "#51cdd8",
    },
    blue: {
      600: "#2b63a3",
    },
    purple: {
      400: "#a2669c",
    },
    tealOrangeGradient: "linear-gradient(to right, #51cdd8, #f7ae8e)",
    bluePurpleGradient: "linear-gradient(to right, #2b63a3, #a2669c)",
    yellowRedGradient: "linear-gradient(to right, #f8f39e, #ed708e)",
    orangeBlueGradient: "linear-gradient(to right, #f7ae8e, #2b63a3)",
    purpleYellowGradient: "linear-gradient(to right, #a2669c, #f8f39e)",
    redTealGradient: "linear-gradient(to right, #ed708e, #51cdd8)",
    purpleRedGradient: "linear-gradient(to right, #a2669c, #ed708e)",
    grayGradient: "linear-gradient(to right, #4a5560, #a0aec0)",
  },
});

import styled from "@emotion/styled";

const FontContainer = styled.div`
  font-family: "Nunito", sans-serif;
`;

export function UIContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <CSSReset />
        <FontContainer>{children}</FontContainer>
      </ChakraProvider>
    </CacheProvider>
  );
}
