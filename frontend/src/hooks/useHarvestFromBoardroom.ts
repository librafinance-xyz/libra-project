import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useHarvestFromBoardroom = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleReward = useCallback(() => {
    handleTransactionReceipt(libraFinance.harvestCashFromBoardroom(), 'Claim LIBRA from the Boardroom ');
  }, [libraFinance, handleTransactionReceipt]);

  return { onReward: handleReward };
};

export default useHarvestFromBoardroom;
