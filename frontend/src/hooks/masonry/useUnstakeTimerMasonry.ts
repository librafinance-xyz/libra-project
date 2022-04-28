import { useEffect, useState } from 'react';
import useLibraFinance from './../useLibraFinance';
import { AllocationTime } from '../../tomb-finance/types';

const useUnstakeTimerMasonry = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const libraFinance = useLibraFinance();

  useEffect(() => {
    if (libraFinance) {
      libraFinance.getUserUnstakeTime().then(setTime);
    }
  }, [libraFinance]);
  return time;
};

export default useUnstakeTimerMasonry;
