import { ethers } from "hardhat";

async function main() {
  const LuckyCatLottery = await ethers.getContractFactory("LuckyCatLottery");
  const luckyCatLottery = await LuckyCatLottery.deploy(2, 2);

  await luckyCatLottery.deployed();

  console.log(`LuckyCatLottery deployed to:`, luckyCatLottery.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
