import { useCallback } from 'react';
import useLibraFinance from './useLibraFinance';
import { Bank } from '../libra-finance';
import useHandleTransactionReceipt from './useHandleTransactionReceipt';
import { parseUnits } from 'ethers/lib/utils';
import {BigNumber} from 'ethers';

const useStake = (bank: Bank) => {
  const libraFinance = useLibraFinance();
  const handleTransactionReceipt = useHandleTransactionReceipt();

  const handleStake = useCallback(
    (amount: string) => {
        const amountBn = bank.sectionInUI !== 3 
        ? parseUnits(amount, bank.depositToken.decimal)
        : BigNumber.from(amount);
        handleTransactionReceipt(
          libraFinance.stake(bank.contract, bank.poolId, bank.sectionInUI, amountBn),
          `Stake ${amount} ${bank.depositTokenName} to ${bank.contract}`,
      );
    },
    [bank, libraFinance, handleTransactionReceipt],
  );
  return { onStake: handleStake };
};

export default useStake;
