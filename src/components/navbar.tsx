"use client";
import { Box, Container, Flex, Image, Link, Spacer } from "@chakra-ui/react";
import NextLink from "next/link";
import CustomLink from "components/CustomLink";
import { useBlockchainContext } from "Context/BlockchainContext";

export default function Navbar() {
  const { isAdmin } = useBlockchainContext();

  return (
    <Container maxW="maxWidth" display="flex" alignItems="center" p="0">
      <Flex alignItems="space-between" width="100%">
        <Link as={NextLink} href="/" mx={6} position={"absolute"}>
          <Image
            src="/images/LuckyCat.png"
            alt="logo"
            boxSize="75px"
            objectFit="contain"
          />
        </Link>

        <Box width={"75px"} mx={6}></Box>
        <Flex pt={"13px"} pb={"14px"} width="100%">
          <CustomLink href="/" linkText="All lotteries" />
          <Box
            bg={"linear-gradient(to right, #F7AE8E, #2b63a3)"}
            h={1}
            w={8}
            transform="skew(10deg)"
            mt={"23.5px"}
          />
          <CustomLink
            href="/my-lotteries"
            linkText="My Lotteries"
            bg={"linear-gradient(to right, #2b63a3, #a2669c)"}
          />
          <Box
            bg={"linear-gradient(to right, #a2669c, #f8f39e)"}
            h={1}
            w={8}
            transform="skew(10deg)"
            mt={"23.5px"}
          />
          <CustomLink
            href="/my-bets"
            linkText="My Bets"
            bg={"linear-gradient(to right, #f8f39e, #ed708e)"}
          />
          <Box
            bg={"linear-gradient(to right, #ed708e, #51cdd8)"}
            h={1}
            w={8}
            transform="skew(10deg)"
            mt={"23.5px"}
          />
          <CustomLink href="/create-lottery" linkText="Create Lottery" />
          {isAdmin ? (
            <>
              <Box
                bg={"linear-gradient(to right, #F7AE8E, #2b63a3)"}
                h={1}
                w={8}
                transform="skew(10deg)"
                mt={"23.5px"}
              />
              <CustomLink
                href="/admin-menu"
                linkText="Admin"
                bg={"linear-gradient(to right, #2b63a3, #a2669c)"}
              />
              <Box
                bg={"linear-gradient(to right, #a2669c, #f8f39e)"}
                h={1}
                transform="skew(10deg)"
                mt={"23.5px"}
                flex="1"
              />
            </>
          ) : (
            <Box
              bg={"linear-gradient(to right, #F7AE8E, #2b63a3)"}
              h={1}
              transform="skew(10deg)"
              mt={"23.5px"}
              flex="1"
            />
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
