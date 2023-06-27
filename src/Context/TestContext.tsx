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
import LuckyCatLottery from "@Lock.sol/Lock.json";

type AppContextType = {
  provider: ethers.providers.Web3Provider | undefined;
  setProvider: Dispatch<
    SetStateAction<ethers.providers.Web3Provider | undefined>
  >;
  contract: ethers.Contract | undefined;
  setContract: Dispatch<SetStateAction<ethers.Contract | undefined>>;
  accounts: string[];
  setAccounts: Dispatch<SetStateAction<string[]>>;
  greeting: number | undefined;
  setGreeting: Dispatch<SetStateAction<number | undefined>>;
  getGreeting: () => Promise<void>;
  setGreetingSC: (greeting: number) => Promise<void>;
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
  const [greeting, setGreeting] = useState<number | undefined>(undefined);

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

  const getGreeting = async () => {
    if (contract) {
      const greeting: BigNumber = await contract.greet();
      setGreeting(greeting.toNumber());
    }
  };

  const setGreetingSC = async (greeting: number) => {
    if (contract) {
      await contract.setGreeting(greeting, { from: accounts[0] });
      await getGreeting();
    }
  };

  const isReady = () => {
    return provider && contract && accounts.length > 0;
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
        greeting,
        setGreeting,
        getGreeting,
        setGreetingSC,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
