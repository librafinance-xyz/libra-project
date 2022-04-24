import React from 'react';

//Graveyard ecosystem logos
import tombLogo from '../../assets/libra/libra.svg';
import tShareLogo from '../../assets/libra/lshare.svg';
import tombLogoPNG from '../../assets/libra/libra.svg';
import tShareLogoPNG from '../../assets/libra/lshare.svg';
import tBondLogo from '../../assets/libra/lbond.svg';

import tombFtmLpLogo from '../../assets/img/tomb_ftm_lp.png';
import tshareFtmLpLogo from '../../assets/img/tshare_ftm_lp.png';
import libraMainLogo from '../../assets/img/libra_main.svg';

import wftmLogo from '../../assets/libra/ASTR.png';
import astrLogo from '../../assets/libra/ASTR.png';
import booLogo from '../../assets/img/spooky.png';
import belugaLogo from '../../assets/img/BELUGA.png';
import twoshareLogo from '../../assets/img/t_2SHARE-01.png';
import twoombLogo from '../../assets/img/t_2OMB-01.png';
import zooLogo from '../../assets/img/zoo_logo.svg';
import shibaLogo from '../../assets/img/shiba_logo.svg';
import bifiLogo from '../../assets/img/COW.svg';
import mimLogo from '../../assets/img/mimlogopng.png';
import bloomLogo from '../../assets/img/BLOOM.jpg';
import TwoombLPLogo from '../../assets/img/2OMB-WFTM.png';
import TwosharesLPLogo from '../../assets/img/2SHARES-WFTM.png';
import TwoombTwosharesLPLogo from '../../assets/img/2OMB-2SHARES.png';

import UsdcLogo from '../../assets/img/USDC.png';

import ThreeombLPLogo from '../../assets/img/LIBRA-WFTM.png';
import ThreesharesLPLogo from '../../assets/img/LSHARES-WFTM.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  TOMB: tombLogo,
  TOMBPNG: tombLogoPNG,
  TSHAREPNG: tShareLogoPNG,
  TSHARE: tShareLogo,
  TBOND: tBondLogo,
  WFTM: wftmLogo,
  BOO: booLogo,
  SHIBA: shibaLogo,
  ZOO: zooLogo,
  BELUGA: belugaLogo,
  BIFI: bifiLogo,
  MIM: mimLogo,
  USDC: UsdcLogo,
  BLOOM: bloomLogo,
  WASTR: astrLogo,
  ASTR: astrLogo,
  // '2OMB-WFTM LP': TwoombLPLogo,
  // '2OMB-ASTR LP': TwoombLPLogo,
  'LIBRA-ASTR-LP': TwoombLPLogo,
  'LIBRA-WFTM-LP': ThreeombLPLogo,

  //
  // '2SHARES-WFTM LP': TwosharesLPLogo,
  // '2SHARES-ASTR LP': TwosharesLPLogo,
  'LSHARE-ASTR-LP': TwosharesLPLogo,
  //
  // '2OMB-2SHARES LP': TwoombTwosharesLPLogo,

  // 'LSHARES-WFTM LP': ThreesharesLPLogo,
  'LSHARES-ASTR-LP': ThreesharesLPLogo,

  wFTM: wftmLogo,
  // '2OMB': twoombLogo,
  // '2SHARES': twoshareLogo,
  // 'TOMB-FTM-LP': tombFtmLpLogo,
  // 'TSHARE-FTM-LP': tshareFtmLpLogo,
  'LIBRA-WASTR-LP': libraMainLogo,
  'LSHARE-WASTR-LP': libraMainLogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    return <img src={logosBySymbol['TOMB']} alt={`${symbol} Logo`} width={size} height={size} />;
    // throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
