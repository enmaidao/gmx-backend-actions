export const config = {
    rpcUrl: {
        mainnet: "https://oasys-rpc.gateway.pokt.network",
        testnet: "https://rpc.sandverse.oasys.games"
    },
    contracts: {
        mainnet: {
            OAS: "0xf426a1477776E60CDaB03A1e23cd59c8548F17D0",
            BTC: "0xF4528d3221111d4e317E5e8D02D6785477a8A9f2",
            ETH: "0xa4098782bEBAB44B2ccffA08e136712b7CA03f03",
            oasPriceFeed: "0x5dc9E97E685d3E766e89fC13473820039C2D6C90",
            btcPriceFeed: "0xAEB63607f068D64a14E3cEe5f969930D9F18BE50",
            ethPriceFeed: "0x95ADD3099c78b17CA200832dB2c1898916A67aA2",
            usdcPriceFeed: "0xd394E29e57212255bCaE7cAFaecedae8687E8ab2",
            vault: "0x5862b5acdDB1BD02b0222B26b0913D2ce9F585b0",
            positionRouter: "0xc19E4E7004C56Ca4465721d9E001eeEb5892adA1",
            orderBook: "0x09f77E8A13De9a35a7231028187e9fD5DB8a2ACB",
            glpManager: "0xCF05648452b54Ded75995BCc1D9B5931590A85c1",
            gmxRewardRouter: "",
            glpRewardRouter: ""
        },
        testnet: {
            OAS: "0xf426a1477776E60CDaB03A1e23cd59c8548F17D0",
            BTC: "0xF4528d3221111d4e317E5e8D02D6785477a8A9f2",
            ETH: "0xa4098782bEBAB44B2ccffA08e136712b7CA03f03",
            oasPriceFeed: "0x5dc9E97E685d3E766e89fC13473820039C2D6C90",
            btcPriceFeed: "0xAEB63607f068D64a14E3cEe5f969930D9F18BE50",
            ethPriceFeed: "0x95ADD3099c78b17CA200832dB2c1898916A67aA2",
            usdcPriceFeed: "0xd394E29e57212255bCaE7cAFaecedae8687E8ab2",
            vault: "0x8011f638886457879F732b9D8c66a900866F326d",
            positionRouter: "0x0177F804B230F08D3725Dd95806996b395EF13A2",
            orderBook: "0xBca8a3F2d8bcB79539Ac026BDa924Db97bA210E5",
            glpManager: "0x0443C7F99AfedD57AC3F0c248683dc68A732c7cA",
            gmxRewardRouter: "0xEaF39cfb82855e4a86740D25c3c50076f4FD0550",
            glpRewardRouter: "0x2Bfb02d164745B326D1c005245F66dbbB5F7076D"
        }
    },
    sqlite3: "./db/prices.db"
}
