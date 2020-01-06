const exchange = [
  'binance',
  'hitbtc',
  'huobi',
  'gateio',
  'bitfinex',
  'bittrex',
  'kucoin',
];

const apiList = {
  'imbtc': [
    'https://api.binance.com/api/v3/ticker/price?symbol=ETHBTC',
    'https://api.hitbtc.com/api/2/public/ticker/ETHBTC?limit=1',
    'https://api.huobi.pro/market/detail/merged?symbol=ethbtc',
    'https://data.gateio.life/api2/1/ticker/eth_btc',
    'https://api-pub.bitfinex.com/v2/tickers/?symbols=tETHBTC',
    'https://api.bittrex.com/api/v1.1/public/getticker?market=BTC-ETH',
    'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-BTC',
  ],
  'usdt': [
    'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT',
    'https://api.hitbtc.com/api/2/public/ticker/ETHUSD?limit=1',
    'https://api.huobi.pro/market/detail/merged?symbol=ethusdt',
    'https://data.gateio.life/api2/1/ticker/eth_usdt',
    'https://api-pub.bitfinex.com/v2/tickers/?symbols=tETHUST',
    'https://api.bittrex.com/api/v1.1/public/getticker?market=USDT-ETH',
    'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-USDT',
  ],
  'usdx': [
    'https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDC',
    'https://api.hitbtc.com/api/2/public/ticker/ETHUSDC?limit=1',
    'https://api.huobi.pro/market/detail/merged?symbol=ethhusd',
    'https://data.gateio.life/api2/1/ticker/eth_usdt',
    'https://api-pub.bitfinex.com/v2/tickers/?symbols=tETHUSD',
    'https://api.bittrex.com/api/v1.1/public/getticker?market=USD-ETH',
    'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=ETH-USDC',
  ],
};

module.exports = {
  apiList,
  exchange,
};
