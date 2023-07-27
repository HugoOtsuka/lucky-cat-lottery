"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { BigNumber, ethers } from "ethers";
import LuckyCatLottery from "@LuckyCatLottery.sol/LuckyCatLottery.json";
import { Lottery, LotteryExtended } from "components/LotteryInterface";

type AppContextType = {
  provider: ethers.providers.Web3Provider | undefined;
  setProvider: Dispatch<
    SetStateAction<ethers.providers.Web3Provider | undefined>
  >;
  contract: ethers.Contract | undefined;
  setContract: Dispatch<SetStateAction<ethers.Contract | undefined>>;
  accounts: string[];
  setAccounts: Dispatch<SetStateAction<string[]>>;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  houseFee: BigNumber | undefined;
  setHouseFee: Dispatch<SetStateAction<BigNumber | undefined>>;
  fundFee: BigNumber | undefined;
  setFundFee: Dispatch<SetStateAction<BigNumber | undefined>>;
  lottery: LotteryExtended | undefined;
  setLottery: Dispatch<SetStateAction<LotteryExtended | undefined>>;
  activePublicLotteries: Lottery[];
  setActivePublicLotteries: Dispatch<SetStateAction<Lottery[]>>;
  userLotteries: Lottery[];
  setUserLotteries: Dispatch<SetStateAction<Lottery[]>>;
  userBets: Lottery[];
  setUserBets: Dispatch<SetStateAction<Lottery[]>>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  createStop: boolean | undefined;
  setCreateStop: Dispatch<SetStateAction<boolean | undefined>>;
  updateDate: () => Promise<void>;
  getHouseFee: () => Promise<void>;
  getFundFee: () => Promise<void>;
  getCreateStop: () => Promise<void>;
  getLottery: (lotteryId: number) => Promise<void>;
  getActivePublicLotteries: () => Promise<void>;
  getUserLotteries: () => Promise<void>;
  getUserBets: () => Promise<void>;
  setFeeHouse: (fee: number) => Promise<void>;
  setFeeFund: (fee: number) => Promise<void>;
  setStop: () => Promise<void>;
  createLottery: (
    creatorFee: number,
    betPrice: BigNumber,
    maxBettors: number,
    endingDate: number,
    _password: string,
    privateLottery: boolean
  ) => Promise<void>;
  createLotteryAndBet: (
    creatorFee: number,
    betPrice: BigNumber,
    maxBettors: number,
    endingDate: number,
    _password: string,
    privateLottery: boolean
  ) => Promise<void>;
  bet: (lotteryId: number, _password: string) => Promise<void>;
  claimPrize: (lotteryId: number) => Promise<void>;
};

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >(undefined);
  const [contract, setContract] = useState<ethers.Contract | undefined>(
    undefined
  );
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [houseFee, setHouseFee] = useState<BigNumber | undefined>(undefined);
  const [fundFee, setFundFee] = useState<BigNumber | undefined>(undefined);
  const [lottery, setLottery] = useState<LotteryExtended | undefined>(
    undefined
  );
  const [activePublicLotteries, setActivePublicLotteries] = useState<Lottery[]>(
    []
  );
  const [userLotteries, setUserLotteries] = useState<Lottery[]>([]);
  const [userBets, setUserBets] = useState<Lottery[]>([]);
  const [date, setDate] = useState(new Date());
  const [createStop, setCreateStop] = useState<boolean | undefined>(undefined);

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = _provider.getSigner();
      setAccounts(accounts);
      setContract(
        new ethers.Contract(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          LuckyCatLottery.abi,
          newSigner
        )
      );
      setProvider(_provider);
    } else {
      console.log("Please install metamask!");
    }
  };

  useEffect(() => {
    initConnection();
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      setAccounts(accounts);
    });
  }, []);

  const isReady = () => {
    return provider && contract && accounts.length > 0;
  };

  useEffect(() => {
    if (isReady()) {
      const initAdmin = async () => {
        const admin = await contract!.admin();
        setIsAdmin(admin.toLowerCase() === accounts[0].toLowerCase());
      };
      initAdmin();
      updateDate();
      getActivePublicLotteries();
      getUserLotteries();
      getUserBets();
      getHouseFee();
      getFundFee();
      getCreateStop();
    }
  }, [provider, contract, accounts]);

  const updateDate = async () => {
    setDate(new Date());
  };

  const getHouseFee = async () => {
    if (contract) {
      const houseFee = await contract.houseFee();
      setHouseFee(houseFee);
    }
  };

  const getFundFee = async () => {
    if (contract) {
      const fundFee = await contract.fundFee();
      setFundFee(fundFee);
    }
  };

  const getCreateStop = async () => {
    if (contract) {
      const createStop = await contract.createStop();
      setCreateStop(createStop);
    }
  };

  const getLottery = async (lotteryId: number) => {
    if (contract) {
      const lotteryc = await contract.getLottery(lotteryId);
      const numberOfBets: number = (
        await contract.getUserBets(accounts[0], lotteryId)
      ).toNumber();
      setLottery({ ...lotteryc, numberOfBets });
    }
  };

  const getActivePublicLotteries = async () => {
    if (contract) {
      const nextLotteryId = await contract.nextLotteryId();
      const activeLotteries = [];
      for (let i = 0; i < nextLotteryId; i++) {
        const lottery = await contract.lotteries(i);
        if (lottery.currentState === 0 && lottery.privateLottery === false) {
          const bettors = await contract.getBettors(i);
          activeLotteries.push({ ...lottery, bettors });
        }
      }
      setActivePublicLotteries(activeLotteries);
    }
  };

  const getUserLotteries = async () => {
    if (contract) {
      const userLotteries = await contract.getUserLotteries(accounts[0]);
      setUserLotteries(userLotteries);
    }
  };

  const getUserBets = async () => {
    if (contract) {
      const _lotteries = await contract.getUsersLotteriesBetted(accounts[0]);
      const userBets = [];
      for (let i = 0; i < _lotteries.length; i++) {
        const lotteryId = _lotteries[i].id.toNumber();
        const numberOfBets = (
          await contract.getUserBets(accounts[0], lotteryId)
        ).toNumber();
        userBets[i] = { ..._lotteries[i], numberOfBets };
      }
      setUserBets(userBets);
    }
  };

  const setFeeHouse = async (fee: number) => {
    if (contract) {
      const setFeeHouseTx = await contract.setHouseFee(fee, {
        from: accounts[0],
      });
      await setFeeHouseTx.wait();
      await getHouseFee();
    }
  };

  const setFeeFund = async (fee: number) => {
    if (contract) {
      const setFeeFundTx = await contract.setFundFee(fee, {
        from: accounts[0],
      });
      await setFeeFundTx.wait();
      await getFundFee();
    }
  };

  const setStop = async () => {
    if (contract) {
      const setStopTx = await contract.setCreateStop({ from: accounts[0] });
      await setStopTx.wait();
      await getCreateStop();
    }
  };

  const createLottery = async (
    creatorFee: number,
    betPrice: BigNumber,
    maxBettors: number,
    endingDate: number,
    _password: string,
    privateLottery: boolean
  ) => {
    if (contract) {
      const createLotteryTx = await contract.createLottery(
        creatorFee,
        betPrice,
        maxBettors,
        endingDate,
        _password,
        privateLottery,
        { from: accounts[0] }
      );
      await createLotteryTx.wait();
      await getActivePublicLotteries();
      await getUserLotteries();
    }
  };

  const createLotteryAndBet = async (
    creatorFee: number,
    betPrice: BigNumber,
    maxBettors: number,
    endingDate: number,
    _password: string,
    privateLottery: boolean
  ) => {
    if (contract) {
      const salt = Math.floor(Math.random() * 1000);
      const createLotteryAndBetTx = await contract.createLotteryAndBet(
        creatorFee,
        betPrice,
        maxBettors,
        endingDate,
        _password,
        privateLottery,
        salt,
        { from: accounts[0], value: betPrice }
      );
      await createLotteryAndBetTx.wait();
      await getActivePublicLotteries();
      await getUserLotteries();
      await getUserBets();
    }
  };

  const bet = async (lotteryId: number, _password: string) => {
    if (contract) {
      const salt = Math.floor(Math.random() * 1000);
      const lottery = await contract.lotteries(lotteryId);
      const betPrice = lottery.betPrice;
      const betTx = await contract.bet(lotteryId, salt, _password, {
        from: accounts[0],
        value: betPrice,
      });
      await betTx.wait();
      await getActivePublicLotteries();
      await getUserLotteries();
      await getUserBets();
    }
  };

  const claimPrize = async (lotteryId: number) => {
    if (contract) {
      const salt = Math.floor(Math.random() * 1000);
      const claimPrizeTx = await contract.claimPrize(lotteryId, salt, {
        from: accounts[0],
      });
      await claimPrizeTx.wait();
      await getActivePublicLotteries();
      await getUserLotteries();
      await getUserBets();
    }
  };

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        provider,
        setProvider,
        contract,
        setContract,
        accounts,
        setAccounts,
        isAdmin,
        setIsAdmin,
        houseFee,
        setHouseFee,
        fundFee,
        setFundFee,
        lottery,
        setLottery,
        activePublicLotteries,
        setActivePublicLotteries,
        userLotteries,
        setUserLotteries,
        userBets,
        setUserBets,
        date,
        setDate,
        createStop,
        setCreateStop,
        updateDate,
        getHouseFee,
        getFundFee,
        getCreateStop,
        getLottery,
        getActivePublicLotteries,
        getUserLotteries,
        getUserBets,
        setFeeHouse,
        setFeeFund,
        setStop,
        createLottery,
        createLotteryAndBet,
        bet,
        claimPrize,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
