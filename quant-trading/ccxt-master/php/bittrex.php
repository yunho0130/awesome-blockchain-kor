<?php

namespace ccxt;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception as Exception; // a common import

class bittrex extends Exchange {

    public function describe () {
        return array_replace_recursive (parent::describe (), array (
            'id' => 'bittrex',
            'name' => 'Bittrex',
            'countries' => 'US',
            'version' => 'v1.1',
            'rateLimit' => 1500,
            // new metainfo interface
            'has' => array (
                'CORS' => true,
                'createMarketOrder' => false,
                'fetchDepositAddress' => true,
                'fetchClosedOrders' => true,
                'fetchCurrencies' => true,
                'fetchMyTrades' => false,
                'fetchOHLCV' => true,
                'fetchOrder' => true,
                'fetchOpenOrders' => true,
                'fetchTickers' => true,
                'withdraw' => true,
            ),
            'timeframes' => array (
                '1m' => 'oneMin',
                '5m' => 'fiveMin',
                '30m' => 'thirtyMin',
                '1h' => 'hour',
                '1d' => 'day',
            ),
            'urls' => array (
                'logo' => 'https://user-images.githubusercontent.com/1294454/27766352-cf0b3c26-5ed5-11e7-82b7-f3826b7a97d8.jpg',
                'api' => array (
                    'public' => 'https://bittrex.com/api',
                    'account' => 'https://bittrex.com/api',
                    'market' => 'https://bittrex.com/api',
                    'v2' => 'https://bittrex.com/api/v2.0/pub',
                ),
                'www' => 'https://bittrex.com',
                'doc' => array (
                    'https://bittrex.com/Home/Api',
                    'https://www.npmjs.org/package/node.bittrex.api',
                ),
                'fees' => array (
                    'https://bittrex.com/Fees',
                    'https://support.bittrex.com/hc/en-us/articles/115000199651-What-fees-does-Bittrex-charge-',
                ),
            ),
            'api' => array (
                'v2' => array (
                    'get' => array (
                        'currencies/GetBTCPrice',
                        'market/GetTicks',
                        'market/GetLatestTick',
                        'Markets/GetMarketSummaries',
                        'market/GetLatestTick',
                    ),
                ),
                'public' => array (
                    'get' => array (
                        'currencies',
                        'markethistory',
                        'markets',
                        'marketsummaries',
                        'marketsummary',
                        'orderbook',
                        'ticker',
                    ),
                ),
                'account' => array (
                    'get' => array (
                        'balance',
                        'balances',
                        'depositaddress',
                        'deposithistory',
                        'order',
                        'orders',
                        'orderhistory',
                        'withdrawalhistory',
                        'withdraw',
                    ),
                ),
                'market' => array (
                    'get' => array (
                        'buylimit',
                        'buymarket',
                        'cancel',
                        'openorders',
                        'selllimit',
                        'sellmarket',
                    ),
                ),
            ),
            'fees' => array (
                'trading' => array (
                    'tierBased' => false,
                    'percentage' => true,
                    'maker' => 0.0025,
                    'taker' => 0.0025,
                ),
                'funding' => array (
                    'tierBased' => false,
                    'percentage' => false,
                    'withdraw' => array (
                        'BTC' => 0.001,
                        'LTC' => 0.01,
                        'DOGE' => 2,
                        'VTC' => 0.02,
                        'PPC' => 0.02,
                        'FTC' => 0.2,
                        'RDD' => 2,
                        'NXT' => 2,
                        'DASH' => 0.002,
                        'POT' => 0.002,
                    ),
                    'deposit' => array (
                        'BTC' => 0,
                        'LTC' => 0,
                        'DOGE' => 0,
                        'VTC' => 0,
                        'PPC' => 0,
                        'FTC' => 0,
                        'RDD' => 0,
                        'NXT' => 0,
                        'DASH' => 0,
                        'POT' => 0,
                    ),
                ),
            ),
            'exceptions' => array (
                // 'Call to Cancel was throttled. Try again in 60 seconds.' => '\\ccxt\\DDoSProtection',
                // 'Call to GetBalances was throttled. Try again in 60 seconds.' => '\\ccxt\\DDoSProtection',
                'APISIGN_NOT_PROVIDED' => '\\ccxt\\AuthenticationError',
                'INVALID_SIGNATURE' => '\\ccxt\\AuthenticationError',
                'INVALID_CURRENCY' => '\\ccxt\\ExchangeError',
                'INVALID_PERMISSION' => '\\ccxt\\AuthenticationError',
                'INSUFFICIENT_FUNDS' => '\\ccxt\\InsufficientFunds',
                'QUANTITY_NOT_PROVIDED' => '\\ccxt\\InvalidOrder',
                'MIN_TRADE_REQUIREMENT_NOT_MET' => '\\ccxt\\InvalidOrder',
                'ORDER_NOT_OPEN' => '\\ccxt\\InvalidOrder',
                'INVALID_ORDER' => '\\ccxt\\InvalidOrder',
                'UUID_INVALID' => '\\ccxt\\OrderNotFound',
                'RATE_NOT_PROVIDED' => '\\ccxt\\InvalidOrder', // createLimitBuyOrder ('ETH/BTC', 1, 0)
                'WHITELIST_VIOLATION_IP' => '\\ccxt\\PermissionDenied',
            ),
            'options' => array (
                'parseOrderStatus' => false,
                'hasAlreadyAuthenticatedSuccessfully' => false, // a workaround for APIKEY_INVALID
            ),
            'commonCurrencies' => array (
                'BITS' => 'SWIFT',
            ),
        ));
    }

