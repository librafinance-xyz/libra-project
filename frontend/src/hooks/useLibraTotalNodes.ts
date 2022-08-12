import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import uselibraFinance from './useLibraFinance';
import config from '../config';

const useLibraTotalNodes = () => {
  const libraFinance = uselibraFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await libraFinance.getLibraNodes());
  }, [libraFinance]);

  useEffect(() => {
    fetchNodes().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
    const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
    return () => clearInterval(refreshInterval);
  }, [setPoolAPRs, libraFinance, fetchNodes]);

  return poolAPRs;
};

export default useLibraTotalNodes;
