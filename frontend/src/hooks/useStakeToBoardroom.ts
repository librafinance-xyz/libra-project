import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useStakeToBoardroom = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
      handleTransactionReceipt(libraFinance.stakeShareToBoardroom(amount), `Stake ${amount} LSHARE to the Boardroom `);
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStakeToBoardroom;
