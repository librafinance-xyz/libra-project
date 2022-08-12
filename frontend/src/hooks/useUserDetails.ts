import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import useGrapeyardFinance from './useLibraFinance';
import config from '../config';

const useUserDetails = (contract: string, sectionInUI: number, user: string) => {
  const libraFinance = useGrapeyardFinance();

  const [poolAPRs, setPoolAPRs] = useState<BigNumber[]>([]);

  const fetchNodes = useCallback(async () => {
    setPoolAPRs(await libraFinance.getUserDetails(contract, user));
  }, [libraFinance, contract, user]);

  useEffect(() => {
    if (user && sectionInUI === 3) {
      fetchNodes().catch((err) => console.error(`Failed to fetch APR info: ${err.stack}`));
      const refreshInterval = setInterval(fetchNodes, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [setPoolAPRs, libraFinance, fetchNodes, user, sectionInUI]);

  return poolAPRs;
};

export default useUserDetails;
