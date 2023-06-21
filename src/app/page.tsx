"use client";
import { Container } from "@chakra-ui/react";
import { useAppContext } from "Context/AppContext";
import { useEffect } from "react";

export default function Home() {
  const { updateDate, getActivePublicLotteries } = useAppContext();

  useEffect(() => {
    updateDate();
    getActivePublicLotteries();
  }, []);

  return (
    <Container maxW={"container.lg"} bgColor={"blue.300"}>
      <h1>All lotteries</h1>
      <h1>Hi</h1>
      <h1>Hi</h1>
      <h1>Hi</h1>
      <h1>Hi</h1>
    </Container>
  );
}
