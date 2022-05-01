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
import useFantomPrice from '../../hooks/useFantomPrice';
// import { tomb as tombStag, tShare as tShareStag } from '../../tomb-finance/deployments/deployments.stag.json';
// import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.prod.json';
// temporary
import { tomb as tombStag, tShare as tShareStag } from '../../tomb-finance/deployments/deployments.dev.json';
import { tomb as tombProd, tShare as tShareProd } from '../../tomb-finance/deployments/deployments.dev.json';
import { tomb as tombDev, tShare as tShareDev } from '../../tomb-finance/deployments/deployments.dev.json';
import AppHostEnv from '../../config';

import Countdown from 'react-countdown';

import useTotalTreasuryBalance from '../../hooks/useTotalTreasuryBalance.js';

import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';

import { makeStyles } from '@material-ui/core/styles';
import useLibraFinance from '../../hooks/useLibraFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) no-repeat !important;
    background-size: cover !important;
  }
* {
    border-radius: 0 !important;
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
  // const libraAstarLpStats = useLpStats('TOMB-FTM-LP');
  const libraAstarLpStats = useLpStats('LIBRA-ASTR-LP');

  const tShareFtmLpStats = useLpStats('LSHARE-ASTR-LP');
  const libraStats = useLibraStats();
  const LShareStats = useLShareStats();
  const LBondStats = useBondStats();
  const libraFinance = useLibraFinance();
  const { price: astarPrice, marketCap: astarMarketCap, priceChange: astarPriceChange } = useFantomPrice();
  const { balance: rebatesTVL } = useTotalTreasuryBalance();
  const totalTVL = TVL + rebatesTVL;

  let tomb;
  let tShare;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  if (AppHostEnv == 'stag') {
    // stag
    tomb = tombStag;
    tShare = tShareStag;
  } else if (AppHostEnv == 'prod') {
    // prod
    tomb = tombProd;
    tShare = tShareProd;
  } else {
    // dev
    tomb = tombDev;
    tShare = tShareDev;
  }

  const buyTombAddress = 'https://twinkleswap.finance/swap?outputCurrency=' + tomb.address;
  const buyTShareAddress = 'https://twinkleswap.finance/swap?outputCurrency=' + tShare.address;

  const tombLPStats = useMemo(() => (libraAstarLpStats ? libraAstarLpStats : null), [libraAstarLpStats]);
  const lshareLPStats = useMemo(() => (tShareFtmLpStats ? tShareFtmLpStats : null), [tShareFtmLpStats]);
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
  const tShareCirculatingSupply = useMemo(
    () => (LShareStats ? String(LShareStats.circulatingSupply) : null),
    [LShareStats],
  );
  const tShareTotalSupply = useMemo(() => (LShareStats ? String(LShareStats.totalSupply) : null), [LShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (LBondStats ? Number(LBondStats.priceInDollars).toFixed(2) : null),
    [LBondStats],
  );
  const tBondPriceInFTM = useMemo(() => (LBondStats ? Number(LBondStats.tokenInAstar).toFixed(4) : null), [LBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (LBondStats ? String(LBondStats.circulatingSupply) : null),
    [LBondStats],
  );
  const tBondTotalSupply = useMemo(() => (LBondStats ? String(LBondStats.totalSupply) : null), [LBondStats]);

  const tombLpZap = useZap({ depositTokenName: 'LIBRA-ASTR-LP' });
  const tshareLpZap = useZap({ depositTokenName: 'LSHARE-ASTR-LP' });

  const StyledLink = styled.a`
    font-weight: 700;
    text-decoration: none;
    color: var(--accent-light);
  `;

  const [onPresentTombZap, onDissmissTombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTombZap();
      }}
      // tokenName={'TOMB-FTM-LP'}
      tokenName={'LIBRA-ASTR-LP'}
    />,
  );

  const [onPresentTshareZap, onDissmissTshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        tshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissTshareZap();
      }}
      tokenName={'LSHARE-ASTR-LP'}
    />,
  );

  return (
    <Page>
      <BackgroundImage />
      <Grid container spacing={3} style={{ marginBottom: '100px' }}>
        {/* Logo */}
        <Grid container item xs={12} sm={3} justify="center">
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
        <Grid container justify="center">
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
    <Grid item  xs={12} sm={12} justify="center"  style={{ margin: '12px', display: 'flex' }}>
            <Alert severity="warning" style={{ backgroundColor: "transparent", border: "1px solid var(--white)" }}>
              <b>
      Please visit our <StyledLink target="_blank" href="https://docs.tomb.finance">documentation</StyledLink> before purchasing TOMB or TSHARE!</b>
            </Alert>
        </Grid>
        </Grid> */}

        {/* TVL */}
        <Grid item xs={12} sm={4}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center">
              <h2>Total Value Locked</h2>
              {/* <CountUp style={{ fontSize: '25px' }} end={totalTVL} separator="," prefix="$" />
               */}
              <>
                <div> -- </div>
              </>
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
              {/* <h2 style={{ marginBottom: '20px' }}>Wallet Balance</h2> */}
              <Button color="primary" href="/#" variant="contained" style={{ marginRight: '8px' }}>
                Farms
              </Button>
              <Button color="primary" href="/#" variant="contained" style={{ marginRight: '8px' }}>
                Stake
              </Button>

              {/* <Button color="primary" href="/farms" variant="contained" style={{ marginRight: '10px' }}>
                Farms
              </Button>
              <Button color="primary" href="/boardroom" variant="contained" style={{ marginRight: '25px' }}>
                Stake
              </Button> */}

              {/* <Button color="primary" href="/masonry" variant="contained" style={{ marginRight: '10px' }}>
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
              <Button href="/#" variant="contained" style={{ marginRight: '10px' }} className={classes.button}>
                Buy LIBRA
              </Button>
              <Button variant="contained" href="/#" style={{ marginRight: '10px' }} className={classes.button}>
                Buy LSHARE
              </Button>
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

        {/* TOMB */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>ASTR</h2>
              <Box mt={2} style={{ backgroundColor: 'transparent !important' }}>
                <CardIcon style={{ backgroundColor: 'transparent !important' }}>
                  {/* <TokenSymbol symbol="wFTM" style={{ backgroundColor: 'transparent !important' }} /> */}
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

        {/* TOMB */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>LIBRA</h2>
              {/* <Button
                onClick={() => {
                  libraFinance.watchAssetInMetamask('TOMB');
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
                  <TokenSymbol symbol="TOMB" style={{ backgroundColor: 'transparent !important' }} />
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

        {/* TSHARE */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>LSHARE</h2>
              {/* <Button
                onClick={() => {
                  libraFinance.watchAssetInMetamask('TSHARE');
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
                  <TokenSymbol symbol="TSHARE" />
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
                Market Cap: ${(tShareCirculatingSupply * LSharePriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tShareCirculatingSupply} <br />
                Total Supply: {tShareTotalSupply}
              </span>
            </CardContent>
          </Card>
        </Grid>

        {/* TBOND */}
        <Grid item xs={12} sm={3}>
          <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <CardContent align="center" style={{ position: 'relative' }}>
              <h2>LBOND</h2>
              {/* <Button
                onClick={() => {
                  libraFinance.watchAssetInMetamask('TBOND');
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
                  <TokenSymbol symbol="TBOND" />
                </CardIcon>
              </Box>
              Current Price
              <Box>
                <span style={{ fontSize: '30px' }}>{tBondPriceInFTM ? tBondPriceInFTM : '-.----'} ASTR</span>
              </Box>
              <Box>
                <span style={{ fontSize: '16px' }}>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</span>
              </Box>
              <span style={{ fontSize: '12px' }}>
                Market Cap: ${(tBondCirculatingSupply * tBondPriceInDollars).toFixed(2)} <br />
                Circulating Supply: {tBondCirculatingSupply} <br />
                Total Supply: {tBondTotalSupply}
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
              {/*
              <Box mt={2}>
                <Button color="primary" disabled={true} onClick={onPresentTombZap} variant="contained">
                  Zap In
                </Button>
              </Box>*/}
              <Box mt={2}>
                <span style={{ fontSize: '26px' }}>
                  {tombLPStats?.tokenAmount ? tombLPStats?.tokenAmount : '-.--'} LIBRA /{' '}
                  {tombLPStats?.astarAmount ? tombLPStats?.astarAmount : '-.--'} ASTR
                </span>
              </Box>
              <Box>${tombLPStats?.priceOfOne ? tombLPStats.priceOfOne : '-.--'}</Box>
              <span style={{ fontSize: '12px' }}>
                Liquidity: ${tombLPStats?.totalLiquidity ? tombLPStats.totalLiquidity : '-.--'} <br />
                Total supply: {tombLPStats?.totalSupply ? tombLPStats.totalSupply : '-.--'}
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
              {/*<Box mt={2}>
                <Button color="primary" onClick={onPresentTshareZap} variant="contained">
                  Zap In
                </Button>
            </Box>*/}
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
