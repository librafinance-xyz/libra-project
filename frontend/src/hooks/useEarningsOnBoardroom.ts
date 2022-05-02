import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';
import useRefresh from './useRefresh';

const useEarningsOnBoardroom = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await libraFinance.getEarningsOnBoardroom());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [isUnlocked, libraFinance, slowRefresh]);

  return balance;
};

export default useEarningsOnBoardroom;
