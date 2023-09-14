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
            OAS: "0x95EDE8eBD896F8333cA39278755A102e1bFb74Ba",
            BTC: "0x93f5B83272E4F89712B6ad558a4E67f465ac6551",
            ETH: "0xc65072Fa5C48d303d2a4c42aD9dd7103ea2E5f06",
            oasPriceFeed: "0x34dFae3D72205E7104656C07AE2fb1292faeA5b1",
            btcPriceFeed: "0xC09af54d0Fe80A0365A67a3e6AaFA8Dc692DDb96",
            ethPriceFeed: "0xc91A2d64C3b741EdcC140a8c9C8d2879848E78B7",
            usdcPriceFeed: "0xdbab49F86649242EDb66C6435Ec2336Fa5fc733a ",
            vault: "0x41c3Ede7145C7EAC8C4AE49b52901A17085C5f21",
            positionRouter: "0x18e4D037C8D8cb53749EED372B20102F2222d7FC",
            orderBook: "0x56742D851e2b7F764c93A2587CB29160928a6da9",
            glpManager: "0x7a825E681c5A55EF70D9cE311B61Ea07555b020E",
            gmxRewardRouter: "0xB22B9E512BB209eBA96cd1D8872C08b62fBB1545",
            glpRewardRouter: "0xA4E2005f13Be86e3a143D688471635eC53BEDaC4"
        }
    },
    sqlite3: "./db/prices.db"
}