    public function cost_to_precision ($symbol, $cost) {
        return $this->truncate (floatval ($cost), $this->markets[$symbol]['precision']['price']);
    }

    public function fee_to_precision ($symbol, $fee) {
        return $this->truncate (floatval ($fee), $this->markets[$symbol]['precision']['price']);
    }

    public function fetch_markets () {
        $response = $this->v2GetMarketsGetMarketSummaries ();
        $result = array ();
        for ($i = 0; $i < count ($response['result']); $i++) {
            $market = $response['result'][$i]['Market'];
            $id = $market['MarketName'];
            $baseId = $market['MarketCurrency'];
            $quoteId = $market['BaseCurrency'];
            $base = $this->common_currency_code($baseId);
            $quote = $this->common_currency_code($quoteId);
            $symbol = $base . '/' . $quote;
            $precision = array (
                'amount' => 8,
                'price' => 8,
            );
            $active = $market['IsActive'] || $market['IsActive'] === 'true';
            $result[] = array (
                'id' => $id,
                'symbol' => $symbol,
                'base' => $base,
                'quote' => $quote,
                'baseId' => $baseId,
                'quoteId' => $quoteId,
                'active' => $active,
                'info' => $market,
                'precision' => $precision,
                'limits' => array (
                    'amount' => array (
                        'min' => $market['MinTradeSize'],
                        'max' => null,
                    ),
                    'price' => array (
                        'min' => pow (10, -$precision['price']),
                        'max' => null,
                    ),
                ),
            );
        }
        return $result;
    }

    public function fetch_balance ($params = array ()) {
        $this->load_markets();
        $response = $this->accountGetBalances ($params);
        $balances = $response['result'];
        $result = array ( 'info' => $balances );
        $indexed = $this->index_by($balances, 'Currency');
        $keys = is_array ($indexed) ? array_keys ($indexed) : array ();
        for ($i = 0; $i < count ($keys); $i++) {
            $id = $keys[$i];
            $currency = $this->common_currency_code($id);
            $account = $this->account ();
            $balance = $indexed[$id];
            $free = floatval ($balance['Available']);
            $total = floatval ($balance['Balance']);
            $used = $total - $free;
            $account['free'] = $free;
            $account['used'] = $used;
            $account['total'] = $total;
            $result[$currency] = $account;
        }
        return $this->parse_balance($result);
    }

    public function fetch_order_book ($symbol, $limit = null, $params = array ()) {
        $this->load_markets();
        $response = $this->publicGetOrderbook (array_merge (array (
            'market' => $this->market_id($symbol),
            'type' => 'both',
        ), $params));
        $orderbook = $response['result'];
        if (is_array ($params) && array_key_exists ('type', $params)) {
            if ($params['type'] === 'buy') {
                $orderbook = array (
                    'buy' => $response['result'],
                    'sell' => array (),
                );
            } else if ($params['type'] === 'sell') {
                $orderbook = array (
                    'buy' => array (),
                    'sell' => $response['result'],
                );
            }
        }
        return $this->parse_order_book($orderbook, null, 'buy', 'sell', 'Rate', 'Quantity');
    }

