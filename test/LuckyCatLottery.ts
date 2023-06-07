import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { keccak256 } from "ethereumjs-util";

const getFutureTimestamp = async () => {
  const timestamp = await time.latest();
  return (timestamp + 86400) * 1000;
};

const salt = () => {
  return Math.floor(Math.random() * 1000);
};

const balances = async (accounts: any) => {
  const addresses = await Promise.all(
    accounts.map((account: any) => account.getAddress())
  );
  const balanceResults = await Promise.all(
    addresses.map((address) => ethers.provider.getBalance(address))
  );
  return balanceResults.map((balance) => ethers.BigNumber.from(balance));
};

describe("LuckyCatLottery", function () {
  async function deployOnceFixture() {
    const accounts = await ethers.getSigners();
    const LuckyCatLottery = await ethers.getContractFactory("LuckyCatLottery");
    const luckyCatLottery = await LuckyCatLottery.deploy(2, 2);

    return { luckyCatLottery, accounts };
  }

  describe("Fee", function () {
    it("Should NOT set the house fee if not admin", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await expect(
        luckyCatLottery.connect(accounts[1]).setHouseFee(5)
      ).to.be.revertedWith("Only admin");
    });

    it("Should NOT set the house fee if the fee not between 1 and 99", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await expect(
        luckyCatLottery.connect(accounts[0]).setHouseFee(0)
      ).to.be.revertedWith("Fee should be between 1 and 99");
      await expect(
        luckyCatLottery.connect(accounts[0]).setHouseFee(100)
      ).to.be.revertedWith("Fee should be between 1 and 99");
    });

    it("Should set the house fee", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await luckyCatLottery.connect(accounts[0]).setHouseFee(5);

      expect(await luckyCatLottery.houseFee()).to.equal(5);
    });

    it("Should NOT set the fund fee if not admin", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await expect(
        luckyCatLottery.connect(accounts[1]).setFundFee(5)
      ).to.be.revertedWith("Only admin");
    });

    it("Should NOT set the fund fee if the fee not between 0 and 99", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await expect(
        luckyCatLottery.connect(accounts[0]).setFundFee(100)
      ).to.be.revertedWith("Fee should be between 0 and 99");
    });

    it("Should set the fund fee", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await luckyCatLottery.connect(accounts[0]).setFundFee(5);

      expect(await luckyCatLottery.fundFee()).to.equal(5);
    });
  });

  describe("Stopping the new creation of lotteries", function () {
    it("Should NOT stopping the new creation of lotteries if not admin", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );

      await expect(
        luckyCatLottery.connect(accounts[1]).setCreateStop()
      ).to.be.revertedWith("Only admin");
    });
  });

  describe("Create lottery", function () {
    it("Should NOT create a lottery if createStop is true", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery.connect(accounts[0]).setCreateStop();

      await expect(
        luckyCatLottery
          .connect(accounts[0])
          .createLottery(
            0,
            1000,
            5,
            futureTimestamp,
            ethers.utils.formatBytes32String("0"),
            false
          )
      ).to.be.revertedWith("The creation of new lotteries has been stopped");
    });

    it("Should NOT create a lottery if bet price < 1000 WEI", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await expect(
        luckyCatLottery
          .connect(accounts[0])
          .createLottery(
            0,
            100,
            5,
            futureTimestamp,
            ethers.utils.formatBytes32String("0"),
            false
          )
      ).to.be.revertedWith(
        "The bet price should be superior or equal to 1000 WEI"
      );
    });

    it("Should NOT create a lottery if the fee not between 0 and 99", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await expect(
        luckyCatLottery
          .connect(accounts[0])
          .createLottery(
            100,
            1000,
            5,
            futureTimestamp,
            ethers.utils.formatBytes32String("0"),
            false
          )
      ).to.be.revertedWith("The creator fee should be between 0 and 99");
    });

    it("Should create a lottery", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          3,
          1000,
          5,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );

      const lottery = await luckyCatLottery.lotteries(0);
      const bettors = await luckyCatLottery.getBettors(0);

      expect(lottery.id.toNumber()).to.equal(0);
      expect(lottery.creatorFee.toNumber()).to.equal(3);
      expect(lottery.betPrice.toNumber()).to.equal(1000);
      expect(lottery.maxBettors.toNumber()).to.equal(5);
      expect(lottery.prizePool.toNumber()).to.equal(0);
      expect(lottery.endingDate.toNumber()).to.equal(futureTimestamp);
      expect(lottery.password).to.equal(
        "0x" +
          keccak256(
            Buffer.from(
              ethers.utils.formatBytes32String("0").substring(2),
              "hex"
            )
          ).toString("hex")
      );
      expect(lottery.privateLottery).to.equal(false);
      expect(lottery.currentState).to.equal(0);
      expect(lottery.lotteryCreator).to.equal(accounts[0].address);
      expect(bettors.length).to.equal(0);
    });

    it("Should create a lottery and bet", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLotteryAndBet(
          0,
          1000,
          5,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false,
          salt(),
          { value: 1000 }
        );

      const lottery = await luckyCatLottery.lotteries(0);
      const bettors = await luckyCatLottery.getBettors(0);

      expect(lottery.id.toNumber()).to.equal(0);
      expect(lottery.creatorFee.toNumber()).to.equal(0);
      expect(lottery.betPrice.toNumber()).to.equal(1000);
      expect(lottery.maxBettors.toNumber()).to.equal(5);
      expect(lottery.prizePool.toNumber()).to.equal(980);
      expect(lottery.endingDate.toNumber()).to.equal(futureTimestamp);
      expect(lottery.password).to.equal(
        "0x" +
          keccak256(
            Buffer.from(
              ethers.utils.formatBytes32String("0").substring(2),
              "hex"
            )
          ).toString("hex")
      );
      expect(lottery.privateLottery).to.equal(false);
      expect(lottery.currentState).to.equal(0);
      expect(lottery.lotteryCreator).to.equal(accounts[0].address);
      expect(bettors.length).to.equal(1);
    });
  });

  describe("Bet", function () {
    it("Should NOT bet if wrong password", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          2,
          futureTimestamp,
          ethers.utils.formatBytes32String("1"),
          true
        );

      await expect(
        luckyCatLottery
          .connect(accounts[1])
          .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
            value: 1000,
          })
      ).to.be.revertedWith("Wrong password");
    });

    it("Should NOT bet if wrong bet price", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          2000,
          2,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );

      await expect(
        luckyCatLottery
          .connect(accounts[1])
          .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
            value: 1000,
          })
      ).to.be.revertedWith("The value sent should be exactly the bet price");
      await expect(
        luckyCatLottery
          .connect(accounts[1])
          .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
            value: 3000,
          })
      ).to.be.revertedWith("The value sent should be exactly the bet price");
    });

    it("Should NOT bet if not in state BETTING", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          2,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );
      await luckyCatLottery
        .connect(accounts[1])
        .bet(0, salt(), ethers.utils.formatBytes32String("0"), { value: 1000 });
      await luckyCatLottery
        .connect(accounts[2])
        .bet(0, salt(), ethers.utils.formatBytes32String("0"), { value: 1000 });

      await expect(
        luckyCatLottery
          .connect(accounts[3])
          .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
            value: 1000,
          })
      ).to.be.revertedWith(
        "The lottery is finished and the prize already distributed"
      );
    });

    it("Should NOT bet if the lottery as ended", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          2,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );
      await time.increaseTo(futureTimestamp + 10);

      await expect(
        luckyCatLottery
          .connect(accounts[1])
          .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
            value: 1000,
          })
      ).to.be.revertedWith("The lottery as ended");
    });

    it("Should bet", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          10,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );
      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          2000,
          10,
          futureTimestamp,
          ethers.utils.formatBytes32String("1234"),
          true
        );
      await luckyCatLottery
        .connect(accounts[1])
        .bet(0, salt(), ethers.utils.formatBytes32String("0"), { value: 1000 });
      await luckyCatLottery
        .connect(accounts[1])
        .bet(1, salt(), ethers.utils.formatBytes32String("1234"), {
          value: 2000,
        });
      await luckyCatLottery
        .connect(accounts[2])
        .bet(0, salt(), ethers.utils.formatBytes32String("0"), { value: 1000 });
      await luckyCatLottery
        .connect(accounts[2])
        .bet(1, salt(), ethers.utils.formatBytes32String("1234"), {
          value: 2000,
        });

      const lotteryPublic = await luckyCatLottery.lotteries(0);
      const lotteryPrivate = await luckyCatLottery.lotteries(1);
      const bettorsPublic = await luckyCatLottery.getBettors(0);
      const bettorsPrivate = await luckyCatLottery.getBettors(1);

      expect(lotteryPublic.prizePool.toNumber()).to.equal(1960);
      expect(lotteryPrivate.prizePool.toNumber()).to.equal(3920);
      expect(bettorsPublic.length).to.equal(2);
      expect(bettorsPrivate.length).to.equal(2);
    });
  });

  describe("Fund prize pool", function () {
    it("Should fund the prize pool", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          10,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );
      await luckyCatLottery
        .connect(accounts[1])
        .fundPrizePool(0, { value: 10000 });

      const lottery = await luckyCatLottery.lotteries(0);

      expect(lottery.prizePool.toNumber()).to.equal(9800);
    });
  });

  describe("Claim prize", function () {
    it("Should NOT claim prize if the lottery is not ended", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          10,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );
      await luckyCatLottery
        .connect(accounts[1])
        .bet(0, salt(), ethers.utils.formatBytes32String("0"), { value: 1000 });

      await expect(
        luckyCatLottery.connect(accounts[2]).claimPrize(0, salt())
      ).to.be.revertedWith("The lottery is not ended yet");
    });

    it("Should NOT claim prize two times", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          1000,
          10,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );
      await luckyCatLottery
        .connect(accounts[1])
        .bet(0, salt(), ethers.utils.formatBytes32String("0"), { value: 1000 });
      await time.increaseTo(futureTimestamp + 10);
      await luckyCatLottery.connect(accounts[2]).claimPrize(0, salt());

      await expect(
        luckyCatLottery.connect(accounts[2]).claimPrize(0, salt())
      ).to.be.revertedWith(
        "The lottery is finished and the prize already distributed"
      );
    });

    it("Should claim prize", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();
      const bettors = [accounts[1], accounts[2], accounts[3]];

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          ethers.utils.parseUnits("1", "ether"),
          10,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );

      const balancesBefore = await balances(bettors);
      const txs = await Promise.all(
        bettors.map((bettor) =>
          luckyCatLottery
            .connect(bettor)
            .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
              value: ethers.utils.parseUnits("1", "ether"),
            })
        )
      );
      const receipts = await Promise.all(txs.map((tx) => tx.wait()));

      await time.increaseTo(futureTimestamp + 10);
      await luckyCatLottery.connect(accounts[0]).claimPrize(0, salt());

      const balancesAfter = await balances(bettors);
      const result = bettors.some((_bettor, i) => {
        const totalGasPaid = receipts[i].gasUsed.mul(
          receipts[i].effectiveGasPrice
        );
        const expected = ethers.BigNumber.from(
          ethers.utils.parseUnits("1.94", "ether")
        );
        return balancesAfter[i]
          .sub(balancesBefore[i])
          .add(totalGasPaid)
          .eq(expected);
      });

      expect(result).to.be.true;
    });
  });
  describe("Full lottery", function () {
    it("Full lottery life cycle", async function () {
      const { luckyCatLottery, accounts } = await loadFixture(
        deployOnceFixture
      );
      const futureTimestamp = await getFutureTimestamp();
      const bettors = [accounts[1], accounts[2], accounts[3]];

      await luckyCatLottery
        .connect(accounts[0])
        .createLottery(
          0,
          ethers.utils.parseUnits("1", "ether"),
          3,
          futureTimestamp,
          ethers.utils.formatBytes32String("0"),
          false
        );

      const balancesBefore = await balances(bettors);
      const txs = await Promise.all(
        bettors.map((bettor) =>
          luckyCatLottery
            .connect(bettor)
            .bet(0, salt(), ethers.utils.formatBytes32String("0"), {
              value: ethers.utils.parseUnits("1", "ether"),
            })
        )
      );
      const receipts = await Promise.all(txs.map((tx) => tx.wait()));
      const balancesAfter = await balances(bettors);
      const result = bettors.some((_bettor, i) => {
        const totalGasPaid = receipts[i].gasUsed.mul(
          receipts[i].effectiveGasPrice
        );
        const expected = ethers.BigNumber.from(
          ethers.utils.parseUnits("1.94", "ether")
        );
        return balancesAfter[i]
          .sub(balancesBefore[i])
          .add(totalGasPaid)
          .eq(expected);
      });

      expect(result).to.be.true;
    });
  });
});
