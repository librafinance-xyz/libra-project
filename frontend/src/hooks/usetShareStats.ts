import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useShareStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { slowRefresh } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchSharePrice() {
      try {
        setStat(await libraFinance.getShareStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchSharePrice();
  }, [setStat, libraFinance, slowRefresh]);

  return stat;
};

export default useShareStats;
