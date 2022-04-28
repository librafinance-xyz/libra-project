import { useCallback } from 'react';
import useLibraFinance from '../useLibraFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapTBondToTShare = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapTShare = useCallback(
    (tbondAmount: string) => {
      const tbondAmountBn = parseUnits(tbondAmount, 18);
      handleTransactionReceipt(libraFinance.swapTBondToTShare(tbondAmountBn), `Swap ${tbondAmount} TBond to TShare`);
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onSwapTShare: handleSwapTShare };
};

export default useSwapTBondToTShare;
