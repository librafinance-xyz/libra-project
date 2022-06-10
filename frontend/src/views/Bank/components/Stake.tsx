import React, { useMemo, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';

// import Button from '../../../components/Button';
import { Button, Card, CardContent } from '@material-ui/core';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import { AddIcon, RemoveIcon } from '../../../components/icons';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import { ThemeContext } from 'styled-components';

import useApprove, { ApprovalState } from '../../../hooks/useApprove';
import useAllowance from '../../../hooks/useAllowance';
import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';
import useZap from '../../../hooks/useZap';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';

import { getDisplayBalance } from '../../../utils/formatBalance';
import { getLibraBalance } from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import ZapModal from './ZapModal';
import TokenSymbol from '../../../components/TokenSymbol';
import { Bank } from '../../../libra-finance';

import { ConnectionRejectedError, UseWalletProvider, useWallet } from '@librafinance-xyz/use-wallet';
import { BigNumber } from 'ethers';

interface StakeProps {
  bank: Bank;
}

const Stake: React.FC<StakeProps> = ({ bank }) => {
  console.log('bank: ', bank);
  const [approveStatus, approve] = useApprove(bank.depositToken, bank.address);
  const [approved, setApproved] = useState(false);
  const wallet = useWallet();
  // const { account } = useWallet();

  const [updateTime, setUpdateTime] = useState(0);
  const [currentBlockNumber, setCurrentBlockNumber] = useState(0);

  useEffect(() => {
    console.log('Stake.check approval...');
    const timeoutId = setTimeout(() => setUpdateTime(Date.now()), 2000);
    async function aaa() {
      console.log('Stake.check approval.....');
      const blockNumber = await wallet.getBlockNumber();
      if (blockNumber === null || blockNumber <= 0) {
        console.log('check approval..... blockNumber=null');
        return;
      }
      if (currentBlockNumber == blockNumber) {
        console.log('check approval..... currentBlockNumber=', currentBlockNumber);
        // console.log('check approval..... blockNumber=', blockNumber);
        return;
      }
      setCurrentBlockNumber(blockNumber);
      // const allowance = await bank.depositToken.allowance(bank.address);
      const allowance = await bank.depositToken.allowance(wallet.account, bank.address);

      // bank.depositToken.allowance(bank.address)
      // const currentAllowance = useAllowance(bank.depositToken, bank.address, false);
      // console.log('Stake.check approval..... blockNumber check approval..... approveStatu=', approveStatus);
      // console.log('Stake.check approval..... blockNumber: ', blockNumber);
      // console.log('Stake.check approval..... currentAllowance: ', currentAllowance);
      console.log('Stake.check approval..... bank.depositToken: ', bank.depositToken);
      console.log('Stake.check approval..... allowance: ', allowance.toString());

      if (allowance.gt(BigNumber.from('100000000000000000000000'))) {
        setApproved(true);
      }
    }

    return () => {
      aaa();
      clearTimeout(timeoutId);
    };
  }, [updateTime]);

  const { color: themeColor } = useContext(ThemeContext);
  const tokenBalance = useTokenBalance(bank.depositToken);
  console.log('@@@@@@@bank.contract', bank.contract);
  console.log('@@@@@@@bank.poolId', bank.poolId);

  const stakedBalance = useStakedBalance(bank.contract, bank.poolId);
  console.log('@@@@@@@bank.depositTokenName', bank.depositTokenName);
  console.log('@@@@@@@bank.depositToken', bank.depositToken);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(bank.depositTokenName, bank.depositToken);
  console.log('@@@@@@@stakedTokenPriceInDollars', stakedTokenPriceInDollars);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, bank.depositToken.decimal))
  ).toFixed(2);
  const { onStake } = useStake(bank);
  const { onZap } = useZap(bank);
  const { onWithdraw } = useWithdraw(bank);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentZap, onDissmissZap] = useModal(
    <ZapModal
      decimals={bank.depositToken.decimal}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onZap(zappingToken, tokenName, amount);
        onDissmissZap();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={bank.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={bank.depositTokenName}
    />,
  );

  return (
    <Card style={{ boxShadow: 'none !important' }}>
      <CardContent>
        <StyledCardContentInner>
          <StyledCardHeader>
            <CardIcon>
              <TokenSymbol symbol={bank.depositToken.symbol} size={54} />
            </CardIcon>
            {/* <Value value={getDisplayBalance(stakedBalance, bank.depositToken.decimal)} /> */}
            <Value value={getLibraBalance(stakedBalance, bank.depositToken.decimal).toString()} />
            {/* <Value
              value={(
                parseFloat(
                  stakedBalance
                    .mul(100000000000)
                    .div(10 ** bank.depositToken.decimal)
                    .toString(),
                ) / 1000000000000
              ).toString()}
            /> */}

            <Label text={`≈ $${earnedInDollars}`} />
            <Label text={`${bank.depositTokenName} Staked`} />
          </StyledCardHeader>

          <StyledCardActions>
            {!approved && approveStatus !== ApprovalState.APPROVED ? (
              <>
                <Button
                  disabled={
                    // bank.closedForStaking ||
                    approveStatus === ApprovalState.PENDING || approveStatus === ApprovalState.UNKNOWN
                  }
                  onClick={approve}
                  color="primary"
                  variant="contained"
                  style={{ marginTop: '20px' }}
                >
                  {`Approve ${bank.depositTokenName}`}
                </Button>
              </>
            ) : (
              <>
                <IconButton onClick={onPresentWithdraw}>
                  <RemoveIcon />
                </IconButton>
                <StyledActionSpacer />
                {/* {bank.depositTokenName === 'WASTR-USDC-LP-LIBRAX' ? (
                  <>
                    <IconButton
                      disabled={bank.closedForStaking}
                      onClick={() => (bank.closedForStaking ? null : onPresentZap())}
                    >
                      <FlashOnIcon style={{ color: themeColor.grey[400] }} />
                    </IconButton>
                    <StyledActionSpacer />
                  </>
                ) : (
                  <></>
                )} */}

                <IconButton
                  disabled={bank.closedForStaking}
                  onClick={() => (bank.closedForStaking ? null : onPresentDeposit())}
                >
                  <AddIcon />
                </IconButton>
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </CardContent>
    </Card>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
