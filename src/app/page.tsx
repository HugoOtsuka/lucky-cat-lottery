"use client";
import { Box, Container, Heading } from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import { useEffect } from "react";
import LotteriesList from "components/LotteriesList";

export default function Home() {
  const { date, activePublicLotteries, updateDate, getActivePublicLotteries } =
    useBlockchainContext();

  useEffect(() => {
    updateDate();
    getActivePublicLotteries();
  }, []);

  return (
    <Container
      className="animate__animated animate__fadeIn"
      maxW={"container.lg"}
      bgColor={"transparent"}
    >
      <Box p="20px">
        <Heading size="md">All lotteries</Heading>
      </Box>
      <Box
        bg={"linear-gradient(to right, #51cdd8, #F7AE8E)"}
        w="100%"
        h={1}
        mb={8}
      />
      <LotteriesList
        lotteries={activePublicLotteries}
        date={date}
        inMyLotteries={false}
        inMyBets={false}
      />
    </Container>
  );
}
