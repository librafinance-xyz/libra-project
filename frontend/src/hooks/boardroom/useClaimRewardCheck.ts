import { useEffect, useState } from 'react';
import useRefresh from '../useRefresh';
import useLibraFinance from './../useLibraFinance';

const useClaimRewardCheck = () => {
  const { slowRefresh } = useRefresh();
  const [canClaimReward, setCanClaimReward] = useState(false);
  const libraFinance = useLibraFinance();
  const isUnlocked = libraFinance?.isUnlocked;

  useEffect(() => {
    async function canUserClaimReward() {
      try {
        setCanClaimReward(await libraFinance.canUserClaimRewardFromBoardroom());
      } catch (err) {
        console.error(err);
      }
    }
    if (isUnlocked) {
      canUserClaimReward();
    }
  }, [isUnlocked, slowRefresh, libraFinance]);

  return canClaimReward;
};

export default useClaimRewardCheck;
