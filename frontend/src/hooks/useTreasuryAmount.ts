import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import useLibraFinance from './useLibraFinance';

const useTreasuryAmount = () => {
  const [amount, setAmount] = useState(BigNumber.from(0));
  const libraFinance = useLibraFinance();

  useEffect(() => {
    if (libraFinance) {
      const { Treasury } = libraFinance.contracts;
      libraFinance.TOMB.balanceOf(Treasury.address).then(setAmount);
    }
  }, [libraFinance]);
  return amount;
};

export default useTreasuryAmount;
