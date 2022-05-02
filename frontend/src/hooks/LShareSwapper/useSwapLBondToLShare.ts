import { useCallback } from 'react';
import useLibraFinance from '../useLibraFinance';
import useHandleTransactionReceipt from '../useHandleTransactionReceipt';
// import { BigNumber } from "ethers";
import { parseUnits } from 'ethers/lib/utils';

const useSwapLBondToLShare = () => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleSwapLShare = useCallback(
    (lbondAmount: string) => {
      const lbondAmountBn = parseUnits(lbondAmount, 18);
      handleTransactionReceipt(libraFinance.swapLBondToLShare(lbondAmountBn), `Swap ${lbondAmount} LBond to LShare`);
    },
    [libraFinance, handleTransactionReceipt],
  );
  return { onSwapLShare: handleSwapLShare };
};

export default useSwapLBondToLShare;
