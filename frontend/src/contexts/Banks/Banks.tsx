import React, { useCallback, useEffect, useState } from 'react';
import Context from './context';
import useLibraFinance from '../../hooks/useLibraFinance';
import { Bank } from '../../libra-finance';
import config, { bankDefinitions } from '../../config';

type BanksProps = {
  children: React.ReactNode; 
};

const Banks = (props: BanksProps) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  const fetchPools = useCallback(async () => {
    const banks: Bank[] = [];
    console.log(bankDefinitions)
    for (const bankInfo of Object.values(bankDefinitions)) {
      console.log("Banks: ", bankInfo)
      console.log("bankInfo.finished: ", bankInfo.finished)
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
      console.log("bankInfo.name,: ",bankInfo.name,)
      console.log("bankInfo.contract,: ",bankInfo.contract,)
      console.log("config.deployments[bankInfo.contract].address,: ",config.deployments[bankInfo.contract].address,)
      console.log("bankInfo.depositTokenName,: ",bankInfo.depositTokenName,)
      console.log("libraFinance.externalTokens[bankInfo.depositTokenName],: ",libraFinance.externalTokens[bankInfo.depositTokenName],)
      banks.push({
        ...bankInfo,
        address: config.deployments[bankInfo.contract].address,
        depositToken: libraFinance.externalTokens[bankInfo.depositTokenName],
        earnToken: bankInfo.earnTokenName === 'LIBRA' ? libraFinance.LIBRA : libraFinance.LSHARE,
      });
      console.log("bankInfo.name2: ",bankInfo.name,)
    }
    banks.sort((a, b) => (a.sort > b.sort ? 1 : -1));
    setBanks(banks);
  }, [libraFinance, setBanks]);

  useEffect(() => {
    if (libraFinance) {
      fetchPools().catch((err) => console.error(`Failed to fetch pools: ${err.stack}`));
    }
  }, [isUnlocked, libraFinance, fetchPools]);

  return <Context.Provider value={{ banks }}>{props.children}</Context.Provider>;
};

export default Banks;
