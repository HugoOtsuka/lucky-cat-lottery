"use client";
import { Box, Container, Flex, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import CustomLink from "components/CustomLink";
import { useBlockchainContext } from "Context/BlockchainContext";

export default function Navbar() {
  const { isAdmin } = useBlockchainContext();

  return (
    <Container maxW="maxWidth" display="flex" alignItems="center" p="0">
      <Flex alignItems="space-between">
        <Link as={NextLink} href="/" mx={6}>
          <Image
            src="/images/LuckyCat.png"
            alt="logo"
            boxSize="75px"
            objectFit="contain"
          />
        </Link>
        <Flex>
          <CustomLink href="/" linkText="All lotteries" />
          <CustomLink
            href="/my-lotteries"
            linkText="My Lotteries"
            bg={"linear-gradient(to right, #2b63a3, #a2669c)"}
          />
          <CustomLink
            href="/my-bets"
            linkText="My Bets"
            bg={"linear-gradient(to right, #f8f39e, #ed708e)"}
          />
          <CustomLink href="/create-lottery" linkText="Create Lottery" />
          {isAdmin && (
            <CustomLink
              href="/admin-menu"
              linkText="Admin"
              bg={"linear-gradient(to right, #2b63a3, #a2669c)"}
            />
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
