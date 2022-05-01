import { useCallback, useEffect, useState } from 'react';
import useLibraFinance from '../useLibraFinance';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

const useEstimateTShare = (lbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const { account } = useWallet();
  const libraFinance = useLibraFinance();

  const estimateAmountOfTShare = useCallback(async () => {
    const lbondAmountBn = parseUnits(lbondAmount);
    const amount = await libraFinance.estimateAmountOfTShare(lbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfTShare().catch((err) => console.error(`Failed to get estimateAmountOfTShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfTShare]);

  return estimateAmount;
};

export default useEstimateTShare;
