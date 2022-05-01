import { useCallback, useEffect, useState } from 'react';
import useLibraFinance from '../useLibraFinance';
import { useWallet } from 'use-wallet';
import { BigNumber } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

const useEstimateLShare = (lbondAmount: string) => {
  const [estimateAmount, setEstimateAmount] = useState<string>('');
  const { account } = useWallet();
  const libraFinance = useLibraFinance();

  const estimateAmountOfLShare = useCallback(async () => {
    const lbondAmountBn = parseUnits(lbondAmount);
    const amount = await libraFinance.estimateAmountOfLShare(lbondAmountBn.toString());
    setEstimateAmount(amount);
  }, [account]);

  useEffect(() => {
    if (account) {
      estimateAmountOfLShare().catch((err) => console.error(`Failed to get estimateAmountOfLShare: ${err.stack}`));
    }
  }, [account, estimateAmountOfLShare]);

  return estimateAmount;
};

export default useEstimateLShare;
