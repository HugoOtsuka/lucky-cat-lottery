import React from "react";
import { Spinner, Box, Image, Flex } from "@chakra-ui/react";

const Loading: React.FC = () => {
  return (
    <Flex minHeight="100vh" alignItems="center" justifyContent="center">
      <Box textAlign="center">
        <Image
          className="animate__animated animate__pulse animate__infinite"
          src="/images/LuckyCat.png"
          alt="logo"
          boxSize="150px"
          objectFit="contain"
          mx="auto"
        />
        <Spinner size="md" mt={4} />
      </Box>
    </Flex>
  );
};

export default Loading;
