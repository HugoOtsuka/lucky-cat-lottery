"use client";
import { Button, Container, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Navbar() {
  return (
    <Container maxW="maxWidth" display="flex" alignItems="center" p="0">
      <Button borderRadius="0">
        <Link as={NextLink} href="/">
          Home
        </Link>
      </Button>
      <Button borderRadius="0">
        <Link as={NextLink} href="/">
          All lotteries
        </Link>
      </Button>
      <Button borderRadius="0">
        <Link as={NextLink} href="/my-lotteries">
          My Lotteries
        </Link>
      </Button>
      <Button borderRadius="0">
        <Link as={NextLink} href="/my-bets">
          My Bets
        </Link>
      </Button>
      <Button borderRadius="0">
        <Link as={NextLink} href="/create-lottery">
          Create Lottery
        </Link>
      </Button>
      <Button borderRadius="0">
        <Link as={NextLink} href="/admin-menu">
          Admin
        </Link>
      </Button>
    </Container>
  );
}
