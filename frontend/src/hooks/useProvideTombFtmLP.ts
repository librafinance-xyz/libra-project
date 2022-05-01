import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from './../utils/constants';

const useProvideLibraFtmLP = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideLibraFtmLP = useCallback(
    (astarAmount: string, libraAmount: string) => {
      const libraAmountBn = parseUnits(libraAmount);
      handleTransactionReceipt(
        libraFinance.provideLibraFtmLP(astarAmount, libraAmountBn),
        `Provide Libra-FTM LP ${libraAmount} ${astarAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onProvideLibraFtmLP: handleProvideLibraFtmLP };
};

export default useProvideLibraFtmLP;
