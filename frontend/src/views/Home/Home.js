import React, { useMemo } from 'react';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/home.png';
import CashImage from '../../assets/img/libra_main.svg';
import Image from 'material-ui-image';
import styled from 'styled-components';
import { Alert } from '@material-ui/lab';
import { createGlobalStyle } from 'styled-components';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useLibraStats from '../../hooks/useLibraStats';
import useLpStats from '../../hooks/useLpStats';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import useLShareStats from '../../hooks/useLShareStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useAstarPrice from '../../hooks/useAstarPrice';
// import { libra as libraStag, LShare as lShareStag } from '../../libra-finance/deployments/deployments.stag.json';
// import { libra as libraProd, LShare as lShareProd } from '../../libra-finance/deployments/deployments.prod.json';
// temporary
import { libra as libraStag, LShare as lShareStag } from '../../libra-finance/deployments/deployments.dev.json';
import { libra as libraProd, LShare as lShareProd } from '../../libra-finance/deployments/deployments.dev.json';
import { libra as libraDev, LShare as lShareDev } from '../../libra-finance/deployments/deployments.dev.json';
import AppHostEnv from '../../config';

import Countdown from 'react-countdown';

import useTotalTreasuryBalance from '../../hooks/useTotalTreasuryBalance.js';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useLibraFinance from '../../hooks/useLibraFinance';

