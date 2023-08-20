import { Box, Button, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  buttonText: string;
  colorTheme: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  buttonText,
  colorTheme,
  ...rest
}) => {
  return (
    <Button
      borderRadius={0}
      fontWeight={"normal"}
      color={"white"}
      bg={
        colorTheme === "yellowRed"
          ? "linear-gradient(to right, #f8f39e, #ed708e)"
          : colorTheme === "bluePurple"
          ? "linear-gradient(to right, #2b63a3, #a2669c)"
          : "linear-gradient(to right, #51cdd8, #F7AE8E)"
      }
      p={1}
      _hover={{
        transition: "box-shadow 0.2s",
        boxShadow: "0px 10px 10px -5px white, 0px -10px 10px -5px white",
      }}
      _active={{
        boxShadow:
          colorTheme === "yellowRed"
            ? "0px 10px 10px -5px #f8f39e, 0px -10px 10px -5px #ed708e"
            : colorTheme === "bluePurple"
            ? "0px 10px 10px -5px #2b63a3, 0px -10px 10px -5px #a2669c"
            : "0px 10px 10px -5px #51cdd8, 0px -10px 10px -5px #F7AE8E",
      }}
      {...rest}
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
        {buttonText}
      </Box>
    </Button>
  );
};

export default CustomButton;
