import { useCallback, useState, useEffect } from 'react';
import useLibraFinance from './useLibraFinance';
import { Bank } from '../tomb-finance';
import { PoolStats } from '../tomb-finance/types';
import config from '../config';

const useStatsForPool = (bank: Bank) => {
  const libraFinance = useLibraFinance();

  const [poolAPRs, setPoolAPRs] = useState<PoolStats>();

  const fetchAPRsForPool = useCallback(async () => {
    setPoolAPRs(await libraFinance.getPoolAPRs(bank));
  }, [libraFinance, bank]);

  useEffect(() => {
    fetchAPRsForPool().catch((err) => console.error(`Failed to fetch LBOND price: ${err.stack}`));
    const refreshInterval = setInterval(fetchAPRsForPool, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, libraFinance, fetchAPRsForPool]);

  return poolAPRs;
};

export default useStatsForPool;
