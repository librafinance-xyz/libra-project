import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';
import { ContractName } from '../tomb-finance';
import config from '../config';

const useStakedBalance = (poolName: ContractName, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await libraFinance.stakedBalanceOnBank(poolName, poolId, libraFinance.myAccount);
    setBalance(balance);
  }, [poolName, poolId, libraFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, setBalance, libraFinance, fetchBalance]);

  return balance;
};

export default useStakedBalance;
