import React, { /*useCallback, useEffect, */ useMemo, useState } from 'react';
import Page from '../../components/Page';
import PitImage from '../../assets/img/pit.png';
import { createGlobalStyle } from 'styled-components';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useWallet } from '@libra_finance/use-wallet';
import UnlockWallet from '../../components/UnlockWallet';
import PageHeader from '../../components/PageHeader';
import { Box, /* Paper, Typography,*/ Button, Grid } from '@material-ui/core';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
import useLibraFinance from '../../hooks/useLibraFinance';
import { getDisplayBalance /*, getBalance*/ } from '../../utils/formatBalance';
import { BigNumber /*, ethers*/ } from 'ethers';
import useSwapLBondToLShare from '../../hooks/LShareSwapper/useSwapLBondToLShare';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import useLShareSwapperStats from '../../hooks/LShareSwapper/useLShareSwapperStats';
import TokenInput from '../../components/TokenInput';
import Card from '../../components/Card';
import CardContent from '../../components/CardContent';
import TokenSymbol from '../../components/TokenSymbol';
import HomeImage from '../../assets/img/home.png'; //  Subject to change

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
* {
    border-radius: 0 !important;
}
`;

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const Sbs: React.FC = () => {
  const { path } = useRouteMatch();
  const { account } = useWallet();
  const libraFinance = useLibraFinance();
  const [lbondAmount, setLbondAmount] = useState('');
  const [lshareAmount, setLshareAmount] = useState('');

  const [approveStatus, approve] = useApprove(libraFinance.LBOND, libraFinance.contracts.LShareSwapper.address);
  const { onSwapLShare } = useSwapLBondToLShare();
  const lshareSwapperStat = useLShareSwapperStats(account);

  const lshareBalance = useMemo(
    () => (lshareSwapperStat ? Number(lshareSwapperStat.lshareBalance) : 0),
    [lshareSwapperStat],
  );
  const bondBalance = useMemo(
    () => (lshareSwapperStat ? Number(lshareSwapperStat.lbondBalance) : 0),
    [lshareSwapperStat],
  );

  const handleLBondChange = async (e: any) => {
    if (e.currentTarget.value === '') {
      setLbondAmount('');
      setLshareAmount('');
      return;
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setLbondAmount(e.currentTarget.value);
    const updateLShareAmount = await libraFinance.estimateAmountOfLShare(e.currentTarget.value);
    setLshareAmount(updateLShareAmount);
  };

  const handleLBondSelectMax = async () => {
    setLbondAmount(String(bondBalance));
    const updateLShareAmount = await libraFinance.estimateAmountOfLShare(String(bondBalance));
    setLshareAmount(updateLShareAmount);
  };

  const handleLShareSelectMax = async () => {
    setLshareAmount(String(lshareBalance));
    const rateLSharePerLibra = (await libraFinance.getLShareSwapperStat(account)).rateLSharePerLibra;
    const updateLBondAmount = BigNumber.from(10)
      .pow(30)
      .div(BigNumber.from(rateLSharePerLibra))
      .mul(Number(lshareBalance) * 1e6);
    setLbondAmount(getDisplayBalance(updateLBondAmount, 18, 6));
  };

  const handleLShareChange = async (e: any) => {
    const inputData = e.currentTarget.value;
    if (inputData === '') {
      setLshareAmount('');
      setLbondAmount('');
      return;
    }
    if (!isNumeric(inputData)) return;
    setLshareAmount(inputData);
    const rateLSharePerLibra = (await libraFinance.getLShareSwapperStat(account)).rateLSharePerLibra;
    const updateLBondAmount = BigNumber.from(10)
      .pow(30)
      .div(BigNumber.from(rateLSharePerLibra))
      .mul(Number(inputData) * 1e6);
    setLbondAmount(getDisplayBalance(updateLBondAmount, 18, 6));
  };

  return (
    <Switch>
      <Page>
        <BackgroundImage />
        {!!account ? (
          <>
            <Route exact path={path}>
              <PageHeader icon={'🏦'} title="LBond -> LShare Swap" subtitle="Swap LBond to LShare" />
            </Route>
            <Box mt={5}>
              <Grid container justifyContent="center" spacing={6}>
                <StyledBoardroom>
                  <StyledCardsWrapper>
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>LBonds</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={libraFinance.LBOND.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleLBondSelectMax}
                                onChange={handleLBondChange}
                                value={lbondAmount}
                                max={bondBalance}
                                symbol="LBond"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${bondBalance} LBOND Available in Wallet`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                    <Spacer size="lg" />
                    <StyledCardWrapper>
                      <Card>
                        <CardContent>
                          <StyledCardContentInner>
                            <StyledCardTitle>LShare</StyledCardTitle>
                            <StyledExchanger>
                              <StyledToken>
                                <StyledCardIcon>
                                  <TokenSymbol symbol={libraFinance.LSHARE.symbol} size={54} />
                                </StyledCardIcon>
                              </StyledToken>
                            </StyledExchanger>
                            <Grid item xs={12}>
                              <TokenInput
                                onSelectMax={handleLShareSelectMax}
                                onChange={handleLShareChange}
                                value={lshareAmount}
                                max={lshareBalance}
                                symbol="LShare"
                              ></TokenInput>
                            </Grid>
                            <StyledDesc>{`${lshareBalance} LSHARE Available in Swapper`}</StyledDesc>
                          </StyledCardContentInner>
                        </CardContent>
                      </Card>
                    </StyledCardWrapper>
                  </StyledCardsWrapper>
                </StyledBoardroom>
              </Grid>
            </Box>

            <Box mt={5}>
              <Grid container justifyContent="center">
                <Grid item xs={8}>
                  <Card>
                    <CardContent>
                      <StyledApproveWrapper>
                        {approveStatus !== ApprovalState.APPROVED ? (
                          <Button
                            disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                            color="primary"
                            variant="contained"
                            onClick={approve}
                            size="medium"
                          >
                            Approve LBOND
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            variant="contained"
                            onClick={() => onSwapLShare(lbondAmount.toString())}
                            size="medium"
                          >
                            Swap
                          </Button>
                        )}
                      </StyledApproveWrapper>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <UnlockWallet />
        )}
      </Page>
    </Switch>
  );
};

const StyledBoardroom = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledCardsWrapper = styled.div`
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`;

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledApproveWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
const StyledCardTitle = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  font-weight: 700;
  height: 64px;
  justify-content: center;
  margin-top: ${(props) => -props.theme.spacing[3]}px;
`;

const StyledCardIcon = styled.div`
  background-color: ${(props) => props.theme.color.grey[900]};
  width: 72px;
  height: 72px;
  border-radius: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing[2]}px;
`;

const StyledExchanger = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[5]}px;
`;

const StyledToken = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-weight: 600;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledDesc = styled.span``;

export default Sbs;
