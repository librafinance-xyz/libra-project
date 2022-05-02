import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import useRefresh from './useRefresh';

const useFetchBoardroomAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const libraFinance = useLibraFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchBoardroomAPR() {
      try {
        setApr(await libraFinance.getBoardroomAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchBoardroomAPR();
  }, [setApr, libraFinance, slowRefresh]);

  return apr;
};

export default useFetchBoardroomAPR;
