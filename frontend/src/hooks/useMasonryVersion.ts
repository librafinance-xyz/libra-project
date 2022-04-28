import { useCallback, useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import useStakedBalanceOnMasonry from './useStakedBalanceOnMasonry';

const useMasonryVersion = () => {
  const [masonryVersion, setMasonryVersion] = useState('latest');
  const libraFinance = useLibraFinance();
  const stakedBalance = useStakedBalanceOnMasonry();

  const updateState = useCallback(async () => {
    setMasonryVersion(await libraFinance.fetchMasonryVersionOfUser());
  }, [libraFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (libraFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [libraFinance?.isUnlocked, stakedBalance]);

  return masonryVersion;
};

export default useMasonryVersion;
