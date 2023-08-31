import { db } from "./utils/db.js";

export const BSC = 56
export const ARBITRUM = 42161
export const AVALANCHE = 43114
export const OASYS = 248;
export const OASYS_TESTNET = 20197;

const START_TIME = 1609477200;

const PERIOD_TO_SECONDS = {
  '5m': 60 * 5,
  '15m': 60 * 15,
  '1h': 60 * 60,
  '4h': 60 * 60 * 4,
  '1d': 60 * 60 * 24,
}
const PERIOD_TO_SECONDS_TO_FETCH = {
  '5m': 60 * 1, // every 1m since 10 days ago
  '15m': 60 * 5, // every 5m since a month ago
  '1h': 60 * 15, // every 15m since 4 months ago
  '4h': 60 * 30, // every 30m since a year ago
  '1d': 60 * 60, // every 1h since 8 years ago
}
const VALID_PERIODS = new Set(Object.keys(PERIOD_TO_SECONDS))

const getPrices = async (symbol, period, start = START_TIME, end = 0) => {
    const startTime = Number(start) > START_TIME ? Number(start) : START_TIME;
    let endTime = end == 0 ? Math.floor(Date.now()/1000): Number(end);
    if (endTime < startTime) endTime = Math.floor(Date.now()/1000);

    const query = `SELECT ROUND
            ,CAST(AVG(value) AS INT) AS value
            ,timestamp
        FROM (
            SELECT round
                ,value
                ,(timestamp / ${PERIOD_TO_SECONDS_TO_FETCH[period]} * ${PERIOD_TO_SECONDS_TO_FETCH[period]}) AS timestamp
            FROM prices
            WHERE token = '${symbol}'
                AND timestamp >= ${startTime}
                AND timestamp <= ${endTime}
            )
        GROUP BY timestamp
        ORDER BY timestamp`;
    // const query = `SELECT value, timestamp FROM prices WHERE token='${symbol}'
    //     AND timestamp >= ${startTime}
    //     AND timestamp <= ${endTime}
    //     ORDER BY timestamp`;
    // console.log(query);
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })  
    })
}

// function getLastUpdatedTimestamp() {
//     return latestUpdateTimestamp
// }

module.exports = {
    getPrices,
    // getLastUpdatedTimestamp,
    VALID_PERIODS,
    PERIOD_TO_SECONDS
  }