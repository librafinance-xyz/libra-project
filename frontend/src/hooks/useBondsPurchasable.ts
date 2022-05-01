import { useCallback, useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import ERC20 from '../libra-finance/ERC20';
import useLibraFinance from './useLibraFinance';
import config from '../config';

const useBondsPurchasable = () => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchBondsPurchasable() {
      try {
        setBalance(await libraFinance.getBondsPurchasable());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBondsPurchasable();
  }, [setBalance, libraFinance]);

  return balance;
};

export default useBondsPurchasable;
