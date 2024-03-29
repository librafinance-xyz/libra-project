import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { TokenStat } from '../libra-finance/types';
import useRefresh from './useRefresh';

const useCashPriceInEstimatedTWAP = () => {
  const [stat, setStat] = useState<TokenStat>();
  const libraFinance = useLibraFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchCashPrice() {
      try {
        setStat(await libraFinance.getLibraStatInEstimatedTWAP());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCashPrice();
  }, [setStat, libraFinance, slowRefresh]);

  return stat;
};

export default useCashPriceInEstimatedTWAP;
