import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from '../utils/constants';

const useProvideLibraAstrLP = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideLibraAstrLP = useCallback(
    (astarAmount: string, libraAmount: string) => {
      const libraAmountBn = parseUnits(libraAmount);
      handleTransactionReceipt(
        libraFinance.provideLibraAstrLP(astarAmount, libraAmountBn),
        `Provide Libra-ASTR LP ${libraAmount} ${astarAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onProvideLibraAstrLP: handleProvideLibraAstrLP };
};

export default useProvideLibraAstrLP;
