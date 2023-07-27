"use client";

import { Box, Card, CardHeader, Container, Heading } from "@chakra-ui/react";
import { FC } from "react";

type pageProps = {
  params: { id: number };
};

const page: FC<pageProps> = ({ params }) => {
  return (
    <Container maxW={"container.lg"}>
      <Card bgColor={"transparent"} boxShadow={"none"}>
        <CardHeader>
          <Heading size="md">Lottery {params.id}</Heading>
        </CardHeader>
        <Box
          bg={"linear-gradient(to right, #a2669c, #ed708e)"}
          transform="skew(10deg)"
          w="100%"
          h={1}
        />
      </Card>
    </Container>
  );
};

export default page;
