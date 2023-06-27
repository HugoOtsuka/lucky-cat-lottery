"use client";
import { Button, Container, FormLabel, Input } from "@chakra-ui/react";
import { useAppContext } from "Context/TestContext";
import { useState } from "react";

export default function Home() {
  const { greeting, getGreeting, setGreetingSC } = useAppContext();

  const [greet, setGreet] = useState<number>(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setGreet(value);
  };

  const handleButtonClick = () => {
    setGreetingSC(greet);
  };

  const handleClick = () => {
    getGreeting();
  };

  return (
    <Container maxW={"container.lg"} bgColor={"blue.300"}>
      <h1>All lotteries</h1>
      <Button onClick={handleClick}>get greeting</Button>
      <h1>{greeting}</h1>
      <FormLabel htmlFor="greeting">Set greeting :</FormLabel>
      <Input
        id="greeting"
        type="number"
        placeholder="Enter text"
        onChange={handleInputChange}
      ></Input>
      <Button onClick={handleButtonClick}>submit</Button>
    </Container>
  );
}
