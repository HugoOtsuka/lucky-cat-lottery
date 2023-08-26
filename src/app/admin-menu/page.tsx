"use client";
import {
  Box,
  ButtonGroup,
  Card,
  CardHeader,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useBlockchainContext } from "Context/BlockchainContext";
import CustomButton from "components/CustomButton";
import { Field, Form, Formik } from "formik";
import { useEffect } from "react";

type FormValueCreateStop = {
  formCreateStop?: boolean;
};

type FormValueHouseFee = {
  formHouseFee?: string;
};

type FormValueFundFee = {
  formFundFee?: string;
};

const FormCreateStop = () => {
  const { createStop, setStop } = useBlockchainContext();

  const initialValues: FormValueCreateStop = {
    formCreateStop: createStop,
  };

  const onSubmit = (value: typeof initialValues) => {
    if (value.formCreateStop !== createStop) {
      setStop();
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {(formik) => {
        return (
          <Form>
            <Field name="formCreateStop">
              {({ field, form }: any) => (
                <FormControl>
                  <Flex
                    mb={{
                      base: 4,
                      md: 12,
                      sm: 4,
                    }}
                    wrap={{ base: "wrap", md: "nowrap", sm: "wrap" }}
                  >
                    <FormLabel
                      htmlFor="formCreateStop"
                      flex={{ base: "20%", md: "30%", sm: "20%" }}
                      fontSize={{ base: "sm", md: "md", sm: "sm" }}
                    >
                      Lotteries creation
                    </FormLabel>
                    <Flex
                      flex={{ base: "50%", md: "40%", sm: "50%" }}
                      justifyContent={{
                        base: "flex-end",
                        md: "flex-start",
                        sm: "flex-end",
                      }}
                    >
                      <ButtonGroup
                        {...field}
                        id="formCreateStop"
                        mb={{ base: 5, sm: 5 }}
                        isAttached
                      >
                        <Stack spacing={0} direction="row">
                          <CustomButton
                            buttonText="Activate"
                            colorTheme="tealOrange"
                            mr={2}
                            w={{ base: "85px", md: "95px", sm: "85px" }}
                            _active={{
                              transition: "color 0.2s",
                              color: "orange.200",
                              boxShadow:
                                "0px 10px 10px -5px #51cdd8, 0px -10px 10px -5px #f7ae8e",
                            }}
                            fontSize={{
                              base: "sm",
                              md: "md",
                              sm: "sm",
                            }}
                            id="btnActivated"
                            type="button"
                            onClick={() => {
                              form.setFieldValue("formCreateStop", false);
                            }}
                            isActive={field.value === false}
                          />
                          <CustomButton
                            buttonText="Disable"
                            colorTheme="bluePurple"
                            w={{ base: "85px", md: "95px", sm: "85px" }}
                            _active={{
                              transition: "color 0.2s",
                              color: "red.300",
                              boxShadow:
                                "0px 10px 10px -5px #2b63a3, 0px -10px 10px -5px #a2669c",
                            }}
                            fontSize={{
                              base: "sm",
                              md: "md",
                              sm: "sm",
                            }}
                            id="btnDisabled"
                            type="button"
                            onClick={() => {
                              form.setFieldValue("formCreateStop", true);
                            }}
                            isActive={field.value === true}
                          />
                        </Stack>
                      </ButtonGroup>
                    </Flex>
                    <Flex flex="30%" justify="flex-end">
                      <CustomButton
                        buttonText="Save"
                        colorTheme="yellowRed"
                        w={"75px"}
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                      />
                    </Flex>
                  </Flex>
                </FormControl>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
};

const FormHouseFee = () => {
  const { houseFee, setFeeHouse } = useBlockchainContext();

  const initialValues: FormValueHouseFee = {
    formHouseFee: houseFee?.toString(),
  };

  const onSubmit = (value: typeof initialValues) => {
    if (value.formHouseFee && value.formHouseFee !== houseFee?.toString()) {
      setFeeHouse(parseInt(value.formHouseFee));
    }
  };

  const validate = (value: FormValueHouseFee): Partial<FormValueHouseFee> => {
    const errors: Partial<FormValueHouseFee> = {};

    if (value.formHouseFee) {
      if (value.formHouseFee === houseFee?.toString()) {
        errors.formHouseFee = "The house fee is already set to this value";
      } else if (
        parseInt(value.formHouseFee) < 0 ||
        parseInt(value.formHouseFee) > 99
      ) {
        errors.formHouseFee = "The house fee should be between 0 and 99";
      } else if (!Number.isInteger(Number(value.formHouseFee))) {
        errors.formHouseFee = "The house fee should not be a decimal number";
      }
    }
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {(formik) => {
        return (
          <Form>
            <Field name="formHouseFee">
              {({ field, form }: any) => (
                <FormControl
                  isInvalid={
                    form.errors.formHouseFee && form.touched.formHouseFee
                  }
                >
                  <Flex
                    mb={{
                      base: 4,
                      md: 12,
                      sm: 4,
                    }}
                    wrap={{ base: "wrap", md: "nowrap", sm: "wrap" }}
                  >
                    <FormLabel
                      htmlFor="formHouseFee"
                      flex={{ base: "20%", md: "30%", sm: "20%" }}
                      fontSize={{ base: "sm", md: "md", sm: "sm" }}
                    >
                      House fee
                    </FormLabel>
                    <Input
                      {...field}
                      id="formHouseFee"
                      type="number"
                      placeholder="Enter the house fee (%)"
                      flex={{ base: "50%", md: "40%", sm: "50%" }}
                      borderRadius={0}
                      focusBorderColor="teal.300"
                      mb={{ base: 10, sm: 10 }}
                    />
                    <Flex flex="30%" justify="flex-end">
                      <CustomButton
                        buttonText="Save"
                        colorTheme="yellowRed"
                        w={"75px"}
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                      />
                    </Flex>
                    <FormErrorMessage
                      pos="absolute"
                      left={{ md: "31%" }}
                      right={{ base: "0%", sm: "0%" }}
                      top="40px"
                      fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                    >
                      {form.errors.formHouseFee}
                    </FormErrorMessage>
                  </Flex>
                </FormControl>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
};

const FormFundFee = () => {
  const { fundFee, setFeeFund } = useBlockchainContext();

  const initialValues: FormValueFundFee = {
    formFundFee: fundFee?.toString(),
  };

  const onSubmit = (values: typeof initialValues) => {
    if (values.formFundFee && values.formFundFee !== fundFee?.toString()) {
      setFeeFund(parseInt(values.formFundFee));
    }
  };

  const validate = (value: FormValueFundFee): Partial<FormValueFundFee> => {
    const errors: Partial<FormValueFundFee> = {};

    if (value.formFundFee) {
      if (value.formFundFee === fundFee?.toString()) {
        errors.formFundFee = "The fund fee is already set to this value";
      } else if (
        parseInt(value.formFundFee) < 0 ||
        parseInt(value.formFundFee) > 99
      ) {
        errors.formFundFee = "The house fee should be between 0 and 99";
      } else if (!Number.isInteger(Number(value.formFundFee))) {
        errors.formFundFee = "The house fee should not be a decimal number";
      }
    }
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
    >
      {(formik) => {
        return (
          <Form>
            <Field name="formFundFee">
              {({ field, form }: any) => (
                <FormControl
                  isInvalid={
                    form.errors.formFundFee && form.touched.formFundFee
                  }
                >
                  <Flex
                    mb={{
                      base: 4,
                      md: 12,
                      sm: 4,
                    }}
                    wrap={{ base: "wrap", md: "nowrap", sm: "wrap" }}
                  >
                    <FormLabel
                      htmlFor="formFundFee"
                      flex={{ base: "20%", md: "30%", sm: "20%" }}
                      fontSize={{ base: "sm", md: "md", sm: "sm" }}
                    >
                      Fund fee
                    </FormLabel>
                    <Input
                      {...field}
                      id="formFundFee"
                      type="number"
                      placeholder="Enter the fund fee (%)"
                      flex={{ base: "50%", md: "40%", sm: "50%" }}
                      borderRadius={0}
                      focusBorderColor="teal.300"
                      mb={{ base: 10, sm: 10 }}
                    />
                    <Flex flex="30%" justify="flex-end">
                      <CustomButton
                        buttonText="Save"
                        colorTheme="yellowRed"
                        w={"75px"}
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                      />
                    </Flex>
                    <FormErrorMessage
                      pos="absolute"
                      left={{ md: "31%" }}
                      right={{ base: "0%", sm: "0%" }}
                      top="40px"
                      fontSize={{ base: "xs", md: "sm", sm: "xs" }}
                    >
                      {form.errors.formFundFee}
                    </FormErrorMessage>
                  </Flex>
                </FormControl>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
};

export default function Page() {
  const {
    createStop,
    houseFee,
    fundFee,
    getHouseFee,
    getFundFee,
    getCreateStop,
  } = useBlockchainContext();

  useEffect(() => {
    getHouseFee();
    getFundFee();
    getCreateStop();
  }, []);

  return (
    <>
      <Container
        className="animate__animated animate__fadeIn"
        maxW={"container.lg"}
      >
        <Card bgColor={"transparent"} boxShadow={"none"}>
          <CardHeader>
            <Heading size="md">Admin menu</Heading>
          </CardHeader>
          <Box bg={"bluePurpleGradient"} w="100%" h={1} />
          <Box
            bgColor={"transparent"}
            p={{ base: "30px 0px", md: 12, sm: "30px 0px" }}
          >
            <Card
              bgColor={"transparent"}
              fontSize={{ base: "sm", md: "lg", sm: "sm" }}
              boxShadow={"none"}
              mb={{
                base: 8,
                md: 14,
                sm: 8,
              }}
              borderRadius={0}
              border={"2px solid"}
              borderColor={"teal.300"}
              color={"teal.300"}
              p={{
                base: 4,
                md: 4,
                sm: 4,
              }}
            >
              <Flex justifyContent="center">
                <Text fontWeight="bold">Contract status :</Text>
              </Flex>
              <Flex
                direction={{ base: "column", md: "row", sm: "column" }}
                mt={4}
                alignItems={{
                  base: "flex-start",
                  md: "center",
                  sm: "flex-start",
                }}
              >
                <Box flex="25%" mb={{ base: 4, md: 0, sm: 4 }}>
                  <Text>
                    Lotteries creation :
                    <Text color={createStop ? "red.300" : "orange.200"}>
                      {createStop ? "Disabled" : "Activated"}
                    </Text>
                  </Text>
                </Box>
                <Box flex="20%" ml={{ md: 8 }} mb={{ base: 4, md: 0, sm: 4 }}>
                  <Text>
                    House fee :
                    <Text color={"orange.200"}>{houseFee?.toString()}%</Text>
                  </Text>
                </Box>
                <Box flex="10%" ml={{ md: 8 }}>
                  <Text>
                    Fund fee :
                    <Text color={"orange.200"}>{fundFee?.toString()}%</Text>
                  </Text>
                </Box>
              </Flex>
            </Card>
            <FormCreateStop />
            <Divider
              mb={{
                base: 4,
                md: 6,
                sm: 4,
              }}
            />
            <FormHouseFee />
            <Divider
              mb={{
                base: 4,
                md: 6,
                sm: 4,
              }}
            />
            <FormFundFee />
          </Box>
        </Card>
      </Container>
    </>
  );
}
