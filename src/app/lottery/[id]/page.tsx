"use client";

import {
  Box,
  Card,
  CardHeader,
  Container,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useAppContext } from "Context/AppContext";
import { ethers } from "ethers";
import { FC, useEffect } from "react";

type pageProps = {
  params: { id: number };
};

const page: FC<pageProps> = ({ params }) => {
  const { lottery, getLottery, updateDate } = useAppContext();

  useEffect(() => {
    updateDate();
    getLottery(params.id);
  }, []);

  if (!lottery) {
    return <div>Loading...</div>;
  }

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
        <Box px={6}>
          <Flex pt={4} pb={2}>
            <Text>Prize pool :</Text>
            <Spacer />
            <Text>{ethers.utils.formatEther(lottery.prizePool)} ETH</Text>
          </Flex>
          <Flex pb={2}>
            <Text>Bet price :</Text>
            <Spacer />
            <Text>{ethers.utils.formatEther(lottery.betPrice)} ETH</Text>
          </Flex>
          <Flex pb={2}>
            <Text>Bettors :</Text>
            <Spacer />
            <Text>{`${
              lottery.bettors.length
            }/${lottery.maxBettors.toNumber()}`}</Text>
          </Flex>
          <Flex pb={2}>
            <Text>My bets :</Text>
            <Spacer />
            <Text>{`${lottery.numberOfBets}`}</Text>
          </Flex>
          <Flex pb={2}>
            <Text>Creator fee :</Text>
            <Spacer />
            <Text>{lottery.creatorFee.toNumber()} %</Text>
          </Flex>
          <Flex pb={2}>
            <Text>Ending date :</Text>
            <Spacer />
            <Text>
              {new Date(lottery.endingDate.toNumber()).toLocaleString()}
            </Text>
          </Flex>
          <Flex pb={2}>
            <Text>Creator :</Text>
            <Spacer />
            <Text>{lottery.lotteryCreator}</Text>
          </Flex>
        </Box>
      </Card>
    </Container>
  );
};

export default page;
