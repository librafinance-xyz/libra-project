import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';
import TombFinance from '../../tomb-finance';
import config from '../../config';

export interface TombFinanceContext {
  libraFinance?: TombFinance;
}

export const Context = createContext<TombFinanceContext>({ libraFinance: null });

export const TombFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [libraFinance, setTombFinance] = useState<TombFinance>();

  useEffect(() => {
    if (!libraFinance) {
      const tomb = new TombFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        tomb.unlockWallet(ethereum, account);
      }
      setTombFinance(tomb);
    } else if (account) {
      libraFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, libraFinance]);

  return <Context.Provider value={{ libraFinance }}>{children}</Context.Provider>;
};
