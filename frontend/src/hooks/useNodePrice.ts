import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';
import { ContractName } from '../libra-finance';
import config from '../config';

const useNodePrice = (poolName: ContractName, poolId: Number, sectionInUI: Number) => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();

  const fetchAmount = useCallback(async () => {
    const balance = sectionInUI === 3 ? await libraFinance.getNodePrice(poolName, poolId) : BigNumber.from(0);
    setAmount(balance);
  }, [poolName, poolId, sectionInUI, libraFinance]);

  useEffect(() => {
    if (sectionInUI === 3) {
      fetchAmount().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchAmount, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [poolName, setAmount, libraFinance, fetchAmount]);

  return amount;
};

export default useNodePrice;