    public function parse_ticker ($ticker, $market = null) {
        $timestamp = $this->safe_string($ticker, 'TimeStamp');
        $iso8601 = null;
        if (gettype ($timestamp) === 'string') {
            if (strlen ($timestamp) > 0) {
                $timestamp = $this->parse8601 ($timestamp);
                $iso8601 = $this->iso8601 ($timestamp);
            }
        }
        $symbol = null;
        if ($market)
            $symbol = $market['symbol'];
        $previous = $this->safe_float($ticker, 'PrevDay');
        $last = $this->safe_float($ticker, 'Last');
        $change = null;
        $percentage = null;
        if ($last !== null)
            if ($previous !== null) {
                $change = $last - $previous;
                if ($previous > 0)
                    $percentage = ($change / $previous) * 100;
            }
        return array (
            'symbol' => $symbol,
            'timestamp' => $timestamp,
            'datetime' => $iso8601,
            'high' => $this->safe_float($ticker, 'High'),
            'low' => $this->safe_float($ticker, 'Low'),
            'bid' => $this->safe_float($ticker, 'Bid'),
            'bidVolume' => null,
            'ask' => $this->safe_float($ticker, 'Ask'),
            'askVolume' => null,
            'vwap' => null,
            'open' => $previous,
            'close' => $last,
            'last' => $last,
            'previousClose' => null,
            'change' => $change,
            'percentage' => $percentage,
            'average' => null,
            'baseVolume' => $this->safe_float($ticker, 'Volume'),
            'quoteVolume' => $this->safe_float($ticker, 'BaseVolume'),
            'info' => $ticker,
        );
    }

    public function fetch_currencies ($params = array ()) {
        $response = $this->publicGetCurrencies ($params);
        $currencies = $response['result'];
        $result = array ();
        for ($i = 0; $i < count ($currencies); $i++) {
            $currency = $currencies[$i];
            $id = $currency['Currency'];
            // todo => will need to rethink the fees
            // to add support for multiple withdrawal/deposit methods and
            // differentiated fees for each particular method
            $code = $this->common_currency_code($id);
            $precision = 8; // default $precision, todo => fix "magic constants"
            $address = $this->safe_value($currency, 'BaseAddress');
            $result[$code] = array (
                'id' => $id,
                'code' => $code,
                'address' => $address,
                'info' => $currency,
                'type' => $currency['CoinType'],
                'name' => $currency['CurrencyLong'],
                'active' => $currency['IsActive'],
                'fee' => $this->safe_float($currency, 'TxFee'), // todo => redesign
                'precision' => $precision,
                'limits' => array (
                    'amount' => array (
                        'min' => pow (10, -$precision),
                        'max' => pow (10, $precision),
                    ),
                    'price' => array (
                        'min' => pow (10, -$precision),
                        'max' => pow (10, $precision),
                    ),
                    'cost' => array (
                        'min' => null,
                        'max' => null,
                    ),
                    'withdraw' => array (
                        'min' => $currency['TxFee'],
                        'max' => pow (10, $precision),
                    ),
                ),
            );
        }
        return $result;
    }

    public function fetch_tickers ($symbols = null, $params = array ()) {
        $this->load_markets();
        $response = $this->publicGetMarketsummaries ($params);
        $tickers = $response['result'];
        $result = array ();
        for ($t = 0; $t < count ($tickers); $t++) {
            $ticker = $tickers[$t];
            $id = $ticker['MarketName'];
            $market = null;
            $symbol = $id;
            if (is_array ($this->markets_by_id) && array_key_exists ($id, $this->markets_by_id)) {
                $market = $this->markets_by_id[$id];
                $symbol = $market['symbol'];
            } else {
                $symbol = $this->parse_symbol ($id);
            }
            $result[$symbol] = $this->parse_ticker($ticker, $market);
        }
        return $result;
    }

