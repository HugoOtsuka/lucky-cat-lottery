"use client";
import { Box, Container, Heading } from "@chakra-ui/react";
import { useAppContext } from "Context/BlockchainContext";
import { useEffect } from "react";
import LotteriesList from "components/LotteriesList";

export default function Page() {
  const { date, userBets, updateDate, getUserBets } = useAppContext();

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
        bg={"linear-gradient(to right, #a2669c, #ed708e)"}
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
