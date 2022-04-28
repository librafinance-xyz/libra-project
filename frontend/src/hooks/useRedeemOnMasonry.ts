import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnMasonry = (description?: string) => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem LSHARE from 3Room ';
    handleTransactionReceipt(libraFinance.exitFromMasonry(), alertDesc);
  }, [libraFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnMasonry;