    public function fetch_ticker ($symbol, $params = array ()) {
        $this->load_markets();
        $market = $this->market ($symbol);
        $response = $this->publicGetMarketsummary (array_merge (array (
            'market' => $market['id'],
        ), $params));
        $ticker = $response['result'][0];
        return $this->parse_ticker($ticker, $market);
    }

    public function parse_trade ($trade, $market = null) {
        $timestamp = $this->parse8601 ($trade['TimeStamp'] . '+00:00');
        $side = null;
        if ($trade['OrderType'] === 'BUY') {
            $side = 'buy';
        } else if ($trade['OrderType'] === 'SELL') {
            $side = 'sell';
        }
        $id = null;
        if (is_array ($trade) && array_key_exists ('Id', $trade))
            $id = (string) $trade['Id'];
        return array (
            'id' => $id,
            'info' => $trade,
            'timestamp' => $timestamp,
            'datetime' => $this->iso8601 ($timestamp),
            'symbol' => $market['symbol'],
            'type' => 'limit',
            'side' => $side,
            'price' => $this->safe_float($trade, 'Price'),
            'amount' => $this->safe_float($trade, 'Quantity'),
        );
    }

    public function fetch_trades ($symbol, $since = null, $limit = null, $params = array ()) {
        $this->load_markets();
        $market = $this->market ($symbol);
        $response = $this->publicGetMarkethistory (array_merge (array (
            'market' => $market['id'],
        ), $params));
        if (is_array ($response) && array_key_exists ('result', $response)) {
            if ($response['result'] !== null)
                return $this->parse_trades($response['result'], $market, $since, $limit);
        }
        throw new ExchangeError ($this->id . ' fetchTrades() returned null response');
    }

    public function parse_ohlcv ($ohlcv, $market = null, $timeframe = '1d', $since = null, $limit = null) {
        $timestamp = $this->parse8601 ($ohlcv['T'] . '+00:00');
        return [
            $timestamp,
            $ohlcv['O'],
            $ohlcv['H'],
            $ohlcv['L'],
            $ohlcv['C'],
            $ohlcv['V'],
        ];
    }

    public function fetch_ohlcv ($symbol, $timeframe = '1m', $since = null, $limit = null, $params = array ()) {
        $this->load_markets();
        $market = $this->market ($symbol);
        $request = array (
            'tickInterval' => $this->timeframes[$timeframe],
            'marketName' => $market['id'],
        );
        $response = $this->v2GetMarketGetTicks (array_merge ($request, $params));
        if (is_array ($response) && array_key_exists ('result', $response)) {
            if ($response['result'])
                return $this->parse_ohlcvs($response['result'], $market, $timeframe, $since, $limit);
        }
        throw new ExchangeError ($this->id . ' returned an empty or unrecognized $response => ' . $this->json ($response));
    }

    public function fetch_open_orders ($symbol = null, $since = null, $limit = null, $params = array ()) {
        $this->load_markets();
        $request = array ();
        $market = null;
        if ($symbol) {
            $market = $this->market ($symbol);
            $request['market'] = $market['id'];
        }
        $response = $this->marketGetOpenorders (array_merge ($request, $params));
        $orders = $this->parse_orders($response['result'], $market, $since, $limit);
        return $this->filter_by_symbol($orders, $symbol);
    }

    public function create_order ($symbol, $type, $side, $amount, $price = null, $params = array ()) {
        if ($type !== 'limit')
            throw new ExchangeError ($this->id . ' allows limit orders only');
        $this->load_markets();
        $market = $this->market ($symbol);
        $method = 'marketGet' . $this->capitalize ($side) . $type;
        $order = array (
            'market' => $market['id'],
            'quantity' => $this->amount_to_precision($symbol, $amount),
            'rate' => $this->price_to_precision($symbol, $price),
        );
        // if ($type == 'limit')
        //     $order['rate'] = $this->price_to_precision($symbol, $price);
        $response = $this->$method (array_merge ($order, $params));
        $orderIdField = $this->get_order_id_field ();
        $result = array (
            'info' => $response,
            'id' => $response['result'][$orderIdField],
            'symbol' => $symbol,
            'type' => $type,
            'side' => $side,
            'status' => 'open',
        );
        return $result;
    }

