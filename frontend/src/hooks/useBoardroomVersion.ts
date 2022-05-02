import { useCallback, useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import useStakedBalanceOnBoardroom from './useStakedBalanceOnBoardroom';

const useBoardroomVersion = () => {
  const [boardroomVersion, setBoardroomVersion] = useState('latest');
  const libraFinance = useLibraFinance();
  const stakedBalance = useStakedBalanceOnBoardroom();

  const updateState = useCallback(async () => {
    setBoardroomVersion(await libraFinance.fetchBoardroomVersionOfUser());
  }, [libraFinance?.isUnlocked, stakedBalance]);

  useEffect(() => {
    if (libraFinance?.isUnlocked) {
      updateState().catch((err) => console.error(err.stack));
    }
  }, [libraFinance?.isUnlocked, stakedBalance]);

  return boardroomVersion;
};

export default useBoardroomVersion;
