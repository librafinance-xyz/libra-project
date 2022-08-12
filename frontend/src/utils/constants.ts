export const LIBRA_TICKER = 'LIBRA';
export const LSHARE_TICKER = 'LSHARE';
export const LBOND_TICKER = 'LBOND';
export const ASTR_TICKER = 'ASTR';
export const WASTR_TICKER = 'WASTR';
export const SPOOKY_ROUTER_ADDR = '0x13381C52765EaB0a2A132a79Cc27798ef80ca6A2'; //LibraX Router
export const ZAPPER_ROUTER_ADDR = '0x8bb1fe7a50082623b372d857b4d07911c786a3e9';
export const TAX_OFFICE_ADDR = '0xcaf6C0FB8Bcb737C2D5D7e5Db615147a26091De1';
export const LIBRA_NODE_MULTIPLIER = 1;

export const useGetMultiplierForNode = (tokenName: string) => {
    if (tokenName === 'LIBRA') {
      return LIBRA_NODE_MULTIPLIER;
    } 
    return 0;
};
