import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useBondStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchBondPrice() {
      try {
        setStat(await libraFinance.getBondStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondPrice();
  }, [setStat, libraFinance, slowRefresh]);

  return stat;
};

export default useBondStats;
