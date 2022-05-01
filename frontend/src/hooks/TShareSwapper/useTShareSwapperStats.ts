import { useEffect, useState } from 'react';
import useLibraFinance from '../useLibraFinance';
import { TShareSwapperStat } from '../../libra-finance/types';
import useRefresh from '../useRefresh';

const useTShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<TShareSwapperStat>();
  const { fastRefresh /*, slowRefresh*/ } = useRefresh();
  const libraFinance = useLibraFinance();

  useEffect(() => {
    async function fetchTShareSwapperStat() {
      try {
        if (libraFinance.myAccount) {
          setStat(await libraFinance.getTShareSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchTShareSwapperStat();
  }, [setStat, libraFinance, fastRefresh, account]);

  return stat;
};

export default useTShareSwapperStats;
