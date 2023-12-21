"use client";
import {
  Box,
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
  useMediaQuery,
} from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import { Field, Form, Formik } from "formik";
import { ethers } from "ethers";
import { FC, useEffect } from "react";
import CustomButton from "components/CustomButton";
import Loading from "components/Loading";

type FormValue = {
  password: string;
};

type pageProps = {
  params: { id: number };
};

const page: FC<pageProps> = ({ params }) => {
  const [isMobile] = useMediaQuery("(max-width: 480px)");
  const { date, lottery, bet, claimPrize, getLottery, updateDate } =
    useBlockchainContext();

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
    return <Loading />;
  }

  return (
    <Container
      className="animate__animated animate__fadeIn"
      maxW={"container.md"}
    >
      <Card bgColor={"transparent"} boxShadow={"none"}>
        <CardHeader>
          <Flex>
            <Heading
              size="md"
              color={lottery.currentState === 1 ? "gray.300" : "white"}
            >
              Lottery ID: {params.id}
            </Heading>
            <Spacer />
            <Heading
              size="md"
              color={lottery.privateLottery ? "yellow.200" : "teal.300"}
            >
              {lottery.privateLottery ? "Private" : "Public"}
            </Heading>
          </Flex>
        </CardHeader>
        <Box
          bg={lottery.currentState === 1 ? "grayGradient" : "purpleRedGradient"}
          w="100%"
          h={1}
        />
        <Box
          p={{ base: "30px 0px", md: 12, sm: "30px 0px" }}
          color={lottery.currentState === 1 ? "gray.300" : "white"}
        >
          <Flex pb={4}>
            <Text flex={"35%"}>Prize pool :</Text>

            <Flex justifyContent="flex-end" flex={"65%"}>
              <Text>{ethers.utils.formatEther(lottery.prizePool)} MATIC</Text>
            </Flex>
          </Flex>
          <Flex pb={4}>
            <Text flex={"35%"}>Bet price :</Text>

            <Flex justifyContent="flex-end" flex={"65%"}>
              <Text>{ethers.utils.formatEther(lottery.betPrice)} MATIC</Text>
            </Flex>
          </Flex>
          <Flex pb={4}>
            <Text flex={"35%"}>Bettors :</Text>

            <Flex justifyContent="flex-end" flex={"65%"}>
              <Text>{`${
                lottery.bettors.length
              }/${lottery.maxBettors.toNumber()}`}</Text>
            </Flex>
          </Flex>
          <Flex pb={4}>
            <Text flex={"35%"}>My bets :</Text>

            <Flex justifyContent="flex-end" flex={"65%"}>
              <Text>{`${lottery.numberOfBets}`}</Text>
            </Flex>
          </Flex>
          <Flex pb={4}>
            <Text flex={"35%"}>Creator fee :</Text>

            <Flex justifyContent="flex-end" flex={"65%"}>
              <Text>{lottery.creatorFee.toNumber()} %</Text>
            </Flex>
          </Flex>
          <Flex pb={4}>
            <Text flex={"35%"}>Ending date :</Text>

            <Flex justifyContent="flex-end" flex={"65%"}>
              <Text>
                {new Date(lottery.endingDate.toNumber()).toLocaleString()}
              </Text>
            </Flex>
          </Flex>
          {isMobile ? null : (
            <Flex pb={4}>
              <Text flex={"35%"}>Creator :</Text>

              <Flex justifyContent="flex-end" flex={"65%"}>
                <Text>{lottery.lotteryCreator}</Text>
              </Flex>
            </Flex>
          )}

          {lottery.currentState === 1 ? (
            <Flex justifyContent="center">
              <Text fontWeight="bold">The lottery is finished</Text>
            </Flex>
          ) : date > new Date(lottery.endingDate.toNumber()) &&
            lottery.bettors.length > 0 ? (
            <Flex justifyContent="flex-end">
              <CustomButton
                buttonText="Claim prize"
                colorTheme="yellowRed"
                onClick={() => handleOnClickClaim(lottery.id.toNumber())}
              />
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
                          <Flex mb={10}>
                            <FormLabel htmlFor="password" flex="35%">
                              Password :
                            </FormLabel>
                            <Spacer />
                            <Input
                              {...field}
                              id="password"
                              type="password"
                              placeholder="Enter password"
                              flex={{ base: "65%", md: "20%", sm: "65%" }}
                              borderRadius={0}
                              focusBorderColor="teal.300"
                            />
                            <FormErrorMessage
                              pos="absolute"
                              left={{ md: "66%" }}
                              right={{ base: "0%", sm: "0%" }}
                              top="40px"
                              fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                            >
                              {form.errors.password}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>
                    <Flex justifyContent="flex-end">
                      <CustomButton
                        buttonText="Bet"
                        colorTheme="tealOrange"
                        w={"75px"}
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                      />
                    </Flex>
                  </Form>
                );
              }}
            </Formik>
          ) : (
            <Flex justifyContent="flex-end">
              <CustomButton
                buttonText="Bet"
                colorTheme="tealOrange"
                w={"75px"}
                onClick={() => handleOnClickBet(lottery.id.toNumber())}
              />
            </Flex>
          )}
        </Box>
        <Box
          bg={lottery.currentState === 1 ? "grayGradient" : "purpleRedGradient"}
          w="100%"
          h={1}
        />
      </Card>
    </Container>
  );
};

export default page;
