import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';
import useRefresh from './useRefresh';

const useStakedBalanceOnBoardroom = () => {
  const { slowRefresh } = useRefresh();
  const [balance, setBalance] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;
  useEffect(() => {
    async function fetchBalance() {
      try {
        setBalance(await libraFinance.getStakedSharesOnBoardroom());
      } catch (e) {
        console.error(e);
      }
    }
    if (isUnlocked) {
      fetchBalance();
    }
  }, [slowRefresh, isUnlocked, libraFinance]);
  return balance;
};

export default useStakedBalanceOnBoardroom;
