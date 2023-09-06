import { ethers, providers } from 'ethers'
import priceFeedABI from '../abi/PriceFeed.json'
import glpManagerABI from '../abi/GlpManager.json'
import vaultABI from '../abi/Vault.json'
import orderBookABI from '../abi/OrderBook.json'
import { config } from '../config.js'

const { NETWORK } = process.env
console.log('--> checking env', NETWORK)

const contracts = config['contracts'][NETWORK]
const rpcUrl = config['rpcUrl'][NETWORK]
const provider = new providers.JsonRpcProvider(rpcUrl)

const feedContract = (feed) => {
  return new ethers.Contract(feed, priceFeedABI, provider)
}

export const oasPriceFeed = feedContract(contracts.oasPriceFeed)
export const btcPriceFeed = feedContract(contracts.btcPriceFeed)
export const ethPriceFeed = feedContract(contracts.ethPriceFeed)

export const vault = new ethers.Contract(contracts.vault, vaultABI, provider)

export const glpManager = new ethers.Contract(contracts.glpManager, glpManagerABI, provider)

export const orderBook = new ethers.Contract(contracts.orderBook, orderBookABI, provider)