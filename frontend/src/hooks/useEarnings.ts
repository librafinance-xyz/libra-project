import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';
import { ContractName } from '../tomb-finance';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await libraFinance.earnedFromBank(poolName, earnTokenName, poolId, libraFinance.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, libraFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, libraFinance, fetchBalance]);

  return balance;
};

export default useEarnings;
