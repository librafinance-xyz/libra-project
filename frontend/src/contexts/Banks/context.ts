import { createContext } from 'react';
import { Bank } from '../../libra-finance';

export interface BanksContext {
  banks: Bank[];
}

const context = createContext<BanksContext>({
  banks: [],
});

export default context;
