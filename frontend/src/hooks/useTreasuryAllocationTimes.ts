import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import { AllocationTime } from '../libra-finance/types';
import useRefresh from './useRefresh';

const useTreasuryAllocationTimes = () => {
  const { slowRefresh } = useRefresh();
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const libraFinance = useLibraFinance();
  useEffect(() => {
    if (libraFinance) {
      libraFinance.getTreasuryNextAllocationTime().then(setTime);
    }
  }, [libraFinance, slowRefresh]);
  return time;
};

export default useTreasuryAllocationTimes;
