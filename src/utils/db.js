import sqlite3 from 'sqlite3';
import { config } from '../config.js';

const dbFile = config['sqlite3'];
const CREATE_PRICES_TABLE = `CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    round INTEGER NOT NULL,
    value TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    UNIQUE(token, round, timestamp)
)`;

const CREATE_FEES_TABLE = `CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL,
    usd_amount TEXT NOT NULL,
    token_amount TEXT NOT NULL,
    timestamp INTEGER NOT NULL
)`;

const CREATE_VOLUMES_TABLE = `CREATE TABLE IF NOT EXISTS volumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contract TEXT NOT NULL,
    event TEXT NOT NULL,
    key	TEXT,
    account TEXT NOT NULL,
    token TEXT,
    usd_amount TEXT,
    token_amount TEXT,
    closed	INTEGER NOT NULL DEFAULT 0,
    is_long	INTEGER NOT NULL DEFAULT 0,
    timestamp INTEGER NOT NULL
)`;

export const db = new sqlite3.Database(dbFile, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error(err.message);
    console.log('Connected to the database.');
});

// export const priceReader = new sqlite3.Database(dbFile, sqlite3.OPEN_READ, (err) => {
//     if (err) console.error(err.message);
//     console.log('Connected to the price database in readonly mode.');
// });

export const closeDB = () => {
    db.close((err) => {
        if (err) console.error(err.message);
        console.log('Close the database connection.');
    })
}

export const initDB = () => {
    db.serialize(() => {
        db.run(CREATE_PRICES_TABLE);
        db.run(CREATE_FEES_TABLE);
        db.run(CREATE_VOLUMES_TABLE);
    })
}

export const insertPriceItem = (token, round, price, timestamp) => {
    db.serialize(() => {
        db.run(`INSERT INTO prices(token, round, value, timestamp)
        VALUES('${token}', '${round}', '${price}', '${timestamp}')`, (ret, err) => {
            if (err) console.error(err.message);
        });
    })
}

export const insertFeeItem = (token, usdAmount, tokenAmount) => {
    const timestamp = Math.floor(Date.now()/1000);
    db.serialize(() => {
        db.run(`INSERT INTO fees(token, usd_amount, token_amount, timestamp)
        VALUES('${token}', '${usdAmount}', '${tokenAmount}', '${timestamp}')`, (ret, err) => {
            if (err) console.error(err.message);
        });
    })
}

export const insertVolumeItem = (contract, event, account, token, usdAmount, tokenAmount, isLong, key) => {
    const timestamp = Math.floor(Date.now()/1000);
    db.serialize(() => {
        db.run(`INSERT INTO volumes(contract, event, key, account, token, usd_amount, token_amount, is_long, timestamp)
        VALUES('${contract}', '${event}', '${key}', '${account}', '${token}', '${usdAmount}', '${tokenAmount}', '${isLong}', '${timestamp}')`, (ret, err) => {
            if (err) console.error(err.message);
        });
    })
}

export const updateVolumeItem = (key) => {
    db.serialize(() => {
        db.run(`UPDATE volumes SET closed = 1 WHERE key = '${key}' AND closed = 0`);
    })
}

export const getPrices = async (token, start = 0, end = 0) => {
    const startTime = Number(start) > 1690862400 ? Number(start) : 1690862400;
    let endTime = end == 0 ? Math.floor(Date.now()/1000): Number(end);
    if (endTime < startTime) endTime = Math.floor(Date.now()/1000);
    const query = `SELECT id, token, value, timestamp FROM prices WHERE token='${token}'
        AND timestamp >= ${startTime}
        AND timestamp <= ${endTime}
        ORDER BY timestamp`;
    // console.log(query);
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getTotalFees = async () => {
    const query = `SELECT SUM(usd_amount / 1e30) as total_fee FROM fees`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getUsers = async () => {
    const query = `SELECT COUNT(*) as total_users FROM (SELECT * FROM volumes GROUP BY account)`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getTotalVolume = async () => {
    const query = `SELECT SUM(usd_amount/1e30) as total_volume FROM volumes`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getLastPrices = async () => {
    const query = `SELECT token, value, MAX(timestamp) AS timestamp FROM prices GROUP BY token;`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const get24hVolume = async () => {
    const prevTime = Math.floor(Date.now()/1000) - (60*60*24);
    const query = `SELECT SUM(usd_amount/1e30) as volume FROM volumes WHERE timestamp > ${prevTime}`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getTotalLongPosition = async () => {
    const query = `SELECT *, (increase_vol - decrease_vol) AS long_vol FROM 
            (SELECT IFNULL(SUM(token_amount/1e30), 0) AS increase_vol FROM volumes 
                WHERE is_long = 1 AND closed = 0 AND event = 'IncreasePosition')
            LEFT OUTER JOIN 
            (SELECT IFNULL(SUM(token_amount/1e30), 0) AS decrease_vol FROM volumes 
                WHERE is_long = 1 AND closed = 0 AND event = 'DecreasePosition')`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getTotalShortPosition = async () => {
    const query = `SELECT *, (increase_vol - decrease_vol) AS short_vol FROM 
            (SELECT IFNULL(SUM(token_amount/1e30), 0) AS increase_vol FROM volumes 
                WHERE is_long = 0 AND closed = 0 AND event = 'IncreasePosition')
            LEFT OUTER JOIN 
            (SELECT IFNULL(SUM(token_amount/1e30), 0) AS decrease_vol FROM volumes 
                WHERE is_long = 0 AND closed = 0 AND event = 'DecreasePosition')`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}

export const getActivePositions = async () => {
    const query = `SELECT key FROM volumes WHERE event = 'IncreasePosition' AND closed = 0 GROUP BY key`;
    return new Promise(resolve => {
        db.all(query, (err, rows) => {
            if (err) console.error(err.message);
            resolve(rows);
        })
    })
}
