import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import uselibraFinance from './useLibraFinance';
import config from '../config';

const useNodes = (contract: string, sectionInUI: number, user: string) => {
  const libraFinance = uselibraFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await libraFinance.getNodes(contract, user));
  }, [libraFinance, contract, user]);

  useEffect(() => {
    if (user && sectionInUI === 3) {
      fetchNodes().catch((err) => console.error(`Failed to fetch useNodes: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [setPoolAPRs, libraFinance, fetchNodes, user, sectionInUI]);

  return poolAPRs;
};

export default useNodes;
