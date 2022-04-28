import { useCallback, useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import config from '../config';
import { BigNumber } from 'ethers';

const useCashPriceInLastTWAP = () => {
  const [price, setPrice] = useState<BigNumber>(BigNumber.from(0));
  const libraFinance = useLibraFinance();

  const fetchCashPrice = useCallback(async () => {
    setPrice(await libraFinance.getTombPriceInLastTWAP());
  }, [libraFinance]);

  useEffect(() => {
    fetchCashPrice().catch((err) => console.error(`Failed to fetch TOMB price: ${err.stack}`));
    const refreshInterval = setInterval(fetchCashPrice, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPrice, libraFinance, fetchCashPrice]);

  return price;
};

export default useCashPriceInLastTWAP;