import { registerToken } from '../../utils/wallet'

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
`;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      marginTop: '10px',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  // const libraAstarLpStats = useLpStats('LIBRA-ASTR-LP');
  const libraAstarLpStats = useLpStats('LIBRA-ASTR-LP');

  const lShareAstarLpStats = useLpStats('LSHARE-ASTR-LP');
  const libraStats = useLibraStats();
  const LShareStats = useLShareStats();
  const LBondStats = useBondStats();
  const libraFinance = useLibraFinance();
  const { price: astarPrice, marketCap: astarMarketCap, priceChange: astarPriceChange } = useAstarPrice();
  const { balance: rebatesTVL } = useTotalTreasuryBalance();
  const totalTVL = TVL + rebatesTVL;

  let libra;
  let LShare;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  if (AppHostEnv == 'stag') {
    // stag
    libra = libraStag;
    LShare = lShareStag;
  } else if (AppHostEnv == 'prod') {
    // prod
    libra = libraProd;
    LShare = lShareProd;
  } else {
    // dev
    libra = libraDev;
    LShare = lShareDev;
  }

  const buyLibraAddress = 'https://www.librax.finance/swap?outputCurrency=' + libra.address;
  const buyLShareAddress = 'https://www.librax.finance/swap?outputCurrency=' + LShare.address;

  const libraLPStats = useMemo(() => (libraAstarLpStats ? libraAstarLpStats : null), [libraAstarLpStats]);
  const lshareLPStats = useMemo(() => (lShareAstarLpStats ? lShareAstarLpStats : null), [lShareAstarLpStats]);
  const astarPriceInDollars = useMemo(
    () => (libraStats ? Number(libraStats.priceInDollars).toFixed(2) : null),
    [libraStats],
  );
  const libraPriceInASTR = useMemo(
    () => (libraStats ? Number(libraStats.tokenInAstar).toFixed(4) : null),
    [libraStats],
  );
  const libraCirculatingSupply = useMemo(
    () => (libraStats ? String(libraStats.circulatingSupply) : null),
    [libraStats],
  );
  const libraTotalSupply = useMemo(() => (libraStats ? String(libraStats.totalSupply) : null), [libraStats]);

  const LSharePriceInDollars = useMemo(
    () => (LShareStats ? Number(LShareStats.priceInDollars).toFixed(2) : null),
    [LShareStats],
  );
  const LSharePriceInASTR = useMemo(
    () => (LShareStats ? Number(LShareStats.tokenInAstar).toFixed(4) : null),
    [LShareStats],
  );
  const lShareCirculatingSupply = useMemo(
    () => (LShareStats ? String(LShareStats.circulatingSupply) : null),
    [LShareStats],
  );
  const lShareTotalSupply = useMemo(() => (LShareStats ? String(LShareStats.totalSupply) : null), [LShareStats]);

  const LBondPriceInDollars = useMemo(
    () => (LBondStats ? Number(LBondStats.priceInDollars).toFixed(2) : null),
    [LBondStats],
  );
  const LBondPriceInASTR = useMemo(() => (LBondStats ? Number(LBondStats.tokenInAstar).toFixed(4) : null), [LBondStats]);
  const LBondCirculatingSupply = useMemo(
    () => (LBondStats ? String(LBondStats.circulatingSupply) : null),
    [LBondStats],
  );
  const LBondTotalSupply = useMemo(() => (LBondStats ? String(LBondStats.totalSupply) : null), [LBondStats]);

  const libraLpZap = useZap({ depositTokenName: 'LIBRA-ASTR-LP' });
  const lshareLpZap = useZap({ depositTokenName: 'LSHARE-ASTR-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color: var(--accent-light);
  `;

  const [onPresentLibraZap, onDissmissLibraZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        libraLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissLibraZap();
      }}
      tokenName={'LIBRA-ASTR-LP'}
    />,
  );

  const [onPresentLshareZap, onDissmissLshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        lshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissLshareZap();
      }}
      tokenName={'LSHARE-ASTR-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3} style={{ marginBottom: '100px' }}>
        {/* Logo */}
        <Grid container item xs={12} sm={3} justifyContent="center">
          {/* <Paper>xs=6 sm=3</Paper> */}
          <Image className="ombImg-home" color="none" style={{ width: '300px', paddingTop: '0px' }} src={CashImage} />
        </Grid>
        {/* Explanation text */}
        <Grid item xs={12} sm={8}>
          <Paper style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Box p={4}>
              <h2>Welcome to Libra Finance!</h2>
              <Countdown
                date={1648339200 * 1000} // 3/27 0:0:0 GMT
                intervalDelay={0}
                precision={3}
                renderer={(props) => (
                  <div>
                    <h3>
                      Revealing in ....
                      {props.days} days {props.hours} hours {props.minutes} mins {props.seconds} seconds
                      <br />
                      Please{' '}
                      <a target="_blank" style={{ color: '#ffffff' }} href="https://twitter.com/LibraAstar">
                        follow us on Twitter
                      </a>{' '}
                      and{' '}
                      <a target="_blank" style={{ color: '#ffffff' }} href="https://discord.librafinance.xyz">
                        join our discord community!!{' '}
                      </a>
                    </h3>
                  </div>
                )}
              />
              <p>An algorithmic stablecoin on the Astar Network blockchain, pegged to the price of 1 ASTR</p>
              {/* <p>
                Libra utilizes multiple bonding mechanisms at the <StyledLink href="/">3DAO</StyledLink> as well as
                seigniorage.
              </p> */}
              {/* <p>
                Built on top of{' '}
                <StyledLink target="_blank" href="https://2omb.finance">
                  2omb.finance
                </StyledLink>
                .
              </p> */}
              <p>
                {/* Stake your LIBRA-ASTR LP in the <StyledLink href="/farms">Farms</StyledLink> to earn LSHARE rewards.
                Then stake your earned LSHARE in the <StyledLink href="/">Room</StyledLink> to maximize profits! */}
                Stake your LIBRA-ASTR LP in the Farms to earn LSHARE seigniorage rewards.
                {/* Then stake your earned LSHARE in the Room to maximize profits! */}
                Then stake your earned LSHARE to earn more LIBRA!
              </p>
            </Box>
          </Paper>
        </Grid>
        <Grid container justifyContent="center">
          <Box mt={3} style={{ width: '98%' }}>
            <Alert variant="filled" severity="error">
              THIS IS CURRENRY UNDER TEST VERSION. YOU MIGHT BE ABLE TO GET "DUMMY TOKEN", HOWEVER IT'S ZERO VALUE.
              {/* By using libra, you agree that the 2omb and libra team is not responsible
              for any financial losses from investing in 2omb or libra.
               */}
            </Alert>
          </Box>
        </Grid>

        {/* <Grid container spacing={3}>
    <Grid item  xs={12} sm={12} justifyContent="center"  style={{ margin: '12px', display: 'flex' }}>
            <Alert severity="warning" style={{ backgroundColor: "transparent", border: "1px solid var(--white)" }}>
              <b>
      Please visit our <StyledLink target="_blank" href="https://docs.libra.finance">documentation</StyledLink> before purchasing LIBRA or LSHARE!</b>
            </Alert>
        </Grid>
        </Grid> */}

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              <CountUp style={{ fontSize: '25px' }} end={totalTVL} separator="," prefix="$" />
            </CardContent>
          </Card>
        </Grid>

        {/* Wallet */}
        <Grid item xs={12} sm={8}>
          <Card
            style={{
              height: '100%',
              backgroundColor: 'transparent',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CardContent align="center">
              <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> 
              <Button 
                color="secondary"
                variant="contained" 
                style={{ marginRight: '10px' }}
                onClick={() => registerToken(libra.address, "LIBRA", 18)}
              >
                 LIBRA to Wallet
              </Button>

              <Button 
                color="secondary"
                variant="contained" 
                style={{ marginRight: '10px' }}
                onClick={() => registerToken(LShare.address, "LSHARE", 18)}
              >
                LSHARE to Wallet
              </Button>
              <Button color="primary" href="/farms" variant="contained" style={{ marginRight: '8px' }}>
                Farms
              </Button>
              <Button color="primary" href="/boardroom" variant="contained" style={{ marginRight: '8px' }}>
                Stake
              </Button>

              {/* <Button color="primary" href="/farms" variant="contained" style={{ marginRight: '10px' }}>
                Farms
              </Button>
              <Button color="primary" href="/boardroom" variant="contained" style={{ marginRight: '25px' }}>
                Stake
              </Button> */}

              {/* <Button color="primary" href="/boardroom" variant="contained" style={{ marginRight: '10px' }}>
                Stake Now
              </Button> */}
              {/* <Button href="/cemetery" variant="contained" style={{ marginRight: '10px' }}>
                Farm Now
              </Button> */}
              {/* <Button
                target="_blank"
                href="https://spookyswap.finance/swap?outputCurrency=0x14def7584a6c52f470ca4f4b9671056b22f4ffde"
                variant="contained"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                Buy LIBRA
              </Button> */}
              {/* <Button href="/#" variant="contained" style={{ marginRight: '10px' }} className={classes.button}>
                Buy LIBRA
              </Button>
              <Button variant="contained" href="/#" style={{ marginRight: '10px' }} className={classes.button}>
                Buy LSHARE
              </Button> */}
              {/* <Button
                variant="contained"
                target="_blank"
                href="https://dexscreener.com/fantom/0x83a52eff2e9d112e9b022399a9fd22a9db7d33ae"
                style={{ marginRight: '10px' }}
                className={classes.button}
              >
                LIBRA Chart
              </Button>
              <Button
                variant="contained"
                target="_blank"
                href="https://dexscreener.com/fantom/0xd352dac95a91afefb112dbbb3463ccfa5ec15b65"
                className={classes.button}
              >
                LSHARE Chart
              </Button> */}
            </CardContent>
          </Card>
        </Grid>

        {/* LIBRA */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>ASTR</h2>
              <Box mt={2} style={{ backgroundColor: 'transparent !important' }}>
                <CardIcon style={{ backgroundColor: 'transparent !important' }}>
                  {/* <TokenSymbol symbol="WASTR" style={{ backgroundColor: 'transparent !important' }} /> */}
                  <TokenSymbol symbol="WASTR" style={{ backgroundColor: 'transparent !important' }} />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>${astarPrice ? astarPrice : '-.----'} USD</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${astarMarketCap} <br />
                Price Change 24h: {astarPriceChange.toFixed(2)}% <br />
                <br />
                <br />
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* LIBRA */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>LIBRA</h2>
              {/* <Button
                onClick={() => {
                  libraFinance.watchAssetInMetamask('LIBRA');
                }}
                color="secondary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px', borderColor: "var(--accent-light)" }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button> */}
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="LIBRA" style={{ backgroundColor: 'transparent !important' }} />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{libraPriceInASTR ? libraPriceInASTR : '-.----'} ASTR </span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px', alignContent: 'flex-start' }}>
                  ${astarPriceInDollars ? astarPriceInDollars : '-.--'}
                </span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(libraCirculatingSupply * astarPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {libraCirculatingSupply} <br />
                Total Supply: {libraTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* LSHARE */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>LSHARE</h2>
              {/* <Button
                onClick={() => {
                  libraFinance.watchAssetInMetamask('LSHARE');
                }}
                color="secondary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px', borderColor: "var(--accent-light)" }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button> */}
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="LSHARE" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{LSharePriceInASTR ? LSharePriceInASTR : '-.----'} ASTR</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${LSharePriceInDollars ? LSharePriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(lShareCirculatingSupply * LSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {lShareCirculatingSupply} <br />
                Total Supply: {lShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* LBOND */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>LBOND</h2>
              {/* <Button
                onClick={() => {
                  libraFinance.watchAssetInMetamask('LBOND');
                }}
                color="secondary"
                variant="outlined"
                style={{ position: 'absolute', top: '10px', right: '10px', borderColor: "var(--accent-light)" }}
              >
                +&nbsp;
                <img alt="metamask fox" style={{ width: '20px' }} src={MetamaskFox} />
              </Button> */}
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="LBOND" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{LBondPriceInASTR ? LBondPriceInASTR : '-.----'} ASTR</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${LBondPriceInDollars ? LBondPriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(LBondCirculatingSupply * LBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {LBondCirculatingSupply} <br />
                Total Supply: {LBondTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center">
              <h2>LIBRA-WASTR LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="LIBRA-ASTR-LP" />
                </CardIcon>
              </Box>
      
              <Box mt={2}>
                <Button color="primary" disabled={true} onClick={onPresentLibraZap} variant="contained">
                  Zap In
                </Button>
              </Box>
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {libraLPStats?.tokenAmount ? libraLPStats?.tokenAmount : '-.--'} LIBRA /{' '}
                  {libraLPStats?.astarAmount ? libraLPStats?.astarAmount : '-.--'} ASTR
                </span>
              </Box>
              <Box>${libraLPStats?.priceOfOne ? libraLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${libraLPStats?.totalLiquidity ? libraLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {libraLPStats?.totalSupply ? libraLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center">
              <h2>LSHARE-WASTR LP</h2>
              <Box mt={2}>
                <CardIcon>
                  <TokenSymbol symbol="LSHARE-ASTR-LP" />
                </CardIcon>
              </Box>
              <Box mt={2}>
                  <Button color="primary" onClick={onPresentLshareZap} variant="contained">
                    Zap In
                  </Button>
              </Box>
                <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {lshareLPStats?.tokenAmount ? lshareLPStats?.tokenAmount : '-.--'} LSHARE /{' '}
                  {lshareLPStats?.astarAmount ? lshareLPStats?.astarAmount : '-.--'} ASTR
                </span>
              </Box>
              <Box>${lshareLPStats?.priceOfOne ? lshareLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${lshareLPStats?.totalLiquidity ? lshareLPStats.totalLiquidity : '-.--'}
                <br />
                Total supply: {lshareLPStats?.totalSupply ? lshareLPStats.totalSupply : '-.--'}
              </span>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Home;
