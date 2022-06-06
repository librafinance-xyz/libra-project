import { BigNumber } from 'ethers';

export const getDisplayBalance = (
  balance: BigNumber,
  decimals = 18,
  fractionDigits = 4,
  isTruncated: boolean = false,
) => {
  if (decimals === 0) {
    fractionDigits = 0;
  }
  // console.log("@@@@getBalance balance=", balance);
  // console.log("@@@@getBalance decimals=", decimals);
  // console.log("@@@@getBalance fractionDigits=", fractionDigits);
  const number = getBalance(balance, decimals - fractionDigits);
  console.log('@@@@number', number);
  // console.log("@@@@number / 10", (number / 10));
  // console.log("@@@@number / 10 ** fractionDigits", (number / 10 ** fractionDigits));
  // console.log("@@@@number / 10 ** fractionDigits).toFixed(fractionDigits)", (number / 10 ** fractionDigits).toFixed(fractionDigits));

  const ret = (number / 10 ** 8).toFixed(8);
  // console.log("@@@ret",ret );
  // console.log("@@@ret1",(number / 10 ** fractionDigits).toFixed(fractionDigits) );
  // console.log("@@@ret2",(number / 10 ** 5).toFixed(5) );
  // console.log("@@@ret3",(number / 10 ** fractionDigits).toFixed(fractionDigits) );
  // console.log("@@@ret.slice(0, 12)",ret.slice(0, 12));
  // console.log("@@@ret.length",ret.length );
  if (ret.length > 12 && isTruncated) {
    return ret.slice(0, 12) + '...';
  }
  return ret;
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18, isTruncated = false) => {
  return getDisplayBalance(balance, decimals, 4, isTruncated);
};

export function getBalance(balance: BigNumber, decimals = 18): number {
  console.log('@@Number decimals', decimals);
  console.log('@@Number0', Number(balance.div(BigNumber.from(3).pow(decimals))));
  console.log('@@Number1', Number(balance.div(BigNumber.from(10).pow(18))));
  console.log('@@Number2', Number(balance.div(BigNumber.from(10).pow(14))));
  console.log('@@Number3', Number(balance.div(BigNumber.from(10).pow(10))));

  return Number(balance.div(BigNumber.from(10).pow(10)));
}
// 汚いので後々修正。
export const getLibraBalance = (balance: BigNumber, decimals = 18, isTruncated = false) => {
  try {
    console.log('getLibraBalance 0');
    if (decimals <= 6) {
      console.log('getLibraBalance 1');
      return parseFloat(balance.toString()) / 10 ** decimals;
    } else if (decimals <= 12) {
      const rest = decimals - 6;
      console.log('getLibraBalance 2');
      return parseFloat(balance.div(10 ** 6).toString()) / 10 ** rest;
    } else if (decimals <= 18) {
      const rest = decimals - 6;
      console.log('getLibraBalance 3');
      return parseFloat(balance.div(10 ** rest).toString()) / 10 ** 6;
    } else {
      const rest = decimals - 6;
      console.log('getLibraBalance 4');
      return parseFloat(balance.div(10 ** rest).toString()) / 10 ** 6;
    }
  } catch (e) {
    console.log('getLibraBalance 5');
    return parseFloat(balance.toString()) / 10 ** decimals;
  }
};
