import { useEffect, useState } from 'react';
import useLibraFinance from '../useLibraFinance';
import { AllocationTime } from '../../libra-finance/types';

const useClaimRewardTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const libraFinance = useLibraFinance();

  useEffect(() => {
    if (libraFinance) {
      libraFinance.getUserClaimRewardTime().then(setTime);
    }
  }, [libraFinance]);
  return time;
};

export default useClaimRewardTimerMasonry;
