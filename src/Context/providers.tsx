"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource/nunito/500.css";

const theme = extendTheme({
  fonts: {
    heading: `'Nunito', sans-serif`,
    body: `'Nunito', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        lineHeight: "base",
      },
      h2: {
        color: "white",
        transform: "skew(10deg)",
      },
      label: {
        color: "white",
        transform: "skew(10deg)",
      },
    },
  },
  semanticTokens: {
    colors: {
      "chakra-body-text": { _light: "white" },
      "chakra-placeholder-color": { _light: "white" },
    },
  },
  colors: {
    gray: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1E222D",
      900: "#1E1E1E",
    },
    red: {
      50: "#FFF5F5",
      100: "#FED6D6",
      200: "#FEB0B0",
      300: "#ED708E",
      400: "#E75477",
      500: "#D83161",
      600: "#BE2B54",
      700: "#95284B",
      800: "#7A2142",
      900: "#5F1838",
    },
    orange: {
      50: "#FFF9EE",
      100: "#FEE7C1",
      200: "#F7AE8E",
      300: "#F4755B",
      400: "#EB4D3F",
      500: "#DC392C",
      600: "#C62928",
      700: "#99211D",
      800: "#781B19",
      900: "#621512",
    },
    yellow: {
      50: "#FFFFF0",
      100: "#FEFDBE",
      200: "#F8F39E",
      300: "#F2EA7D",
      400: "#E8E05E",
      500: "#D9C43E",
      600: "#BFA42E",
      700: "#A48C22",
      800: "#837314",
      900: "#6A5C0E",
    },
    teal: {
      50: "#E6FFFA",
      100: "#B3F6F1",
      200: "#7DE7E0",
      300: "#51CDD8",
      400: "#3FACB7",
      500: "#399CA7",
      600: "#338A97",
      700: "#2C7987",
      800: "#266E7D",
      900: "#206372",
    },
    blue: {
      50: "#EBF8FF",
      100: "#BEDFF8",
      200: "#90C6F4",
      300: "#63A9ED",
      400: "#4285E2",
      500: "#316DCE",
      600: "#2B63A3",
      700: "#2D5582",
      800: "#2B4765",
      900: "#1A365D",
    },
    purple: {
      50: "#FAF5FF",
      100: "#E9D8FD",
      200: "#D6BCFA",
      300: "#B794F4",
      400: "#A2669C",
      500: "#8D417B",
      600: "#782D5B",
      700: "#62263F",
      800: "#511C2F",
      900: "#3C1521",
    },
    primary: "#51cdd8",
    secondary: "#2b63a3",
    highlight: "#a2669c",
    warning: "#f7ae8e",
    danger: "#ed708e",
  },
});

import styled from "@emotion/styled";

const FontContainer = styled.div`
  font-family: "Nunito", sans-serif;
`;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <FontContainer>{children}</FontContainer>
      </ChakraProvider>
    </CacheProvider>
  );
}