    public function get_order_id_field () {
        return 'uuid';
    }

    public function cancel_order ($id, $symbol = null, $params = array ()) {
        $this->load_markets();
        $orderIdField = $this->get_order_id_field ();
        $request = array ();
        $request[$orderIdField] = $id;
        $response = $this->marketGetCancel (array_merge ($request, $params));
        return $this->parse_order($response);
    }

    public function parse_symbol ($id) {
        list ($quote, $base) = explode ('-', $id);
        $base = $this->common_currency_code($base);
        $quote = $this->common_currency_code($quote);
        return $base . '/' . $quote;
    }

    public function parse_order ($order, $market = null) {
        $side = $this->safe_string($order, 'OrderType');
        if ($side === null)
            $side = $this->safe_string($order, 'Type');
        $isBuyOrder = ($side === 'LIMIT_BUY') || ($side === 'BUY');
        $isSellOrder = ($side === 'LIMIT_SELL') || ($side === 'SELL');
        if ($isBuyOrder) {
            $side = 'buy';
        }
        if ($isSellOrder) {
            $side = 'sell';
        }
        // We parse different fields in a very specific $order->
        // Order might well be closed and then canceled.
        $status = null;
        if ((is_array ($order) && array_key_exists ('Opened', $order)) && $order['Opened'])
            $status = 'open';
        if ((is_array ($order) && array_key_exists ('Closed', $order)) && $order['Closed'])
            $status = 'closed';
        if ((is_array ($order) && array_key_exists ('CancelInitiated', $order)) && $order['CancelInitiated'])
            $status = 'canceled';
        if ((is_array ($order) && array_key_exists ('Status', $order)) && $this->options['parseOrderStatus'])
            $status = $this->parse_order_status($order['Status']);
        $symbol = null;
        if (is_array ($order) && array_key_exists ('Exchange', $order)) {
            $marketId = $order['Exchange'];
            if (is_array ($this->markets_by_id) && array_key_exists ($marketId, $this->markets_by_id)) {
                $market = $this->markets_by_id[$marketId];
                $symbol = $market['symbol'];
            } else {
                $symbol = $this->parse_symbol ($marketId);
            }
        } else {
            if ($market !== null) {
                $symbol = $market['symbol'];
            }
        }
        $timestamp = null;
        if (is_array ($order) && array_key_exists ('Opened', $order))
            $timestamp = $this->parse8601 ($order['Opened'] . '+00:00');
        if (is_array ($order) && array_key_exists ('Created', $order))
            $timestamp = $this->parse8601 ($order['Created'] . '+00:00');
        $lastTradeTimestamp = null;
        if ((is_array ($order) && array_key_exists ('TimeStamp', $order)) && ($order['TimeStamp'] !== null))
            $lastTradeTimestamp = $this->parse8601 ($order['TimeStamp'] . '+00:00');
        if ((is_array ($order) && array_key_exists ('Closed', $order)) && ($order['Closed'] !== null))
            $lastTradeTimestamp = $this->parse8601 ($order['Closed'] . '+00:00');
        if ($timestamp === null)
            $timestamp = $lastTradeTimestamp;
        $iso8601 = ($timestamp !== null) ? $this->iso8601 ($timestamp) : null;
        $fee = null;
        $commission = null;
        if (is_array ($order) && array_key_exists ('Commission', $order)) {
            $commission = 'Commission';
        } else if (is_array ($order) && array_key_exists ('CommissionPaid', $order)) {
            $commission = 'CommissionPaid';
        }
        if ($commission) {
            $fee = array (
                'cost' => floatval ($order[$commission]),
            );
            if ($market !== null) {
                $fee['currency'] = $market['quote'];
            } else if ($symbol) {
                $currencyIds = explode ('/', $symbol);
                $quoteCurrencyId = $currencyIds[1];
                if (is_array ($this->currencies_by_id) && array_key_exists ($quoteCurrencyId, $this->currencies_by_id))
                    $fee['currency'] = $this->currencies_by_id[$quoteCurrencyId]['code'];
                else
                    $fee['currency'] = $this->common_currency_code($quoteCurrencyId);
            }
        }
        $price = $this->safe_float($order, 'Limit');
        $cost = $this->safe_float($order, 'Price');
        $amount = $this->safe_float($order, 'Quantity');
        $remaining = $this->safe_float($order, 'QuantityRemaining');
        $filled = null;
        if ($amount !== null && $remaining !== null) {
            $filled = $amount - $remaining;
        }
        if (!$cost) {
            if ($price && $filled)
                $cost = $price * $filled;
        }
        if (!$price) {
            if ($cost && $filled)
                $price = $cost / $filled;
        }
        $average = $this->safe_float($order, 'PricePerUnit');
        $id = $this->safe_string($order, 'OrderUuid');
        if ($id === null)
            $id = $this->safe_string($order, 'OrderId');
        $result = array (
            'info' => $order,
            'id' => $id,
            'timestamp' => $timestamp,
            'datetime' => $iso8601,
            'lastTradeTimestamp' => $lastTradeTimestamp,
            'symbol' => $symbol,
            'type' => 'limit',
            'side' => $side,
            'price' => $price,
            'cost' => $cost,
            'average' => $average,
            'amount' => $amount,
            'filled' => $filled,
            'remaining' => $remaining,
            'status' => $status,
            'fee' => $fee,
        );
        return $result;
    }

