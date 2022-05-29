import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useRedeemOnBoardroom = (description?: string) => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleRedeem = useCallback(() => {
    const alertDesc = description || 'Redeem LSHARE from Boardroom ';
    handleTransactionReceipt(libraFinance.exitFromBoardroom(), alertDesc);
  }, [libraFinance, description, handleTransactionReceipt]);
  return { onRedeem: handleRedeem };
};

export default useRedeemOnBoardroom;
