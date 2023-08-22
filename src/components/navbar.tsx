"use client";
import { Box, Container, Flex, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import CustomLink from "components/CustomLink";
import { useBlockchainContext } from "Context/BlockchainContext";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { isAdmin } = useBlockchainContext();

  const [scrolling, setScrolling] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  useEffect(() => {
    controls.start({ y: scrolling ? "-100%" : "0%" });
  }, [scrolling, controls]);

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "#1e1e1e",
        boxShadow: "0px 4px 10px 10px #1e1e1e",
      }}
    >
      <Container maxW="maxWidth" display="flex" alignItems="center" p="0">
        <Flex alignItems="space-between" width="100%">
          <Link as={NextLink} href="/" mx={6} position={"absolute"}>
            <Image
              className="animate__animated animate__fadeIn"
              src="/images/LuckyCat.png"
              alt="logo"
              boxSize="75px"
              objectFit="contain"
            />
          </Link>

          <Box width={"75px"} mx={6}></Box>
          <Flex
            className="animate__animated animate__fadeInRight"
            pt={"13px"}
            pb={"14px"}
            width="100%"
          >
            <CustomLink
              href="/"
              linkText="All lotteries"
              colorTheme="tealOrange"
            />
            <Box
              className="animate__animated animate__fadeIn animate__delay-1s"
              bg={"orangeBlueGradient"}
              h={1}
              w={8}
              mt={"23.5px"}
            />
            <CustomLink
              href="/my-lotteries"
              linkText="My Lotteries"
              colorTheme="bluePurple"
            />
            <Box
              className="animate__animated animate__fadeIn animate__delay-1s"
              bg={"purpleYellowGradient"}
              h={1}
              w={8}
              mt={"23.5px"}
            />
            <CustomLink
              href="/my-bets"
              linkText="My Bets"
              colorTheme="yellowRed"
            />
            <Box
              className="animate__animated animate__fadeIn animate__delay-1s"
              bg={"redTealGradient"}
              h={1}
              w={8}
              mt={"23.5px"}
            />
            <CustomLink
              href="/create-lottery"
              linkText="Create Lottery"
              colorTheme="tealOrange"
            />
            {isAdmin ? (
              <>
                <Box
                  className="animate__animated animate__fadeIn animate__delay-1s"
                  bg={"orangeBlueGradient"}
                  h={1}
                  w={8}
                  mt={"23.5px"}
                />
                <CustomLink
                  href="/admin-menu"
                  linkText="Admin"
                  colorTheme="bluePurple"
                />
                <Box
                  className="animate__animated animate__fadeIn animate__delay-1s"
                  bg={"purpleYellowGradient"}
                  h={1}
                  mt={"23.5px"}
                  flex="1"
                />
              </>
            ) : (
              <Box
                className="animate__animated animate__fadeIn animate__delay-1s"
                bg={"orangeBlueGradient"}
                h={1}
                mt={"23.5px"}
                flex="1"
              />
            )}
          </Flex>
        </Flex>
      </Container>
    </motion.div>
  );
}
