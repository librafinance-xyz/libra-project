import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';

const useWithdrawFromBoardroom = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleWithdraw = useCallback(
    (amount: string) => {
      handleTransactionReceipt(
        libraFinance.withdrawShareFromBoardroom(amount),
        `Withdraw ${amount} LSHARE from the Boardroom `,
      );
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onWithdraw: handleWithdraw };
};

export default useWithdrawFromBoardroom;
