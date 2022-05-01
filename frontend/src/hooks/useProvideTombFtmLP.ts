import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import { TAX_OFFICE_ADDR } from './../utils/constants';

const useProvideTombFtmLP = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleProvideTombFtmLP = useCallback(
    (astarAmount: string, libraAmount: string) => {
      const libraAmountBn = parseUnits(libraAmount);
      handleTransactionReceipt(
        libraFinance.provideTombFtmLP(astarAmount, libraAmountBn),
        `Provide Tomb-FTM LP ${libraAmount} ${astarAmount} using ${TAX_OFFICE_ADDR}`,
      );
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onProvideTombFtmLP: handleProvideTombFtmLP };
};

export default useProvideTombFtmLP;
