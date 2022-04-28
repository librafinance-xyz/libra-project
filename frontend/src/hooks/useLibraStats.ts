import { useEffect, useState } from 'react';
import useTombFinance from './useTombFinance';
import { TokenStat } from '../tomb-finance/types';
import useRefresh from './useRefresh';

const useLibraStats = () => {
  const [stat, setStat] = useState<TokenStat>();
  const { fastRefresh } = useRefresh();
  const tombFinance = useTombFinance();

  useEffect(() => {
    async function fetchLibraPrice() {
      try {
        setStat(await tombFinance.getTombStat());
      } catch (err) {
        console.error(err);
      }
    }
    fetchLibraPrice();
  }, [setStat, tombFinance, fastRefresh]);

  return stat;
};

export default useLibraStats;
