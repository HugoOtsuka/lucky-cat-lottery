"use client";
import {
  Box,
  ButtonGroup,
  Card,
  CardHeader,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import CustomButton from "components/CustomButton";
import { ethers } from "ethers";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";

type FormValues = {
  privateLottery: boolean;
  creatorFee: string;
  betPrice?: string;
  maxBettors?: string;
  endingDate?: string;
  createAndBet: boolean;
  password?: string;
};

export default function Page() {
  const { createLottery, createLotteryAndBet, createStop, getCreateStop } =
    useBlockchainContext();

  useEffect(() => {
    getCreateStop();
  }, []);

  const initialValues: FormValues = {
    privateLottery: false,
    creatorFee: "",
    betPrice: "",
    maxBettors: "",
    endingDate: "",
    createAndBet: false,
    password: "0",
  };

  const onSubmit = (values: typeof initialValues) => {
    if (
      values.betPrice &&
      values.maxBettors &&
      values.endingDate &&
      values.password
    ) {
      let creatorFee = 0;
      if (values.creatorFee) {
        creatorFee = parseInt(values.creatorFee);
      }
      const endingDate = new Date(values.endingDate).getTime();
      if (!values.createAndBet) {
        createLottery(
          creatorFee,
          ethers.utils.parseEther(values.betPrice.toString()),
          parseInt(values.maxBettors),
          endingDate,
          ethers.utils.formatBytes32String(values.password),
          values.privateLottery
        );
      } else {
        createLotteryAndBet(
          creatorFee,
          ethers.utils.parseEther(values.betPrice.toString()),
          parseInt(values.maxBettors),
          endingDate,
          ethers.utils.formatBytes32String(values.password),
          values.privateLottery
        );
      }
    }
  };

  const validate = (values: FormValues): Partial<FormValues> => {
    const errors: Partial<FormValues> = {};

    if (parseInt(values.creatorFee) < 0 || parseInt(values.creatorFee) > 99) {
      errors.creatorFee = "The creator fee should be between 0 and 99";
    } else if (!Number.isInteger(Number(values.creatorFee))) {
      errors.creatorFee = "The creator fee should not be a decimal number";
    }

    if (!values.betPrice) {
      errors.betPrice = "Required";
    } else if (parseFloat(values.betPrice) <= 0) {
      errors.betPrice = "The bet price should be greater than 0";
    }

    if (!values.maxBettors) {
      errors.maxBettors = "Required";
    } else if (!Number.isInteger(Number(values.maxBettors))) {
      errors.maxBettors = "The max bettors should not be a decimal number";
    } else if (parseInt(values.maxBettors) <= 0) {
      errors.maxBettors = "The max bettors should be greater than 0";
    }

    if (!values.endingDate) {
      errors.endingDate = "Required";
    }

    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };

  return (
    <>
      <Container
        className="animate__animated animate__fadeIn"
        maxW={"container.lg"}
      >
        <Card bgColor={"transparent"} boxShadow={"none"}>
          <CardHeader>
            <Heading size="md">Create lottery</Heading>
          </CardHeader>
          <Box bg={"tealOrangeGradient"} w="100%" h={1} />
          <Box
            bgColor={"transparent"}
            p={{ base: "30px 0px", md: 12, sm: "30px 0px" }}
          >
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validate={validate}
            >
              {(formik) => {
                return (
                  <Form>
                    <Field name="privateLottery">
                      {({ field, form }: any) => (
                        <FormControl>
                          <Flex
                            mb={{
                              base: 10,
                              md: 14,
                              sm: 10,
                            }}
                          >
                            <FormLabel
                              htmlFor="privateLottery"
                              flex={{ base: "35%", md: "30%", sm: "35%" }}
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            >
                              Lottery Type
                            </FormLabel>
                            <Box flex={{ base: "65%", md: "70%", sm: "65%" }}>
                              <ButtonGroup
                                {...field}
                                id="privateLottery"
                                isAttached
                              >
                                <Stack spacing={0} direction="row">
                                  <CustomButton
                                    buttonText="Public"
                                    colorTheme="tealOrange"
                                    mr={2}
                                    w={{ base: "85px", md: "95px", sm: "85px" }}
                                    _active={{
                                      transition: "color 0.2s",
                                      color: "teal.300",
                                      boxShadow:
                                        "0px 10px 10px -5px #51cdd8, 0px -10px 10px -5px #f7ae8e",
                                    }}
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      sm: "sm",
                                    }}
                                    id="btnPublic"
                                    type="button"
                                    onClick={() => {
                                      form.setFieldValue(
                                        "privateLottery",
                                        false
                                      );
                                      form.setFieldValue("password", "0");
                                      form.setFieldTouched("password", false);
                                    }}
                                    isActive={field.value === false}
                                  />
                                  <CustomButton
                                    buttonText="Private"
                                    colorTheme="yellowRed"
                                    w={{ base: "85px", md: "95px", sm: "85px" }}
                                    _active={{
                                      transition: "color 0.2s",
                                      color: "yellow.200",
                                      boxShadow:
                                        "0px 10px 10px -5px #f8f39e, 0px -10px 10px -5px #ed708e",
                                    }}
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      sm: "sm",
                                    }}
                                    id="btnPrivate"
                                    type="button"
                                    onClick={() => {
                                      form.setFieldValue(
                                        "privateLottery",
                                        true
                                      );
                                      form.setFieldValue("password", "");
                                    }}
                                    isActive={field.value === true}
                                  />
                                </Stack>
                              </ButtonGroup>
                            </Box>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="creatorFee">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.creatorFee && form.touched.creatorFee
                          }
                        >
                          <Flex
                            mb={{
                              base: 10,
                              md: 14,
                              sm: 10,
                            }}
                          >
                            <FormLabel
                              htmlFor="creatorFee"
                              flex={{ base: "35%", md: "30%", sm: "35%" }}
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            >
                              Creator fee
                            </FormLabel>
                            <Input
                              {...field}
                              id="creatorFee"
                              type="number"
                              placeholder="Enter the creator fee (%)"
                              flex={{ base: "65%", md: "70%", sm: "65%" }}
                              borderRadius={0}
                              focusBorderColor="teal.300"
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            />
                            <FormErrorMessage
                              pos="absolute"
                              left={{ md: "32%" }}
                              right={{ base: "0%", sm: "0%" }}
                              top="40px"
                              fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                            >
                              {form.errors.creatorFee}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="betPrice">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.betPrice && form.touched.betPrice
                          }
                        >
                          <Flex
                            mb={{
                              base: 10,
                              md: 14,
                              sm: 10,
                            }}
                          >
                            <FormLabel
                              htmlFor="betPrice"
                              flex={{ base: "35%", md: "30%", sm: "35%" }}
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            >
                              Bet price <span>*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              id="betPrice"
                              type="number"
                              placeholder="Enter the bet price (ETH)"
                              flex={{ base: "65%", md: "70%", sm: "65%" }}
                              borderRadius={0}
                              focusBorderColor="teal.300"
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            />
                            <FormErrorMessage
                              pos="absolute"
                              left={{ md: "32%" }}
                              right={{ base: "0%", sm: "0%" }}
                              top="40px"
                              fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                            >
                              {form.errors.betPrice}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="maxBettors">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.maxBettors && form.touched.maxBettors
                          }
                        >
                          <Flex
                            mb={{
                              base: 10,
                              md: 14,
                              sm: 10,
                            }}
                          >
                            <FormLabel
                              htmlFor="maxBettors"
                              flex={{ base: "35%", md: "30%", sm: "35%" }}
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            >
                              Max bettors <span>*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              id="maxBettors"
                              type="number"
                              placeholder="Enter the max bettors"
                              flex={{ base: "65%", md: "70%", sm: "65%" }}
                              borderRadius={0}
                              focusBorderColor="teal.300"
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            />
                            <FormErrorMessage
                              pos="absolute"
                              left={{ md: "32%" }}
                              right={{ base: "0%", sm: "0%" }}
                              top="40px"
                              fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                            >
                              {form.errors.maxBettors}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="endingDate">
                      {({ field, form }: any) => (
                        <FormControl
                          isInvalid={
                            form.errors.endingDate && form.touched.endingDate
                          }
                        >
                          <Flex
                            mb={{
                              base: 10,
                              md: 14,
                              sm: 10,
                            }}
                          >
                            <FormLabel
                              htmlFor="endingDate"
                              flex={{ base: "35%", md: "30%", sm: "35%" }}
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            >
                              Ending date <span>*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              id="endingDate"
                              type="datetime-local"
                              placeholder="Select Date and Time"
                              flex={{ base: "65%", md: "70%", sm: "65%" }}
                              borderRadius={0}
                              focusBorderColor="teal.300"
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            />
                            <FormErrorMessage
                              pos="absolute"
                              left={{ md: "32%" }}
                              right={{ base: "0%", sm: "0%" }}
                              top="40px"
                              fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                            >
                              {form.errors.endingDate}
                            </FormErrorMessage>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="createAndBet">
                      {({ field }: any) => (
                        <FormControl>
                          <Flex
                            mb={{
                              base: 10,
                              md: 14,
                              sm: 10,
                            }}
                          >
                            <FormLabel
                              htmlFor="createAndBet"
                              flex={{ base: "35%", md: "30%", sm: "35%" }}
                              fontSize={{ base: "sm", md: "md", sm: "sm" }}
                            >
                              Bet directly on the lottery
                            </FormLabel>
                            <Checkbox
                              {...field}
                              id="createAndBet"
                              size="lg"
                              flex={{ base: "65%", md: "70%", sm: "65%" }}
                              colorScheme="teal.300"
                              iconColor="teal.300"
                            ></Checkbox>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="privateLottery">
                      {({ field, form }: any) => {
                        if (field.value) {
                          return (
                            <Field name="password">
                              {({ field }: any) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.password &&
                                    form.touched.password
                                  }
                                >
                                  <Flex
                                    mb={{
                                      base: 10,
                                      md: 14,
                                      sm: 10,
                                    }}
                                  >
                                    <FormLabel
                                      htmlFor="password"
                                      flex={{
                                        base: "35%",
                                        md: "30%",
                                        sm: "35%",
                                      }}
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        sm: "sm",
                                      }}
                                    >
                                      Password <span>*</span>
                                    </FormLabel>
                                    <Input
                                      {...field}
                                      id="password"
                                      type="password"
                                      placeholder="Enter password"
                                      flex={{
                                        base: "65%",
                                        md: "70%",
                                        sm: "65%",
                                      }}
                                      borderRadius={0}
                                      focusBorderColor="teal.300"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        sm: "sm",
                                      }}
                                    />
                                    <FormErrorMessage
                                      pos="absolute"
                                      left={{
                                        md: "32%",
                                      }}
                                      right={{
                                        base: "0%",

                                        sm: "0%",
                                      }}
                                      top="40px"
                                      fontSize={{
                                        base: "xs",
                                        md: "sm",
                                        sm: "xs",
                                      }}
                                    >
                                      {form.errors.password}
                                    </FormErrorMessage>
                                  </Flex>
                                </FormControl>
                              )}
                            </Field>
                          );
                        } else {
                          return null;
                        }
                      }}
                    </Field>

                    <Field name="createAndBet">
                      {({ field }: any) => {
                        if (!createStop) {
                          return (
                            <Flex justifyContent="flex-end">
                              <CustomButton
                                buttonText={
                                  !field.value
                                    ? "Create lottery"
                                    : "Create lottery & bet"
                                }
                                colorTheme="bluePurple"
                                fontSize={{ base: "sm", md: "md", sm: "sm" }}
                                type="submit"
                                disabled={
                                  !formik.isValid || formik.isSubmitting
                                }
                              />
                            </Flex>
                          );
                        } else {
                          return (
                            <Flex justifyContent="flex-end">
                              <Text
                                color="red.500"
                                fontSize={{ base: "sm", md: "md", sm: "sm" }}
                              >
                                The creation of lotteries are disabled for the
                                moment.
                              </Text>
                            </Flex>
                          );
                        }
                      }}
                    </Field>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Card>
      </Container>
    </>
  );
}
