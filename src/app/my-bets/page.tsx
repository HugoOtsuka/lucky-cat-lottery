"use client";
import { Box, Container, Heading } from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import { useEffect } from "react";
import LotteriesList from "components/LotteriesList";

export default function Page() {
  const { date, userBets, updateDate, getUserBets } = useBlockchainContext();

  useEffect(() => {
    updateDate();
    getUserBets();
  }, []);

  return (
    <Container maxW={"container.lg"} bgColor={"transparent"}>
      <Box p="20px">
        <Heading size="md">My bets</Heading>
      </Box>
      <Box
        bg={"linear-gradient(to right, #f8f39e, #ed708e)"}
        transform="skew(10deg)"
        w="100%"
        h={1}
        mb={8}
      />
      <LotteriesList
        lotteries={userBets}
        date={date}
        inMyLotteries={false}
        inMyBets={true}
      />
    </Container>
  );
}
