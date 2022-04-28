import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useLibraStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchLibraPrice() {
      try {
        setStat(await libraFinance.getLibraStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchLibraPrice();
  }, [setStat, libraFinance, fastRefresh]);

  return stat;
};

export default useLibraStats;
