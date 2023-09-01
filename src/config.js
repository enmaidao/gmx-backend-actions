export const config = {
    rpcUrl: {
        mainnet: "https://oasys-rpc.gateway.pokt.network",
        testnet: "https://rpc.sandverse.oasys.games"
    },
    contracts: {
        mainnet: {
            OAS: "0x25EFc823DAcF53ce56A098eF02277d230610A12a",
            BTC: "0x63a4a6313a84e888a307389dDfe651577664263B",
            ETH: "0x84DB0f01dDB5cF8cf70FbC64470112A512F337Eb",
            oasPriceFeed: "0x73aA4990ACc809C3dB8e23eD42cd2a4F685883a7",
            btcPriceFeed: "0x37c2600512210b6D5F3082B12df7cEE89e61a001",
            ethPriceFeed: "0x1A0f6fA357A01FAD7105c0B47dD94bA555a4B696",
            usdcPriceFeed: "0x62405bC1570d82a93A6D2D75c86d352b22e1c633",
            vault: "0x5862b5acdDB1BD02b0222B26b0913D2ce9F585b0",
            positionRouter: "0xc19E4E7004C56Ca4465721d9E001eeEb5892adA1",
            glpManager: "0xCF05648452b54Ded75995BCc1D9B5931590A85c1",
            gmxRewardRouter: "",
            glpRewardRouter: ""
        },
        testnet: {
            OAS: "0x25EFc823DAcF53ce56A098eF02277d230610A12a",
            BTC: "0x63a4a6313a84e888a307389dDfe651577664263B",
            ETH: "0x84DB0f01dDB5cF8cf70FbC64470112A512F337Eb",
            oasPriceFeed: "0x73aA4990ACc809C3dB8e23eD42cd2a4F685883a7",
            btcPriceFeed: "0x37c2600512210b6D5F3082B12df7cEE89e61a001",
            ethPriceFeed: "0x1A0f6fA357A01FAD7105c0B47dD94bA555a4B696",
            usdcPriceFeed: "0x62405bC1570d82a93A6D2D75c86d352b22e1c633",
            vault: "0x5862b5acdDB1BD02b0222B26b0913D2ce9F585b0",
            positionRouter: "0xc19E4E7004C56Ca4465721d9E001eeEb5892adA1",
            glpManager: "0xCF05648452b54Ded75995BCc1D9B5931590A85c1",
            gmxRewardRouter: "",
            glpRewardRouter: ""
        }
    },
    sqlite3: "./db/prices.db"
}
