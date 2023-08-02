"use client";
import {
  Box,
  Button,
  ButtonGroup,
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
  Stack,
  Text,
} from "@chakra-ui/react";
import { useAppContext } from "Context/BlockchainContext";
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
  const { createStop, setStop } = useAppContext();

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
                  <Flex mb={14}>
                    <FormLabel htmlFor="formCreateStop" flex="30%">
                      Lotteries creation
                    </FormLabel>
                    <Box flex="40%">
                      <ButtonGroup
                        {...field}
                        id="formCreateStop"
                        isAttached
                        transform="skew(10deg)"
                        w="190px"
                        bg={"teal.300"}
                      >
                        <Stack spacing={0} direction="row">
                          <Button
                            id="btnActivated"
                            type="button"
                            onClick={() => {
                              form.setFieldValue("formCreateStop", false);
                            }}
                            isActive={field.value === false}
                            borderRadius={0}
                            variant="secondary"
                            w="95px"
                          >
                            Activate
                          </Button>
                          <Button
                            id="btnDisabled"
                            type="button"
                            onClick={() => {
                              form.setFieldValue("formCreateStop", true);
                            }}
                            isActive={field.value === true}
                            borderRadius={0}
                            variant="secondary"
                            w="95px"
                          >
                            Disable
                          </Button>
                        </Stack>
                      </ButtonGroup>
                    </Box>
                    <Flex flex="30%" justify="flex-end">
                      <Button
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                        borderRadius={0}
                        transform="skew(10deg)"
                        variant="primary"
                      >
                        Save
                      </Button>
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
  const { houseFee, setFeeHouse } = useAppContext();

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
                  <Flex mb={14}>
                    <FormLabel htmlFor="formHouseFee" flex="30%">
                      House fee
                    </FormLabel>
                    <Input
                      {...field}
                      id="formHouseFee"
                      type="number"
                      placeholder="Enter the house fee (%)"
                      flex="40%"
                      borderRadius={0}
                      focusBorderColor="teal.300"
                    />
                    <Flex flex="30%" justify="flex-end">
                      <Button
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                        borderRadius={0}
                        transform="skew(10deg)"
                        variant="primary"
                      >
                        Save
                      </Button>
                    </Flex>
                    <FormErrorMessage
                      transform="skew(10deg)"
                      pos="absolute"
                      left="32%"
                      top="40px"
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
  const { fundFee, setFeeFund } = useAppContext();

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
                  <Flex mb={14}>
                    <FormLabel htmlFor="formFundFee" flex="30%">
                      Fund fee
                    </FormLabel>
                    <Input
                      {...field}
                      id="formFundFee"
                      type="number"
                      placeholder="Enter the fund fee (%)"
                      flex="40%"
                      borderRadius={0}
                      focusBorderColor="teal.300"
                    />
                    <Flex flex="30%" justify="flex-end">
                      <Button
                        type="submit"
                        disabled={!formik.isValid || formik.isSubmitting}
                        borderRadius={0}
                        transform="skew(10deg)"
                        variant="primary"
                      >
                        Save
                      </Button>
                    </Flex>
                    <FormErrorMessage
                      transform="skew(10deg)"
                      pos="absolute"
                      left="32%"
                      top="40px"
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
  } = useAppContext();

  useEffect(() => {
    getHouseFee();
    getFundFee();
    getCreateStop();
  }, []);

  return (
    <>
      <Container maxW={"container.lg"}>
        <Card bgColor={"transparent"} boxShadow={"none"}>
          <CardHeader>
            <Heading size="md">Admin menu</Heading>
          </CardHeader>
          <Box
            bg={"linear-gradient(to right, #a2669c, #ed708e)"}
            transform="skew(10deg)"
            w="100%"
            h={1}
          />
          <Box bgColor={"transparent"} p={12}>
            <Card
              bgColor={"transparent"}
              fontSize={18}
              boxShadow={"none"}
              mb={14}
              transform="skew(10deg)"
              borderRadius={0}
              border={"2px solid"}
              borderColor={"primary"}
              color={"primary"}
              p={6}
            >
              <Text>Contract status :</Text>
              <Flex>
                <Spacer />
                <Flex flex="25%">
                  <Text>Lotteries creation : </Text>
                  <Text color={createStop ? "danger" : "warning"}>
                    {"\u00A0"}
                    {createStop ? "Disabled" : "Activated"}
                  </Text>
                </Flex>
                <Flex flex="20%">
                  <Text>House fee : </Text>
                  <Text color={"warning"}>
                    {"\u00A0"}
                    {houseFee?.toString()}%
                  </Text>
                </Flex>
                <Flex flex="20%">
                  <Text>Fund fee : </Text>
                  <Text color={"warning"}>
                    {"\u00A0"}
                    {fundFee?.toString()}%
                  </Text>
                </Flex>
              </Flex>
            </Card>
            <FormCreateStop />
            <FormHouseFee />
            <FormFundFee />
          </Box>
        </Card>
      </Container>
    </>
  );
}
