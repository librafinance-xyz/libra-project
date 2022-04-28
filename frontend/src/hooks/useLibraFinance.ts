import { useContext } from 'react';
import { Context } from '../contexts/TombFinanceProvider';

const useLibraFinance = () => {
  const { libraFinance } = useContext(Context);
  return libraFinance;
};

export default useLibraFinance;
