import { Box, BoxProps, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

interface CustomLinkProps extends BoxProps {
  href: string;
  linkText: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({ href, linkText, ...rest }) => {
  return (
    <Box
      mx={1}
      transform="skew(10deg)"
      bg={"linear-gradient(to right, #51cdd8, #F7AE8E)"}
      p={1}
      {...rest}
    >
      <ChakraLink
        as={NextLink}
        href={href}
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Box
          bg={"gray.900"}
          w="100%"
          h="100%"
          p={2}
          textAlign="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {linkText}
        </Box>
      </ChakraLink>
    </Box>
  );
};

export default CustomLink;
