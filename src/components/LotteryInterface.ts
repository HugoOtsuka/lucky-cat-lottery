import { BigNumber } from "ethers";

export interface Lottery {
  id: BigNumber;
  creatorFee: BigNumber;
  betPrice: BigNumber;
  maxBettors: BigNumber;
  prizePool: BigNumber;
  endingDate: BigNumber;
  password: string;
  privateLottery: boolean;
  currentState: number;
  lotteryCreator: string;
  bettors: string[];
}
