"use client";
import { Box, Container, Heading } from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import { useEffect } from "react";
import LotteriesList from "components/LotteriesList";

export default function Page() {
  const { date, userLotteries, updateDate, getUserLotteries } =
    useBlockchainContext();

  useEffect(() => {
    updateDate();
    getUserLotteries();
  }, []);

  return (
    <Container
      className="animate__animated animate__fadeIn"
      maxW={"container.lg"}
      bgColor={"transparent"}
    >
      <Box p="20px">
        <Heading size="md">My lotteries</Heading>
      </Box>
      <Box bg={"bluePurpleGradient"} w="100%" h={1} mb={8} />
      <LotteriesList
        lotteries={userLotteries}
        date={date}
        inMyLotteries={true}
        inMyBets={false}
      />
    </Container>
  );
}
