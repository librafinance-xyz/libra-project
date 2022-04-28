import { useEffect, useState } from 'react';
import useLibraFinance from './useLibraFinance';
import useRefresh from './useRefresh';

const useFetchMasonryAPR = () => {
  const [apr, setApr] = useState<number>(0);
  const libraFinance = useLibraFinance();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    async function fetchMasonryAPR() {
      try {
        setApr(await libraFinance.getMasonryAPR());
      } catch (err) {
        console.error(err);
      }
    }
    fetchMasonryAPR();
  }, [setApr, libraFinance, slowRefresh]);

  return apr;
};

export default useFetchMasonryAPR;
