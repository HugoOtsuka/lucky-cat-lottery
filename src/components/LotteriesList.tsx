"use client";
import { Box, Card, Divider, Flex, Spacer, Text } from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { Lottery } from "components/LotteryInterface";
import CustomButton from "./CustomButton";

type LotteriesListProps = {
  lotteries: Lottery[];
  date: Date;
  inMyLotteries: boolean;
  inMyBets: boolean;
};

export default function LotteriesList({
  lotteries,
  date,
  inMyLotteries,
  inMyBets,
}: LotteriesListProps) {
  const { bet, claimPrize } = useBlockchainContext();
  const router = useRouter();

  const handleOnClickBet = (lotteryId: number) => {
    bet(lotteryId, ethers.utils.formatBytes32String("0"));
  };

  const handleOnClickClaim = (lotteryId: number) => {
    claimPrize(lotteryId);
  };

  return (
    <>
      {lotteries && lotteries.length > 0 ? (
        <>
          {lotteries.map((lottery: any, index: number) => (
            <Card
              key={lottery.id}
              className={
                "animate__animated animate__fadeInLeft animate__faster"
              }
              bg={
                lottery.currentState === 1
                  ? "linear-gradient(to right, #4A5568, #A0AEC0)"
                  : index % 3 === 0
                  ? "linear-gradient(to right, #2b63a3, #a2669c)"
                  : index % 3 === 1
                  ? "linear-gradient(to right, #f8f39e, #ed708e)"
                  : "linear-gradient(to right, #51cdd8, #F7AE8E)"
              }
              boxShadow={"none"}
              borderRadius={0}
              p={1}
              mb={8}
              mx={40}
            >
              <Flex direction={"column"} bgColor={"gray.900"} p={4}>
                <Box
                  onClick={() => router.push(`/lottery/${lottery.id}`)}
                  cursor="pointer"
                >
                  <Flex justify={"space-between"} pb={4}>
                    <Flex>
                      <Text
                        color={
                          lottery.currentState === 1 ? "gray.300" : "primary"
                        }
                      >
                        Lottery
                      </Text>
                      <Text
                        color={
                          lottery.currentState === 1 ? "gray.300" : "warning"
                        }
                      >
                        {"\u00A0"}
                        {lottery.id.toNumber()}
                      </Text>
                    </Flex>
                    {lottery.currentState === 1 ? (
                      <Text fontWeight="bold" color={"gray.300"}>
                        Finished
                      </Text>
                    ) : null}
                    {inMyLotteries || inMyBets ? (
                      <Text
                        color={lottery.privateLottery ? "#f8f39e" : "#51cdd8"}
                      >
                        {lottery.privateLottery ? "Private" : "Public"}
                      </Text>
                    ) : null}
                  </Flex>
                  <Divider />
                  <Box
                    px={6}
                    color={lottery.currentState === 1 ? "gray.300" : "white"}
                  >
                    <Flex pt={4} pb={2}>
                      <Text>Prize pool :</Text>
                      <Spacer />
                      <Text>
                        {ethers.utils.formatEther(lottery.prizePool)} ETH
                      </Text>
                    </Flex>
                    <Flex pb={2}>
                      <Text>Bet price :</Text>
                      <Spacer />
                      <Text>
                        {ethers.utils.formatEther(lottery.betPrice)} ETH
                      </Text>
                    </Flex>
                    <Flex pb={2}>
                      <Text>Bettors :</Text>
                      <Spacer />
                      <Text>{`${
                        lottery.bettors.length
                      }/${lottery.maxBettors.toNumber()}`}</Text>
                    </Flex>
                    <Flex pb={2}>
                      <Text>Creator fee :</Text>
                      <Spacer />
                      <Text>{lottery.creatorFee.toNumber()} %</Text>
                    </Flex>
                    <Flex pb={4}>
                      <Text>Ending date :</Text>
                      <Spacer />
                      <Text>
                        {new Date(
                          lottery.endingDate.toNumber()
                        ).toLocaleString()}
                      </Text>
                    </Flex>
                  </Box>
                </Box>
                {lottery.currentState === 0 ? (
                  date > new Date(lottery.endingDate.toNumber()) &&
                  lottery.bettors.length > 0 ? (
                    <Flex justifyContent="flex-end">
                      <CustomButton
                        buttonText="Claim prize"
                        colorTheme="yellowRed"
                        onClick={() => handleOnClickClaim(lottery.id)}
                      />
                    </Flex>
                  ) : !lottery.privateLottery ? (
                    <Flex justifyContent="flex-end">
                      <CustomButton
                        buttonText="Bet"
                        colorTheme="tealOrange"
                        w={"75px"}
                        onClick={() => handleOnClickBet(lottery.id)}
                      />
                    </Flex>
                  ) : null
                ) : null}
              </Flex>
            </Card>
          ))}
        </>
      ) : (
        <Flex
          className="animate__animated animate__fadeInLeft animate__faster"
          justifyContent="center"
        >
          <Card
            bg={"linear-gradient(to right, #a2669c, #ed708e)"}
            boxShadow={"none"}
            borderRadius={0}
            p={1}
            minW={"300px"}
          >
            <Flex bgColor={"gray.900"} p={4} justifyContent="center">
              <Text fontSize={20}>No lottery yet</Text>
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
}
