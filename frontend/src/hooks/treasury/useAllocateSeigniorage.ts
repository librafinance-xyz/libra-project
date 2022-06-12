import { useCallback } from 'react';
import useLibraFinance from './../useLibraFinance';
import useHandleTransactionReceipt from './../useHandleTransactionReceipt';

const useAllocateSeigniorage = (description?: string) => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();
  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Allocate Seigniorage from Boardroom ';
    handleTransactionReceipt(libraFinance.allocateSeigniorage(), alertDesc);
  }, [libraFinance, description, handleTransactionReceipt]);
  return { onSeigniorage: handleRedeem };
};

export default useAllocateSeigniorage;
