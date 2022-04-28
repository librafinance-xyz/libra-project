import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useLibraFinance from '../../hooks/useLibraFinance';
import { Bank } from '../../tomb-finance';
import config, { bankDefinitions } from '../../config';

const Banks: React.FC = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];

    for (const bankInfo of Object.values(bankDefinitions)) {
      if (bankInfo.finished) {
        if (!libraFinance.isUnlocked) continue;

        // only show pools staked by user
        const balance = await libraFinance.stakedBalanceOnBank(
          bankInfo.contract,
          bankInfo.poolId,
          libraFinance.myAccount,
        );
        if (balance.lte(0)) {
          continue;
        }
      }
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: libraFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'TOMB' ? libraFinance.TOMB : libraFinance.TSHARE,
      });
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [libraFinance, setBanks]);

  useEffect(() => {
    if (libraFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, libraFinance, fetchPools]);

  return <Context.Provider value={{ banks }}>{children}</Context.Provider>;
};

export default Banks;
