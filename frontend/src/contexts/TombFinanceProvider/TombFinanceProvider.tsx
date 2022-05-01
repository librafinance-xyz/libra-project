import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import TombFinance from '../../libra-finance';
import config from '../../config';

export interface LibraFinanceContext {
  libraFinance?: TombFinance;
}

export const Context = createContext<LibraFinanceContext>({ libraFinance: null });

export const LibraFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [libraFinance, setLibraFinance] = useState<TombFinance>();

  useEffect(() => {
    if (!libraFinance) {
      const tomb = new TombFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        tomb.unlockWallet(ethereum, account);
      }
      setLibraFinance(tomb);
    } else if (account) {
      libraFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, libraFinance]);

  return <Context.Provider value={{ libraFinance }}>{children}</Context.Provider>;
};
