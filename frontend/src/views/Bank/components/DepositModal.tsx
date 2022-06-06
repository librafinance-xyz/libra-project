import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '@material-ui/core';
// import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal';
import ModalActions from '../../../components/ModalActions';
import ModalTitle from '../../../components/ModalTitle';
import TokenInput from '../../../components/TokenInput';

// import { getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';

interface DepositModalProps extends ModalProps {
  max: BigNumber;
  decimals: number;
  onConfirm: (amount: string) => void;
  tokenName?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({ max, decimals, onConfirm, onDismiss, tokenName = '' }) => {
  const [val, setVal] = useState('');

  const fullBalance = useMemo(() => {
    // console.log('getFullDisplayBalance(max.toString=', max.toString());
    // console.log('getFullDisplayBalance(max=', max);
    // console.log('getFullDisplayBalance(max, decimals, false)', getFullDisplayBalance(max, decimals, false));
    return (
      parseInt(
        max
          .mul(1000000)
          .div(10 ** decimals)
          .toString(),
      ) / 1000000
    ).toString();
    // return getFullDisplayBalance(max, decimals, false);
  }, [max, decimals]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  return (
    <Modal>
      {/* {max.toString()} */}
      <ModalTitle text={`Deposit ${tokenName}`} />
      <TokenInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        {/* <Button color="secondary" variant="outlined" onClick={onDismiss}>Cancel</Button> */}
        <Button color="primary" variant="contained" onClick={() => onConfirm(val)}>
          Confirm
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default DepositModal;
