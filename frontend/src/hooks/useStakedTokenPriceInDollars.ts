import { useCallback, useEffect, useState } from 'react';

import useLibraFinance from './useLibraFinance';
import config from '../config';
import ERC20 from '../libra-finance/ERC20';

const useStakedTokenPriceInDollars = (stakedTokenName: string, stakedToken: ERC20) => {
  const [stakedTokenPriceInDollars, setStakedTokenPriceInDollars] = useState('0');
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    // console.log("useStakedTokenPriceInDollars: stakedTokenName: ",stakedTokenName)
    // console.log("useStakedTokenPriceInDollars: stakedToken.address: ",stakedToken.address)
    const balance = await libraFinance.getDepositTokenPriceInDollars(stakedTokenName, stakedToken);
    // console.log("useStakedTokenPriceInDollars: balance:", balance)
    setStakedTokenPriceInDollars(balance);
    // setStakedTokenPriceInDollars(balance.toString());
  }, [stakedToken, stakedTokenName, libraFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshStakedTokenPriceInDollars = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshStakedTokenPriceInDollars);
    }
  }, [isUnlocked, setStakedTokenPriceInDollars, libraFinance, fetchBalance]);

  return stakedTokenPriceInDollars;
};

export default useStakedTokenPriceInDollars;
