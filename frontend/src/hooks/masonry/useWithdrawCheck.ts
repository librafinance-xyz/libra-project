import { useEffect, useState } from 'react';
import useLibraFinance from './../useLibraFinance';
import useRefresh from '../useRefresh';

const useWithdrawCheck = () => {
  const [canWithdraw, setCanWithdraw] = useState(false);
  const libraFinance = useLibraFinance();
  const { slowRefresh } = useRefresh();
  const isUnlocked = libraFinance?.isUnlocked;

  useEffect(() => {
    async function canUserWithdraw() {
      try {
        setCanWithdraw(await libraFinance.canUserUnstakeFromMasonry());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserWithdraw();
    }
  }, [isUnlocked, libraFinance, slowRefresh]);

  return canWithdraw;
};

export default useWithdrawCheck;
