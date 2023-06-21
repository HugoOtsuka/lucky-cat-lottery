"use client";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useAppContext } from "Context/AppContext";
import { ethers } from "ethers";
import { Field, Form, Formik } from "formik";

type FormValues = {
  privateLottery: string;
  creatorFee: string;
  betPrice?: string;
  maxBettors?: string;
  endingDate?: string;
  createAndBet: boolean;
  password?: string;
};

export default function Page() {
  const { createLottery, createLotteryAndBet } = useAppContext();

  const initialValues: FormValues = {
    privateLottery: "",
    creatorFee: "",
    betPrice: "",
    maxBettors: "",
    endingDate: "",
    createAndBet: false,
    password: "",
  };

  const onSubmit = (values: typeof initialValues) => {
    const endingDate = new Date(values.endingDate!).getTime();
    if (!values.createAndBet) {
      createLottery(
        parseInt(values.creatorFee),
        ethers.utils.parseEther(values.betPrice!),
        parseInt(values.maxBettors!),
        endingDate,
        ethers.utils.formatBytes32String(values.password!),
        Boolean(values.privateLottery)
      );
    } else {
      createLotteryAndBet(
        parseInt(values.creatorFee),
        ethers.utils.parseEther(values.betPrice!),
        parseInt(values.maxBettors!),
        endingDate,
        ethers.utils.formatBytes32String(values.password!),
        Boolean(values.privateLottery)
      );
    }
  };

  const validate = (values: FormValues): Partial<FormValues> => {
    const errors: Partial<FormValues> = {};

    if (parseInt(values.creatorFee) < 0 || parseInt(values.creatorFee) > 99) {
      errors.creatorFee = "The creator fee should be between 0 and 99";
    }

    if (!values.betPrice) {
      errors.betPrice = "Required";
    } else if (parseInt(values.betPrice) <= 0) {
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
      <Container maxW={"container.lg"} bgColor={"blue.300"}>
        <Card bgColor={"yellow.100"}>
          <CardHeader>
            <Heading size="md">Create lottery</Heading>
          </CardHeader>
          <Divider />
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
                        <FormLabel htmlFor="privateLottery">
                          Lottery Type
                        </FormLabel>
                        <ButtonGroup {...field} id="privateLottery" isAttached>
                          <Stack spacing={2}>
                            <Button
                              id="btnPublic"
                              type="button"
                              onClick={() => {
                                form.setFieldValue("privateLottery", "");
                                form.setFieldValue("password", "0");
                              }}
                              isActive={field.value === ""}
                            >
                              Public
                            </Button>
                            <Button
                              id="btnPrivate"
                              type="button"
                              onClick={() => {
                                form.setFieldValue("privateLottery", "true");
                                form.setFieldValue("password", "");
                              }}
                              isActive={field.value === "true"}
                            >
                              Private
                            </Button>
                          </Stack>
                        </ButtonGroup>
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
                        <FormLabel htmlFor="creatorFee">Fee</FormLabel>
                        <Input
                          {...field}
                          id="creatorFee"
                          type="number"
                          placeholder="Enter the fee"
                        />
                        <FormErrorMessage>
                          {form.errors.creatorFee}
                        </FormErrorMessage>
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
                        <FormLabel htmlFor="betPrice">Bet Price*</FormLabel>
                        <Input
                          {...field}
                          id="betPrice"
                          type="number"
                          placeholder="Enter the bet price"
                        />
                        <FormErrorMessage>
                          {form.errors.betPrice}
                        </FormErrorMessage>
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
                        <FormLabel htmlFor="maxBettors">Max bettors*</FormLabel>
                        <Input
                          {...field}
                          id="maxBettors"
                          type="number"
                          placeholder="Enter the max bettors"
                        />
                        <FormErrorMessage>
                          {form.errors.maxBettors}
                        </FormErrorMessage>
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
                        <FormLabel htmlFor="endingDate">Ending date*</FormLabel>
                        <Input
                          {...field}
                          id="endingDate"
                          type="datetime-local"
                          placeholder="Select Date and Time"
                        />
                        <FormErrorMessage>
                          {form.errors.endingDate}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="createAndBet">
                    {({ field }: any) => (
                      <FormControl>
                        <FormLabel htmlFor="createAndBet">
                          Bet directly on the lottery
                        </FormLabel>
                        <Checkbox {...field} id="createAndBet"></Checkbox>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="privateLottery">
                    {({ field, form }: any) => {
                      if (field.value === "true") {
                        return (
                          <Field name="password">
                            {({ field }: any) => (
                              <FormControl
                                isInvalid={
                                  form.errors.password && form.touched.password
                                }
                              >
                                <FormLabel htmlFor="password">
                                  Password*
                                </FormLabel>
                                <Input
                                  {...field}
                                  id="password"
                                  type="password"
                                  placeholder="Enter password"
                                />
                                <FormErrorMessage>
                                  {form.errors.password}
                                </FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        );
                      } else {
                        return null;
                      }
                    }}
                  </Field>

                  <Button
                    loadingText="Loading"
                    type="submit"
                    disabled={!formik.isValid || formik.isSubmitting}
                  >
                    Create lottery
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Card>
      </Container>
    </>
  );
}
