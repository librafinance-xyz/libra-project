import { useEffect, useState } from 'react';
import uselibraFinance from './useLibraFinance';
import { NodesRewardWalletBalance } from '../libra-finance/types';
import useRefresh from './useRefresh';

const useNodesRewardBalanceStats = (walletAddress: string) => {
  const [stat, setStat] = useState<NodesRewardWalletBalance>();
  const { fastRefresh } = useRefresh();
  const libraFinance = uselibraFinance();

  useEffect(() => {
    async function fetchNodesRewardWalletBalance() {
      try {
        setStat(await libraFinance.getNodesRewardWalletBalance(walletAddress));
      } catch (err) {
        console.error(err);
      }
    }
    fetchNodesRewardWalletBalance();
  }, [setStat, libraFinance, fastRefresh]);

  return stat;
};

export default useNodesRewardBalanceStats;
