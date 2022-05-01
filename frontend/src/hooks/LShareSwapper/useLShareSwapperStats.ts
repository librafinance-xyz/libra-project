import { useEffect, useState } from 'react';
import useLibraFinance from '../useLibraFinance';
import { LShareSwapperStat } from '../../libra-finance/types';
import useRefresh from '../useRefresh';

const useLShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<LShareSwapperStat>();
  const { fastRefresh /*, slowRefresh*/ } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchLShareSwapperStat() {
      try {
        if (libraFinance.myAccount) {
          setStat(await libraFinance.getLShareSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchLShareSwapperStat();
  }, [setStat, libraFinance, fastRefresh, account]);

  return stat;
};

export default useLShareSwapperStats;
