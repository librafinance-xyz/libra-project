import { useCallback } from 'react';
import useLibraFinance from '../useLibraFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapTBondToTShare = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapTShare = useCallback(
    (lbondAmount: string) => {
      const lbondAmountBn = parseUnits(lbondAmount, 18);
      handleTransactionReceipt(libraFinance.swapTBondToTShare(lbondAmountBn), `Swap ${lbondAmount} TBond to TShare`);
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onSwapTShare: handleSwapTShare };
};

export default useSwapTBondToTShare;
