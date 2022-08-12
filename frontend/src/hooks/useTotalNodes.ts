import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import useLibraFinance from './useLibraFinance';
import config from '../config';

const useTotalNodes = (contract: string, sectionInUI: number) => {
  const libraFinance = useLibraFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await libraFinance.getTotalNodes(contract));
  }, [libraFinance, contract]);

  useEffect(() => {
    if (sectionInUI === 3) {
      fetchNodes().catch((err) => console.error(`Failed to fetch useTotalNodes: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [setPoolAPRs, libraFinance, fetchNodes, sectionInUI]);

  return poolAPRs;
};

export default useTotalNodes;
