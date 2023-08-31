import { ethers } from 'ethers'
import { createHttpError } from './utils'
import { getPrices, VALID_PERIODS, PERIOD_TO_SECONDS } from './prices'
import {
  getTotalFees,
  getUsers,
  getTotalVolume,
  get24hVolume,
  getTotalShortPosition,
  getTotalLongPosition,
} from './utils/db.js'

const { parseUnits } = ethers.utils;

export default function routes(app) {
  app.get('/api/fees_summary', async (req, res, next) => {
    let totalFees
    try {
      totalFees = await getTotalFees()
    } catch (ex) {
      next(ex)
      return
    }

    res.set('Cache-Control', 'max-age=60')
    res.send({
      totalFees: totalFees[0].total_fee,
      lastUpdatedAt: Math.floor(Date.now() / 1000),
    })
  })

  app.get('/api/total_users', async (req, res, next) => {
    let totalUsers
    try {
      totalUsers = await getUsers()
    } catch (ex) {
      next(ex)
      return
    }

    res.set('Cache-Control', 'max-age=60')
    res.send({
      totalUsers: totalUsers[0].total_users,
      lastUpdatedAt: Math.floor(Date.now() / 1000),
    })
  })

  app.get('/api/total_volume', async (req, res, next) => {
    let totalVol
    try {
      totalVol = await getTotalVolume()
    } catch (ex) {
      next(ex)
      return
    }

    res.set('Cache-Control', 'max-age=60')
    res.send({
      totalVolume: parseUnits(totalVol[0].total_volume.toString(), '30').toString(),
      lastUpdatedAt: Math.floor(Date.now() / 1000),
    })
  })

  app.get('/api/24h_volume', async (req, res, next) => {
    let dayVol
    try {
      dayVol = await get24hVolume()
    } catch (ex) {
      next(ex)
      return
    }

    res.set('Cache-Control', 'max-age=60')
    res.send({
      dayVolume: parseUnits(dayVol[0].volume.toString(), '30').toString(),
      lastUpdatedAt: Math.floor(Date.now() / 1000),
    })
  })

  app.get('/api/position_stats', async (req, res, next) => {
    let short, long
    try {
      short = await getTotalShortPosition()
      long = await getTotalLongPosition()
    } catch (ex) {
      next(ex)
      return
    }

    res.set('Cache-Control', 'max-age=60')
    res.send({
      totalShortPositionSizes: parseUnits(short[0].short_vol.toString(), '30').toString(),
      totalLongPositionSizes: parseUnits(long[0].long_vol.toString(),'30').toString(),
      lastUpdatedAt: Math.floor(Date.now() / 1000),
    })
  })

  app.get('/api/candles/:symbol', async (req, res, next) => {
    const period = req.query.period?.toLowerCase()
    if (!period || !VALID_PERIODS.has(period)) {
      next(createHttpError(400, `Invalid period. Valid periods are ${Array.from(VALID_PERIODS)}`))
      return
    }

    const validSymbols = new Set(['BTC', 'ETH', 'OAS'])
    let symbol = req.params.symbol
    if (!validSymbols.has(symbol)) {
      next(createHttpError(400, `Invalid symbol ${symbol}`))
      return
    }

    const MAX_LIMIT = 5000
    let limit = 5000
    if (req.query.limit) {
      limit = Number(req.query.limit)
      if (Number.isNaN(limit)) {
        next(createHttpError(400, `Invalid limit ${req.query.limit}`))
        return
      }
      if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT
      }
    }
    const timeDiff = PERIOD_TO_SECONDS[period] * limit
    const from = Math.floor(Date.now() / 1000 - timeDiff)

    let prices
    try {
      prices = await getPrices(req.params.symbol, period, from)
    } catch (ex) {
      next(ex)
      return
    }

    res.set('Cache-Control', 'max-age=60')
    res.send({
      prices,
      period,
      // updatedAt: getLastUpdatedTimestamp()
      updatedAt: Math.floor(Date.now() / 1000),
    })
  })
}
