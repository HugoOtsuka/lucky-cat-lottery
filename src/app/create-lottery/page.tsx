"use client";
import {
  Box,
  Button,
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
import { useAppContext } from "Context/AppContext";
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
    useAppContext();

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
      console.log(endingDate);
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
      <Container maxW={"container.lg"}>
        <Card bgColor={"gray.900"} boxShadow={"none"}>
          <CardHeader>
            <Heading size="md">Create lottery</Heading>
          </CardHeader>
          <Box
            bg={"linear-gradient(to right, #51cdd8, #F7AE8E)"}
            transform="skew(10deg)"
            w="100%"
            h={1}
          />
          <Card bgColor={"gray.900"} p={12} boxShadow={"none"}>
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
                          <Flex mb={14}>
                            <FormLabel htmlFor="privateLottery" flex="30%">
                              Lottery Type
                            </FormLabel>
                            <Box flex="70%">
                              <ButtonGroup
                                {...field}
                                id="privateLottery"
                                isAttached
                                transform="skew(10deg)"
                                w="190px"
                                bg={"teal.300"}
                              >
                                <Stack spacing={0} direction="row">
                                  <Button
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
                                    borderRadius={0}
                                    variant="secondary"
                                    w="95px"
                                  >
                                    Public
                                  </Button>
                                  <Button
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
                                    borderRadius={0}
                                    variant="secondary"
                                    w="95px"
                                  >
                                    Private
                                  </Button>
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
                          <Flex mb={14}>
                            <FormLabel htmlFor="creatorFee" flex="30%">
                              Creator fee
                            </FormLabel>
                            <Input
                              {...field}
                              id="creatorFee"
                              type="number"
                              placeholder="Enter the creator fee (%)"
                              flex="70%"
                              borderRadius={0}
                              focusBorderColor="teal.300"
                            />
                            <FormErrorMessage
                              transform="skew(10deg)"
                              pos="absolute"
                              left="32%"
                              top="40px"
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
                          <Flex mb={14}>
                            <FormLabel htmlFor="betPrice" flex="30%">
                              Bet price <span>*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              id="betPrice"
                              type="number"
                              placeholder="Enter the bet price"
                              flex="70%"
                              borderRadius={0}
                              focusBorderColor="teal.300"
                            />
                            <FormErrorMessage
                              transform="skew(10deg)"
                              pos="absolute"
                              left="32%"
                              top="40px"
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
                          <Flex mb={14}>
                            <FormLabel htmlFor="maxBettors" flex="30%">
                              Max bettors <span>*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              id="maxBettors"
                              type="number"
                              placeholder="Enter the max bettors"
                              flex="70%"
                              borderRadius={0}
                              focusBorderColor="teal.300"
                            />
                            <FormErrorMessage
                              transform="skew(10deg)"
                              pos="absolute"
                              left="32%"
                              top="40px"
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
                          <Flex mb={14}>
                            <FormLabel htmlFor="endingDate" flex="30%">
                              Ending date <span>*</span>
                            </FormLabel>
                            <Input
                              {...field}
                              id="endingDate"
                              type="datetime-local"
                              placeholder="Select Date and Time"
                              flex="70%"
                              borderRadius={0}
                              focusBorderColor="teal.300"
                            />
                            <FormErrorMessage
                              transform="skew(10deg)"
                              pos="absolute"
                              left="32%"
                              top="40px"
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
                          <Flex mb={14}>
                            <FormLabel htmlFor="createAndBet" flex="30%">
                              Bet directly on the lottery
                            </FormLabel>
                            <Checkbox
                              {...field}
                              id="createAndBet"
                              size="lg"
                              flex="70%"
                              colorScheme="teal.300"
                              iconColor="teal.300"
                            ></Checkbox>
                          </Flex>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="privateLottery">
                      {({ field, form }: any) => {
                        if (field.value === true) {
                          return (
                            <Field name="password">
                              {({ field }: any) => (
                                <FormControl
                                  isInvalid={
                                    form.errors.password &&
                                    form.touched.password
                                  }
                                >
                                  <Flex mb={14}>
                                    <FormLabel htmlFor="password" flex="30%">
                                      Password <span>*</span>
                                    </FormLabel>
                                    <Input
                                      {...field}
                                      id="password"
                                      type="password"
                                      placeholder="Enter password"
                                      flex="70%"
                                      borderRadius={0}
                                      focusBorderColor="teal.300"
                                    />
                                    <FormErrorMessage
                                      transform="skew(10deg)"
                                      pos="absolute"
                                      left="32%"
                                      top="40px"
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
                          if (field.value === false) {
                            return (
                              <Flex justifyContent="flex-end">
                                <Button
                                  type="submit"
                                  disabled={
                                    !formik.isValid || formik.isSubmitting
                                  }
                                  borderRadius={0}
                                  transform="skew(10deg)"
                                  variant="primary"
                                >
                                  Create lottery
                                </Button>
                              </Flex>
                            );
                          } else {
                            return (
                              <Flex justifyContent="flex-end">
                                <Button
                                  type="submit"
                                  disabled={
                                    !formik.isValid || formik.isSubmitting
                                  }
                                  borderRadius={0}
                                  transform="skew(10deg)"
                                  variant="primary"
                                >
                                  Create lottery & bet
                                </Button>
                              </Flex>
                            );
                          }
                        } else {
                          return (
                            <Flex justifyContent="flex-end">
                              <Text color="red.500">
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
          </Card>
        </Card>
      </Container>
    </>
  );
}
