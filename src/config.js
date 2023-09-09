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
            orderBook: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
            glpManager: "0xCF05648452b54Ded75995BCc1D9B5931590A85c1",
            gmxRewardRouter: "",
            glpRewardRouter: ""
        },
        testnet: {
            OAS: "0xF8B5dDfF99db66C4E6964268A852cC6e91c624cB",
            BTC: "0x5Fe80AC251b544453526ff5761074650Ea61c39a",
            ETH: "0xFFcD0B751079Dd4E2Ef13963e7257618929EBcF9",
            oasPriceFeed: "0x3f3d909AD35406C4B40Cf4Cf4340921f508b0EA4",
            btcPriceFeed: "0x80106101C06aC2358a2404233D16D9907b88284D",
            ethPriceFeed: "0x62a6fD90dcB46Cdef947c3efBCb19c308bEBb1cF",
            usdcPriceFeed: "0xC8086F9D7e41e751841eEa44FdBf1Ad2D6d1002A",
            vault: "0x02Fe4f97404cE4b2BF4B298464529f4C24d5B302",
            positionRouter: "0xCA2211f8a0d819071f4c2EEA53C8651510431a5e",
            orderBook: "0xb75D36e666f576781442dA36c80a42610c564344",
            glpManager: "0xf93820ad5F6549939B93164Ad88c4FeE956B7fC6",
            gmxRewardRouter: "0xDebd8685A365D37514Bfc79c1BCc9cd7365df7ca",
            glpRewardRouter: "0x8ACa2ab465158b9b389BC3D2D789131C73F544a2"
        }
    },
    sqlite3: "./db/prices.db"
}
