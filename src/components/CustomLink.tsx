import { Box, BoxProps, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface CustomLinkProps extends BoxProps {
  href: string;
  linkText: string;
  shadowColor: string;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  linkText,
  shadowColor,
  ...rest
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Box
      mx={1}
      bg={"linear-gradient(to right, #51cdd8, #F7AE8E)"}
      p={1}
      boxShadow={
        isActive
          ? shadowColor === "tealOrange"
            ? "0px 10px 10px -5px #51cdd8, 0px -10px 10px -5px #F7AE8E"
            : shadowColor === "bluePurple"
            ? "0px 10px 10px -5px #2b63a3, 0px -10px 10px -5px #a2669c"
            : "0px 10px 10px -5px #f8f39e, 0px -10px 10px -5px #ed708e"
          : "none"
      }
      _hover={{
        boxShadow: "0px 10px 10px -5px white, 0px -10px 10px -5px white",
      }}
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