    public function fetch_order ($id, $symbol = null, $params = array ()) {
        $this->load_markets();
        $response = null;
        try {
            $orderIdField = $this->get_order_id_field ();
            $request = array ();
            $request[$orderIdField] = $id;
            $response = $this->accountGetOrder (array_merge ($request, $params));
        } catch (Exception $e) {
            if ($this->last_json_response) {
                $message = $this->safe_string($this->last_json_response, 'message');
                if ($message === 'UUID_INVALID')
                    throw new OrderNotFound ($this->id . ' fetchOrder() error => ' . $this->last_http_response);
            }
            throw $e;
        }
        if (!$response['result']) {
            throw new OrderNotFound ($this->id . ' order ' . $id . ' not found');
        }
        return $this->parse_order($response['result']);
    }

    public function fetch_closed_orders ($symbol = null, $since = null, $limit = null, $params = array ()) {
        $this->load_markets();
        $request = array ();
        $market = null;
        if ($symbol) {
            $market = $this->market ($symbol);
            $request['market'] = $market['id'];
        }
        $response = $this->accountGetOrderhistory (array_merge ($request, $params));
        $orders = $this->parse_orders($response['result'], $market, $since, $limit);
        if ($symbol)
            return $this->filter_by_symbol($orders, $symbol);
        return $orders;
    }

    public function fetch_deposit_address ($code, $params = array ()) {
        $this->load_markets();
        $currency = $this->currency ($code);
        $response = $this->accountGetDepositaddress (array_merge (array (
            'currency' => $currency['id'],
        ), $params));
        $address = $this->safe_string($response['result'], 'Address');
        $message = $this->safe_string($response, 'message');
        if (!$address || $message === 'ADDRESS_GENERATING')
            throw new AddressPending ($this->id . ' the $address for ' . $code . ' is being generated (pending, not ready yet, retry again later)');
        $tag = null;
        if (($code === 'XRP') || ($code === 'XLM')) {
            $tag = $address;
            $address = $currency['address'];
        }
        $this->check_address($address);
        return array (
            'currency' => $code,
            'address' => $address,
            'tag' => $tag,
            'info' => $response,
        );
    }

    public function withdraw ($code, $amount, $address, $tag = null, $params = array ()) {
        $this->check_address($address);
        $this->load_markets();
        $currency = $this->currency ($code);
        $request = array (
            'currency' => $currency['id'],
            'quantity' => $amount,
            'address' => $address,
        );
        if ($tag)
            $request['paymentid'] = $tag;
        $response = $this->accountGetWithdraw (array_merge ($request, $params));
        $id = null;
        if (is_array ($response) && array_key_exists ('result', $response)) {
            if (is_array ($response['result']) && array_key_exists ('uuid', $response['result']))
                $id = $response['result']['uuid'];
        }
        return array (
            'info' => $response,
            'id' => $id,
        );
    }

