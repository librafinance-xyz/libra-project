import React, { createContext, useEffect, useState } from 'react';
import { useWallet } from '@librafinance-xyz/use-wallet';
import LibraFinance from '../../libra-finance';
import config from '../../config';

export interface LibraFinanceContext {
  libraFinance?: LibraFinance;
}

export const Context = createContext<LibraFinanceContext>({ libraFinance: null });

export const LibraFinanceProvider: React.FC = ({ children }) => {
  const { ethereum, account } = useWallet();
  const [libraFinance, setLibraFinance] = useState<LibraFinance>();

  useEffect(() => {
    if (!libraFinance) {
      const libra = new LibraFinance(config);
      if (account) {
        // wallet was unlocked at initialization
        libra.unlockWallet(ethereum, account);
      }
      setLibraFinance(libra);
    } else if (account) {
      libraFinance.unlockWallet(ethereum, account);
    }
  }, [account, ethereum, libraFinance]);

  return <Context.Provider value={{ libraFinance }}>{children}</Context.Provider>;
};
