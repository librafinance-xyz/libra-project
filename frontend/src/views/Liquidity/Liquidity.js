import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/home.png';
import useLpStats from '../../hooks/useLpStats';
import { Box, Button, Grid, Paper, Typography } from '@material-ui/core';
import useLibraStats from '../../hooks/useLibraStats';
import TokenInput from '../../components/TokenInput';
import useLibraFinance from '../../hooks/useLibraFinance';
import { useWallet } from '@librafinance-xyz/use-wallet';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getDisplayBalance } from '../../utils/formatBalance';
import useApproveTaxOffice from '../../hooks/useApproveTaxOffice';
import { ApprovalState } from '../../hooks/useApprove';
import useProvideLibraAstrLP from '../../hooks/useProvideLibraAstrLP';
import { Alert } from '@material-ui/lab';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const ProvideLiquidity = () => {
  const [libraAmount, setLibraAmount] = useState(0);
  const [astarAmount, setFtmAmount] = useState(0);
  const [lpTokensAmount, setLpTokensAmount] = useState(0);
  const { balance } = useWallet();
  const libraStats = useLibraStats();
  const libraFinance = useLibraFinance();
  const [approveTaxOfficeStatus, approveTaxOffice] = useApproveTaxOffice();
  const libraBalance = useTokenBalance(libraFinance.LIBRA);
  const ftmBalance = (balance / 1e18).toFixed(4);
  const { onProvideLibraAstrLP } = useProvideLibraAstrLP();
  // const libraAstarLpStats = useLpStats('LIBRA-WASTR-LP');
  const libraAstarLpStats = useLpStats('LIBRA-WASTR-LP');

  const libraLPStats = useMemo(() => (libraAstarLpStats ? libraAstarLpStats : null), [libraAstarLpStats]);
  const libraPriceInASTR = useMemo(
    () => (libraStats ? Number(libraStats.tokenInAstar).toFixed(2) : null),
    [libraStats],
  );
  const astarPriceInLIBRA = useMemo(
    () => (libraStats ? Number(1 / libraStats.tokenInAstar).toFixed(2) : null),
    [libraStats],
  );
  // const classes = useStyles();

  const handleLibraChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setLibraAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setLibraAmount(e.currentTarget.value);
    const quoteFromSpooky = await libraFinance.quoteFromSpooky(e.currentTarget.value, 'LIBRA');
    setFtmAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / libraLPStats.astarAmount);
  };

  const handleFtmChange = async (e) => {
    if (e.currentTarget.value === '' || e.currentTarget.value === 0) {
      setFtmAmount(e.currentTarget.value);
    }
    if (!isNumeric(e.currentTarget.value)) return;
    setFtmAmount(e.currentTarget.value);
    const quoteFromSpooky = await libraFinance.quoteFromSpooky(e.currentTarget.value, 'ASTR');
    setLibraAmount(quoteFromSpooky);

    setLpTokensAmount(quoteFromSpooky / libraLPStats.tokenAmount);
  };
  const handleLibraSelectMax = async () => {
    const quoteFromSpooky = await libraFinance.quoteFromSpooky(getDisplayBalance(libraBalance), 'LIBRA');
    setLibraAmount(getDisplayBalance(libraBalance));
    setFtmAmount(quoteFromSpooky);
    setLpTokensAmount(quoteFromSpooky / libraLPStats.astarAmount);
  };
  const handleFtmSelectMax = async () => {
    const quoteFromSpooky = await libraFinance.quoteFromSpooky(ftmBalance, 'ASTR');
    setFtmAmount(ftmBalance);
    setLibraAmount(quoteFromSpooky);
    setLpTokensAmount(ftmBalance / libraLPStats.astarAmount);
  };
  return (
    <Page>
      <BackgroundImage />
      <Typography color="textPrimary" align="center" variant="h3" gutterBottom>
        Provide Liquidity
      </Typography>

      <Grid container justifyContent="center">
        <Box style={{ width: '600px' }}>
          <Alert variant="filled" severity="warning" style={{ marginBottom: '10px' }}>
            <b>
              This and{' '}
              <a href="https://spookyswap.finance/" rel="noopener noreferrer" target="_blank">
                Spookyswap
              </a>{' '}
              are the only ways to provide Liquidity on LIBRA-WASTR pair without paying tax.
            </b>
          </Alert>
          <Grid item xs={12} sm={12}>
            <Paper>
              <Box mt={4}>
                <Grid item xs={12} sm={12} style={{ borderRadius: 15 }}>
                  <Box p={4}>
                    <Grid container>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleLibraSelectMax}
                          onChange={handleLibraChange}
                          value={libraAmount}
                          max={getDisplayBalance(libraBalance)}
                          symbol={'LIBRA'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <TokenInput
                          onSelectMax={handleFtmSelectMax}
                          onChange={handleFtmChange}
                          value={astarAmount}
                          max={ftmBalance}
                          symbol={'ASTR'}
                        ></TokenInput>
                      </Grid>
                      <Grid item xs={12}>
                        <p>1 LIBRA = {libraPriceInASTR} ASTR</p>
                        <p>1 ASTR = {astarPriceInLIBRA} LIBRA</p>
                        {/* <p>1 LIBRA = {libraPriceInASTR} ASTR</p>
                        <p>1 ASTR = {astarPriceInLIBRA} LIBRA</p> */}
                        <p>LP tokens ≈ {lpTokensAmount.toFixed(2)}</p>
                      </Grid>
                      <Grid xs={12} justifyContent="center" style={{ textAlign: 'center' }}>
                        {approveTaxOfficeStatus === ApprovalState.APPROVED ? (
                          <Button
                            variant="contained"
                            onClick={() => onProvideLibraAstrLP(astarAmount.toString(), libraAmount.toString())}
                            color="primary"
                            style={{ margin: '0 10px', color: '#fff' }}
                          >
                            Supply
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            onClick={() => approveTaxOffice()}
                            color="secondary"
                            style={{ margin: '0 10px' }}
                          >
                            Approve
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Box>
      </Grid>
    </Page>
  );
};

export default ProvideLiquidity;
