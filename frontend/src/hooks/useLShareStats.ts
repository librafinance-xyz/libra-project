import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { TokenStat } from '../libra-finance/types';
import useRefresh from './useRefresh';

const useLShareStats = () => {
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

export default useLShareStats;
