"use client";

import {
  Box,
  Button,
  Card,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useAppContext } from "Context/AppContext";
import { Field, Form, Formik } from "formik";
import { ethers } from "ethers";
import { FC, useEffect } from "react";

type FormValue = {
  password: string;
};

type pageProps = {
  params: { id: number };
};

const page: FC<pageProps> = ({ params }) => {
  const { date, lottery, bet, claimPrize, getLottery, updateDate } =
    useAppContext();

  useEffect(() => {
    updateDate();
    getLottery(params.id);
  }, []);

  const initialValues: FormValue = {
    password: "",
  };

  const onSubmit = (value: typeof initialValues) => {
    if (value.password && lottery) {
      bet(
        lottery.id.toNumber(),
        ethers.utils.formatBytes32String(value.password)
      );
    }
  };

  const validate = (values: FormValue): Partial<FormValue> => {
    const errors: Partial<FormValue> = {};

    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };

  const handleOnClickBet = (lotteryId: number) => {
    bet(lotteryId, ethers.utils.formatBytes32String("0"));
  };

  const handleOnClickClaim = (lotteryId: number) => {
    claimPrize(lotteryId);
  };

  if (!lottery) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxW={"container.md"}>
      <Card bgColor={"transparent"} boxShadow={"none"}>
        <CardHeader>
          <Flex>
            <Heading
              size="md"
              color={lottery.currentState === 1 ? "gray.300" : "white"}
            >
              Lottery {params.id}
            </Heading>
            <Spacer />
            <Heading
              size="md"
              color={lottery.privateLottery ? "#f8f39e" : "#51cdd8"}
            >
              {lottery.privateLottery ? "Private" : "Public"}
            </Heading>
          </Flex>
        </CardHeader>
        <Box
          bg={
            lottery.currentState === 1
              ? "linear-gradient(to right, #4A5568, #A0AEC0)"
              : "linear-gradient(to right, #a2669c, #ed708e)"
          }
          transform="skew(10deg)"
          w="100%"
          h={1}
        />
        <Box p={12} color={lottery.currentState === 1 ? "gray.300" : "white"}>
          <Flex pb={4} transform="skew(10deg)">
            <Text>Prize pool :</Text>
            <Spacer />
            <Text>{ethers.utils.formatEther(lottery.prizePool)} ETH</Text>
          </Flex>
          <Flex pb={4} transform="skew(10deg)">
            <Text>Bet price :</Text>
            <Spacer />
            <Text>{ethers.utils.formatEther(lottery.betPrice)} ETH</Text>
          </Flex>
          <Flex pb={4} transform="skew(10deg)">
            <Text>Bettors :</Text>
            <Spacer />
            <Text>{`${
              lottery.bettors.length
            }/${lottery.maxBettors.toNumber()}`}</Text>
          </Flex>
          <Flex pb={4} transform="skew(10deg)">
            <Text>My bets :</Text>
            <Spacer />
            <Text>{`${lottery.numberOfBets}`}</Text>
          </Flex>
          <Flex pb={4} transform="skew(10deg)">
            <Text>Creator fee :</Text>
            <Spacer />
            <Text>{lottery.creatorFee.toNumber()} %</Text>
          </Flex>
          <Flex pb={4} transform="skew(10deg)">
            <Text>Ending date :</Text>
            <Spacer />
            <Text>
              {new Date(lottery.endingDate.toNumber()).toLocaleString()}
            </Text>
          </Flex>
          <Flex pb={10} transform="skew(10deg)">
            <Text>Creator :</Text>
            <Spacer />
            <Text>{lottery.lotteryCreator}</Text>
          </Flex>

          {lottery.currentState === 1 ? (
            <Flex justifyContent="center">
              <Text fontWeight="bold" transform="skew(10deg)">
                The lottery is finished
              </Text>
            </Flex>
          ) : date > new Date(lottery.endingDate.toNumber()) &&
            lottery.bettors.length > 0 ? (
            <Flex justifyContent="flex-end">
              <Button
                variant="primary"
                transform="skew(10deg)"
                borderRadius={0}
                onClick={() => handleOnClickClaim(lottery.id.toNumber())}
              >
                Claim prize
              </Button>
            </Flex>
          ) : lottery.privateLottery ? (
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validate={validate}
            >
              {(formik) => {
                return (
                  <Form>
                    <Field name="password">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.password && form.touched.password
                          }
                        >
                          <Flex mb={8}>
                            <FormLabel htmlFor="password" flex="30%">
                              Password :
                            </FormLabel>
                            <Spacer />
                            <Input
                              {...field}
                              id="password"
                              type="password"
                              placeholder="Enter password"
                              flex="20%"
                              borderRadius={0}
                              focusBorderColor="teal.300"
                            />
                            <FormErrorMessage
                              transform="skew(10deg)"
                              pos="absolute"
                              left="66%"
                              top="40px"
                            >
                              {form.errors.password}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>
                    <Flex justifyContent="flex-end">
                      <Button
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                        borderRadius={0}
                        transform="skew(10deg)"
                        variant="primary"
                      >
                        Bet
                      </Button>
                    </Flex>
                  </Form>
                );
              }}
            </Formik>
          ) : (
            <Flex justifyContent="flex-end">
              <Button
                variant="primary"
                transform="skew(10deg)"
                borderRadius={0}
                onClick={() => handleOnClickBet(lottery.id.toNumber())}
              >
                Bet
              </Button>
            </Flex>
          )}
        </Box>
        <Box
          bg={
            lottery.currentState === 1
              ? "linear-gradient(to right, #4A5568, #A0AEC0)"
              : "linear-gradient(to right, #a2669c, #ed708e)"
          }
          transform="skew(10deg)"
          w="100%"
          h={1}
        />
      </Card>
    </Container>
  );
};

export default page;