    public function sign ($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $url = $this->urls['api'][$api] . '/';
        if ($api !== 'v2')
            $url .= $this->version . '/';
        if ($api === 'public') {
            $url .= $api . '/' . strtolower ($method) . $path;
            if ($params)
                $url .= '?' . $this->urlencode ($params);
        } else if ($api === 'v2') {
            $url .= $path;
            if ($params)
                $url .= '?' . $this->urlencode ($params);
        } else {
            $this->check_required_credentials();
            $nonce = $this->nonce ();
            $url .= $api . '/';
            if ((($api === 'account') && ($path !== 'withdraw')) || ($path === 'openorders'))
                $url .= strtolower ($method);
            $url .= $path . '?' . $this->urlencode (array_merge (array (
                'nonce' => $nonce,
                'apikey' => $this->apiKey,
            ), $params));
            $signature = $this->hmac ($this->encode ($url), $this->encode ($this->secret), 'sha512');
            $headers = array ( 'apisign' => $signature );
        }
        return array ( 'url' => $url, 'method' => $method, 'body' => $body, 'headers' => $headers );
    }

    public function handle_errors ($code, $reason, $url, $method, $headers, $body) {
        if ($body[0] === '{') {
            $response = json_decode ($body, $as_associative_array = true);
            // array ( $success => false, $message => "$message" )
            $success = $this->safe_value($response, 'success');
            if ($success === null)
                throw new ExchangeError ($this->id . ' => malformed $response => ' . $this->json ($response));
            if (gettype ($success) === 'string')
                // bleutrade uses string instead of boolean
                $success = ($success === 'true') ? true : false;
            if (!$success) {
                $message = $this->safe_string($response, 'message');
                $feedback = $this->id . ' ' . $this->json ($response);
                $exceptions = $this->exceptions;
                if ($message === 'APIKEY_INVALID') {
                    if ($this->options['hasAlreadyAuthenticatedSuccessfully']) {
                        throw new DDoSProtection ($feedback);
                    } else {
                        throw new AuthenticationError ($feedback);
                    }
                }
                if ($message === 'DUST_TRADE_DISALLOWED_MIN_VALUE_50K_SAT')
                    throw new InvalidOrder ($this->id . ' order cost should be over 50k satoshi ' . $this->json ($response));
                if ($message === 'INVALID_ORDER') {
                    // Bittrex will return an ambiguous INVALID_ORDER $message
                    // upon canceling already-canceled and closed orders
                    // therefore this special case for cancelOrder
                    // $url = 'https://bittrex.com/api/v1.1/market/$cancel?apikey=API_KEY&uuid=ORDER_UUID'
                    $cancel = 'cancel';
                    $indexOfCancel = mb_strpos ($url, $cancel);
                    if ($indexOfCancel >= 0) {
                        $parts = explode ('&', $url);
                        $orderId = null;
                        for ($i = 0; $i < count ($parts); $i++) {
                            $part = $parts[$i];
                            $keyValue = explode ('=', $part);
                            if ($keyValue[0] === 'uuid') {
                                $orderId = $keyValue[1];
                                break;
                            }
                        }
                        if ($orderId !== null)
                            throw new OrderNotFound ($this->id . ' cancelOrder ' . $orderId . ' ' . $this->json ($response));
                        else
                            throw new OrderNotFound ($this->id . ' cancelOrder ' . $this->json ($response));
                    }
                }
                if (is_array ($exceptions) && array_key_exists ($message, $exceptions))
                    throw new $exceptions[$message] ($feedback);
                if ($message !== null) {
                    if (mb_strpos ($message, 'throttled. Try again') !== false)
                        throw new DDoSProtection ($feedback);
                    if (mb_strpos ($message, 'problem') !== false)
                        throw new ExchangeNotAvailable ($feedback); // 'There was a problem processing your request.  If this problem persists, please contact...')
                }
                throw new ExchangeError ($feedback);
            }
        }
    }

    public function request ($path, $api = 'public', $method = 'GET', $params = array (), $headers = null, $body = null) {
        $response = $this->fetch2 ($path, $api, $method, $params, $headers, $body);
        // a workaround for APIKEY_INVALID
        if (($api === 'account') || ($api === 'market'))
            $this->options['hasAlreadyAuthenticatedSuccessfully'] = true;
        return $response;
    }
}