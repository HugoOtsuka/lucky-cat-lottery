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
          {lotteries.map((lottery: Lottery, index: number) => (
            <Card
              key={lottery.id.toNumber()}
              className={
                "animate__animated animate__fadeInLeft animate__faster"
              }
              bg={
                lottery.currentState === 1
                  ? "grayGradient"
                  : index % 3 === 0
                  ? "bluePurpleGradient"
                  : index % 3 === 1
                  ? "yellowRedGradient"
                  : "tealOrangeGradient"
              }
              boxShadow={"none"}
              borderRadius={0}
              p={1}
              mb={8}
              mx={{ base: 0, md: 40, sm: 0 }}
              fontSize={{ base: "sm", md: "md", sm: "sm" }}
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
                          lottery.currentState === 1 ? "gray.300" : "teal.300"
                        }
                      >
                        Lottery
                      </Text>
                      <Text
                        color={
                          lottery.currentState === 1 ? "gray.300" : "orange.200"
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
                        color={
                          lottery.privateLottery ? "yellow.200" : "teal.300"
                        }
                      >
                        {lottery.privateLottery ? "Private" : "Public"}
                      </Text>
                    ) : null}
                  </Flex>
                  <Divider />
                  <Box
                    px={{ base: 0, md: 6, sm: 0 }}
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
                        fontSize={{ base: "sm", md: "md", sm: "sm" }}
                        onClick={() =>
                          handleOnClickClaim(lottery.id.toNumber())
                        }
                      />
                    </Flex>
                  ) : !lottery.privateLottery ? (
                    <Flex justifyContent="flex-end">
                      <CustomButton
                        buttonText="Bet"
                        colorTheme="tealOrange"
                        w={"75px"}
                        fontSize={{ base: "sm", md: "md", sm: "sm" }}
                        onClick={() => handleOnClickBet(lottery.id.toNumber())}
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
            bg={"purpleRedGradient"}
            boxShadow={"none"}
            borderRadius={0}
            p={1}
            minW={{ base: "250px", md: "300px", sm: "250px" }}
          >
            <Flex bgColor={"gray.900"} p={4} justifyContent="center">
              <Text fontSize={{ base: 18, md: 20, sm: 18 }}>
                No lottery yet
              </Text>
            </Flex>
          </Card>
        </Flex>
      )}
    </>
  );
}
