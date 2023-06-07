"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import LuckyCatLottery from "@LuckyCatLottery.sol/LuckyCatLottery.json";

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
  houseFee: number | undefined;
  setHouseFee: Dispatch<SetStateAction<number | undefined>>;
  fundFee: number | undefined;
  setFundFee: Dispatch<SetStateAction<number | undefined>>;
  activePublicLotteries: object[];
  setActivePublicLotteries: Dispatch<SetStateAction<object[]>>;
  userLotteries: object[];
  setUserLotteries: Dispatch<SetStateAction<object[]>>;
  userBets: object[];
  setUserBets: Dispatch<SetStateAction<object[]>>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  createStop: boolean | undefined;
  setCreateStop: Dispatch<SetStateAction<boolean | undefined>>;
  updateDate: () => Promise<void>;
  getHouseFee: () => Promise<void>;
  getFundFee: () => Promise<void>;
  getCreateStop: () => Promise<void>;
  getActivePublicLotteries: () => Promise<void>;
  getUserLotteries: () => Promise<void>;
  getUserBets: () => Promise<void>;
  setFeeHouse: (fee: number) => Promise<void>;
  setFeeFund: (fee: number) => Promise<void>;
  setStop: () => Promise<void>;
  createLottery: (
    creatorFee: number,
    betPrice: number,
    maxBettors: number,
    endingDate: Date,
    _password: string,
    privateLottery: boolean
  ) => Promise<void>;
  createLotteryAndBet: (
    creatorFee: number,
    betPrice: number,
    maxBettors: number,
    endingDate: Date,
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
  const [houseFee, setHouseFee] = useState<number | undefined>(undefined);
  const [fundFee, setFundFee] = useState<number | undefined>(undefined);
  const [activePublicLotteries, setActivePublicLotteries] = useState<object[]>(
    []
  );
  const [userLotteries, setUserLotteries] = useState<object[]>([]);
  const [userBets, setUserBets] = useState<object[]>([]);
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
    return (
      typeof provider !== "undefined" &&
      typeof contract !== "undefined" &&
      accounts.length > 0
    );
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
      getCreateStop();
    }
  }, [provider, contract, accounts]);

  const updateDate = async () => {
    setDate(new Date());
  };

  const getHouseFee = async () => {
    const houseFee = await contract?.houseFee();
    setHouseFee(houseFee);
  };

  const getFundFee = async () => {
    const fundFee = await contract?.fundFee();
    setFundFee(fundFee);
  };

  const getCreateStop = async () => {
    const createStop = await contract?.createStop();
    setCreateStop(createStop);
  };

  const getActivePublicLotteries = async () => {
    const nextLotteryId = await contract?.nextLotteryId();
    const activeLotteries = [];
    for (let i = 0; i < nextLotteryId; i++) {
      const lottery = await contract?.lotteries(i);
      if (lottery.currentState === 0 && lottery.privateLottery === false) {
        const bettors = await contract?.getBettors(i);
        activeLotteries.push({ ...lottery, bettors });
      }
    }
    setActivePublicLotteries(activePublicLotteries);
  };

  const getUserLotteries = async () => {
    const userLotteries = await contract?.getUserLotteries(accounts[0]);
    setUserLotteries(userLotteries);
  };

  const getUserBets = async () => {
    const _lotteries = await contract?.getUsersLotteriesBetted(accounts[0]);
    const userBets = [];
    for (let i = 0; i < _lotteries.length; i++) {
      const lotteryId = _lotteries[i].id.toNumber();
      const numberOfBets = (
        await contract?.getUserBets(accounts[0], lotteryId)
      ).toNumber();
      userBets[i] = { ..._lotteries[i], numberOfBets };
    }
    setUserBets(userBets);
  };

  const setFeeHouse = async (fee: number) => {
    await contract?.setHouseFee(fee, { from: accounts[0] });
    await getHouseFee();
  };

  const setFeeFund = async (fee: number) => {
    await contract?.setFundFee(fee, { from: accounts[0] });
    await getFundFee();
  };

  const setStop = async () => {
    await contract?.setStop({ from: accounts[0] });
    await getCreateStop();
  };

  const createLottery = async (
    creatorFee: number,
    betPrice: number,
    maxBettors: number,
    endingDate: Date,
    _password: string,
    privateLottery: boolean
  ) => {
    await contract?.createLottery(
      creatorFee,
      betPrice,
      maxBettors,
      endingDate,
      _password,
      privateLottery,
      { from: accounts[0] }
    );
    await getActivePublicLotteries();
    await getUserLotteries();
  };

  const createLotteryAndBet = async (
    creatorFee: number,
    betPrice: number,
    maxBettors: number,
    endingDate: Date,
    _password: string,
    privateLottery: boolean
  ) => {
    const salt = Math.floor(Math.random() * 1000);
    await contract?.createLotteryAndBet(
      creatorFee,
      betPrice,
      maxBettors,
      endingDate,
      _password,
      privateLottery,
      salt,
      { from: accounts[0], value: betPrice }
    );
    await getActivePublicLotteries();
    await getUserLotteries();
    await getUserBets();
  };

  const bet = async (lotteryId: number, _password: string) => {
    const salt = Math.floor(Math.random() * 1000);
    const lottery = await contract?.lotteries(lotteryId);
    const betPrice = lottery.betPrice;
    await contract?.bet(lotteryId, salt, _password, {
      from: accounts[0],
      value: betPrice,
    });
    await getActivePublicLotteries();
    await getUserLotteries();
    await getUserBets();
  };

  const claimPrize = async (lotteryId: number) => {
    const salt = Math.floor(Math.random() * 1000);
    await contract?.claimPrize(lotteryId, salt, { from: accounts[0] });
    await getActivePublicLotteries();
    await getUserLotteries();
    await getUserBets();
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
