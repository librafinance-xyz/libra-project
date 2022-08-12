import React from 'react';

//Graveyard ecosystem logos
import libraLogo from '../../assets/libra/libra.svg';
import lShareLogo from '../../assets/libra/lshare.svg';
import libraLogoPNG from '../../assets/libra/libra.svg';
import lShareLogoPNG from '../../assets/libra/lshare.svg';
import LBondLogo from '../../assets/libra/lbond.svg';

import libraMainLogo from '../../assets/img/libra_main.svg';
import LibraAstrLPlogo from '../../assets/img/LIBRA-WASTR.png';
import LshareAstrLPlogo from '../../assets/img/LSHARE-WASTR.png';
import AstrUsdcLPlogo from '../../assets/img/WASTR-USDC.png';

import astrLogo from '../../assets/libra/ASTR.png';
import wastrLogo from '../../assets/libra/WASTR.png';
// import booLogo from '../../assets/img/spooky.png';
// import belugaLogo from '../../assets/img/BELUGA.png';
// import twoshareLogo from '../../assets/img/t_2SHARE-01.png';
// import twoombLogo from '../../assets/img/t_LIBRA-01.png';
// import zooLogo from '../../assets/img/zoo_logo.svg';
// import shibaLogo from '../../assets/img/shiba_logo.svg';
// import bifiLogo from '../../assets/img/COW.svg';
// import mimLogo from '../../assets/img/mimlogopng.png';
// import bloomLogo from '../../assets/img/BLOOM.jpg';
// import TwoombLPLogo from '../../assets/img/LIBRA-WASTR.png';
// import TwosharesLPLogo from '../../assets/img/LSHARE-WASTR.png';
// import TwoombTwosharesLPLogo from '../../assets/img/LIBRA-LSHARE.png';

import UsdcLogo from '../../assets/img/USDC.png';
import JpycLogo from '../../assets/img/JPYC.png';

// import ThreeombLPLogo from '../../assets/img/LIBRA-WASTR.png';
// import ThreesharesLPLogo from '../../assets/img/LSHARE-WASTR.png';

const logosBySymbol: { [title: string]: string } = {
  //Real tokens
  //=====================
  LIBRA: libraLogo,
  LIBRAPNG: libraLogoPNG,
  LSHAREPNG: lShareLogoPNG,
  LSHARE: lShareLogo,
  LBOND: LBondLogo,
  // BOO: booLogo,
  // SHIBA: shibaLogo,
  // ZOO: zooLogo,
  // BELUGA: belugaLogo,
  // BIFI: bifiLogo,
  // MIM: mimLogo,
  USDC: UsdcLogo,
  JPYC: JpycLogo,
  // BLOOM: bloomLogo,
  ASTR: astrLogo,
  WASTR: wastrLogo,
  'LIBRA-WASTR-LP': LibraAstrLPlogo,
  'LSHARE-WASTR-LP': LshareAstrLPlogo,
  'ASTR-USDC-LP': AstrUsdcLPlogo,
  'WASTR-USDC-LP-LIBRAX': AstrUsdcLPlogo,
};

type LogoProps = {
  symbol: string;
  size?: number;
  height?: number;
};

const TokenSymbol: React.FC<LogoProps> = ({ symbol, size = 64, height }) => {
  if (!logosBySymbol[symbol]) {
    return <img src={logosBySymbol['LIBRA']} alt={`${symbol} Logo`} width={size} height={height} />;
    // throw new Error(`Invalid Token Logo symbol: ${symbol}`);
  }
  if (!size) {
    size = 60;
  }

  if (!height) {
    height = 60;
  }
  return <img src={logosBySymbol[symbol]} alt={`${symbol} Logo`} width={size} height={height} />;
};

export default TokenSymbol;
