import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import useRefresh from './useRefresh';

const useTotalValueLocked = () => {
  const [totalValueLocked, setTotalValueLocked] = useState<Number>(0);
  const { slowRefresh } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setTotalValueLocked(await libraFinance.getTotalValueLocked());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setTotalValueLocked, libraFinance, slowRefresh]);

  return totalValueLocked;
};

export default useTotalValueLocked;
