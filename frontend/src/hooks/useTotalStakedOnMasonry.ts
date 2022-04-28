import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';
import useRefresh from './useRefresh';

const useTotalStakedOnMasonry = () => {
  const [totalStaked, setTotalStaked] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = libraFinance?.isUnlocked;

  useEffect(() => {
    async function fetchTotalStaked() {
      try {
        setTotalStaked(await libraFinance.getTotalStakedInMasonry());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      fetchTotalStaked();
    }
  }, [isUnlocked, slowRefresh, libraFinance]);

  return totalStaked;
};

export default useTotalStakedOnMasonry;
