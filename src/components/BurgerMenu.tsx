import React from "react";
import {
  Box,
  Flex,
  Image,
  IconButton,
  useDisclosure,
  Spacer,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import CustomLink from "components/CustomLink";
import { useBlockchainContext } from "Context/BlockchainContext";

const BurgerMenu: React.FC = () => {
  const { isAdmin } = useBlockchainContext();
  const { isOpen, onToggle } = useDisclosure();
  const closeMenu = () => {
    if (isOpen) {
      onToggle();
    }
  };

  return (
    <Box
      position={"sticky"}
      minW="100vw"
      top={0}
      display={"block"}
      zIndex={700}
    >
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 800,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={closeMenu}
        />
      )}
      <Flex
        position={"relative"}
        bg={"gray.900"}
        zIndex={1000}
        boxShadow={"0px 4px 10px 10px #1e1e1e"}
      >
        <Image
          className="animate__animated animate__fadeIn"
          src="/images/LuckyCat.png"
          alt="logo"
          boxSize="65px"
          objectFit="contain"
        />
        <Spacer />
        <IconButton
          bg={"gray.900"}
          w={"65px"}
          h={"65px"}
          fontSize={"20px"}
          color={"white"}
          borderRadius={0}
          aria-label="Toggle Menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={onToggle}
          _hover={{
            bg: "transparent",
          }}
        />
      </Flex>
      <Box
        as={motion.div}
        initial={{ y: -457 }}
        animate={{ y: isOpen ? 0 : -457 }}
        transition="0.2s ease-out"
        position="absolute"
        top="65px"
        minW="100vw"
        bg="gray.900"
        py={4}
        boxShadow={"0px 4px 10px 10px #1e1e1e"}
        zIndex={900}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Flex direction="column">
          <Flex>
            <Box bg={"redTealGradient"} h={1} mt={"35.5px"} flex={"20%"} />
            <CustomLink
              href="/"
              linkText="All lotteries"
              colorTheme="tealOrange"
              my={3}
              flex={"60%"}
              fontSize={"20px"}
              onClick={closeMenu}
            />
            <Box bg={"orangeBlueGradient"} h={1} mt={"35.5px"} flex={"20%"} />
          </Flex>
          <Flex>
            <Box bg={"orangeBlueGradient"} h={1} mt={"35.5px"} flex={"20%"} />
            <CustomLink
              href="/my-lotteries"
              linkText="My Lotteries"
              colorTheme="bluePurple"
              my={3}
              flex={"60%"}
              fontSize={"20px"}
              onClick={closeMenu}
            />
            <Box bg={"purpleYellowGradient"} h={1} mt={"35.5px"} flex={"20%"} />
          </Flex>
          <Flex>
            <Box bg={"purpleYellowGradient"} h={1} mt={"35.5px"} flex={"20%"} />
            <CustomLink
              href="/my-bets"
              linkText="My Bets"
              colorTheme="yellowRed"
              my={3}
              flex={"60%"}
              fontSize={"20px"}
              onClick={closeMenu}
            />
            <Box bg={"redTealGradient"} h={1} mt={"35.5px"} flex={"20%"} />
          </Flex>
          <Flex>
            <Box bg={"redTealGradient"} h={1} mt={"35.5px"} flex={"20%"} />
            <CustomLink
              href="/create-lottery"
              linkText="Create Lottery"
              colorTheme="tealOrange"
              my={3}
              flex={"60%"}
              fontSize={"20px"}
              onClick={closeMenu}
            />
            <Box bg={"orangeBlueGradient"} h={1} mt={"35.5px"} flex={"20%"} />
          </Flex>
          {isAdmin ? (
            <>
              <Flex>
                <Box
                  bg={"orangeBlueGradient"}
                  h={1}
                  mt={"35.5px"}
                  flex={"20%"}
                />
                <CustomLink
                  href="/admin-menu"
                  linkText="Admin"
                  colorTheme="bluePurple"
                  my={3}
                  flex={"60%"}
                  fontSize={"20px"}
                  onClick={closeMenu}
                />
                <Box
                  bg={"purpleYellowGradient"}
                  h={1}
                  mt={"35.5px"}
                  flex={"20%"}
                />
              </Flex>
            </>
          ) : null}
        </Flex>
      </Box>
    </Box>
  );
};

export default BurgerMenu;
