import React from 'react';

//Graveyard ecosystem logos
import libraLogo from '../../assets/libra/libra.svg';
import lShareLogo from '../../assets/libra/lshare.svg';
import libraLogoPNG from '../../assets/libra/libra.svg';
import lShareLogoPNG from '../../assets/libra/lshare.svg';
import LBondLogo from '../../assets/libra/lbond.svg';

import libraFtmLpLogo from '../../assets/img/libra_ftm_lp.png';
import lshareFtmLpLogo from '../../assets/img/lshare_ftm_lp.png';
import libraMainLogo from '../../assets/img/libra_main.svg';
import LibraWastrLPlogo from '../../assets/img/LIBRA-WASTR.png';
import LshareWastrLPlogo from '../../assets/img/LSHARE-WASTR.png';

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
// import TwoombLPLogo from '../../assets/img/2OMB-WFTM.png';
// import TwosharesLPLogo from '../../assets/img/2SHARES-WFTM.png';
// import TwoombTwosharesLPLogo from '../../assets/img/2OMB-2SHARES.png';

import UsdcLogo from '../../assets/img/USDC.png';

// import ThreeombLPLogo from '../../assets/img/LIBRA-WFTM.png';
// import ThreesharesLPLogo from '../../assets/img/LSHARE-WFTM.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  LIBRA: libraLogo,
  LIBRAPNG: libraLogoPNG,
  LSHAREPNG: lShareLogoPNG,
  LSHARE: lShareLogo,
  LBOND: LBondLogo,
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
  // 'LSHARE-ASTR-LP': TwosharesLPLogo,
  // 'LSHARE-ASTR-LP': ThreesharesLPLogo,
  wFTM: wftmLogo,
  'LIBRA-ASTR-LP': LibraWastrLPlogo,
  'LSHARE-ASTR-LP': LshareWastrLPlogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64 }) => {
  if (!logosBySymbol[symbol]) {
    return <img src={logosBySymbol['LIBRA']} alt={`${symbol} Logo`} width={size} height={size} />;
    // throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={size} />;
};

export default TokenSymbol;
