import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { LPStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useLpStats = (lpTicker: string) => {
  const [stat, setStat] = useState<LPStat>();
  const { slowRefresh } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchLpPrice() {
      try {
        setStat(await libraFinance.getLPStat(lpTicker));
      } catch (err) {
        console.error(err);
      }
    }
    fetchLpPrice();
  }, [setStat, libraFinance, slowRefresh, lpTicker]);

  return stat;
};

export default useLpStats;
