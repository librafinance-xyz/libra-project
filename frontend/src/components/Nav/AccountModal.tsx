import React, { useMemo } from 'react';
import styled from 'styled-components';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';

import Label from '../Label';
import Modal, { ModalProps } from '../Modal';
import ModalTitle from '../ModalTitle';
import useLibraFinance from '../../hooks/useLibraFinance';
import TokenSymbol from '../TokenSymbol';

const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
  const libraFinance = useLibraFinance();

  const libraBalance = useTokenBalance(libraFinance.LIBRA);
  const displayLibraBalance = useMemo(() => getDisplayBalance(libraBalance), [libraBalance]);

  const lshareBalance = useTokenBalance(libraFinance.LSHARE);
  const displayLshareBalance = useMemo(() => getDisplayBalance(lshareBalance), [lshareBalance]);

  const lbondBalance = useTokenBalance(libraFinance.LBOND);
  const displayLbondBalance = useMemo(() => getDisplayBalance(lbondBalance), [lbondBalance]);

  return (
    <Modal>
      <ModalTitle text="My Wallet" />

      <Balances>
        <StyledBalanceWrapper>
          <TokenSymbol symbol="LIBRA" />
          <StyledBalance>
            <StyledValue>{displayLibraBalance}</StyledValue>
            <Label text="LIBRA Available" variant="primary" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="LSHARE" />
          <StyledBalance>
            <StyledValue>{displayLshareBalance}</StyledValue>
            <Label text="LSHARE Available" variant="primary" />
          </StyledBalance>
        </StyledBalanceWrapper>

        <StyledBalanceWrapper>
          <TokenSymbol symbol="LBOND" />
          <StyledBalance>
            <StyledValue>{displayLbondBalance}</StyledValue>
            <Label text="LBOND Available" variant="primary" />
          </StyledBalance>
        </StyledBalanceWrapper>
      </Balances>
    </Modal>
  );
};

const StyledValue = styled.div`
  //color: ${(props) => props.theme.color.grey[300]};
  font-size: 30px;
  font-weight: 700;
`;

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const Balances = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
`;

const StyledBalanceWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 ${(props) => props.theme.spacing[3]}px;
`;

export default AccountModal;
