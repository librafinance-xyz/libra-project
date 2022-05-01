import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import { Bank } from '../libra-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useZap = (bank: Bank) => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleZap = useCallback(
    (zappingToken: string, tokenName: string, amount: string) => {
      handleTransactionReceipt(
        libraFinance.zapIn(zappingToken, tokenName, amount),
        `Zap ${amount} in ${bank.depositTokenName}.`,
      );
    },
    [bank, libraFinance, handleTransactionReceipt],
  );
  return { onZap: handleZap };
};

export default useZap;
