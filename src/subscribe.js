import dotenv from "dotenv";
dotenv.config();

import { ethers } from "ethers";
import {
  oasPriceFeed,
  btcPriceFeed,
  ethPriceFeed,
  vault,
  glpManager,
  orderBook
} from "./utils/web3.js";
import {
  initDB,
  closeDB,
  insertPriceItem,
  insertFeeItem,
  insertVolumeItem,
  updateVolumeItem,
} from "./utils/db.js";
import { config } from "./config.js";

const { NETWORK } = process.env;
const contracts = config["contracts"][NETWORK];

const storePrice = async (token, round, price, timestamp) => {
  // console.log(token, round.toString(), price.toString(), timestamp.toString())
  insertPriceItem(token, round, price, timestamp);
};

const storeFeeAmount = async (token, usdAmount, tokenAmount) => {
  // console.log(token, usdAmount.toString(), tokenAmount.toString());
  insertFeeItem(token, usdAmount, tokenAmount);
};

const storeVolume = async (
  contract,
  event,
  account,
  token,
  usdAmount,
  tokenAmount,
  isLong = 0,
  key = ""
) => {
  console.log(
    event,
    account,
    token,
    usdAmount.toString(),
    tokenAmount.toString()
  );
  insertVolumeItem(
    contract,
    event,
    account,
    token,
    usdAmount,
    tokenAmount,
    isLong,
    key
  );
};

const updateVolume = async (event, key) => {
  console.log(`${event}:, ${key}`);
  updateVolumeItem(key);
};

const subscribePriceFeeds = () => {
  initDB();

  oasPriceFeed.on("UpdatedPrice", (roundId, answer, timestamp) => {
    storePrice("OAS", roundId, answer, timestamp);
  });

  btcPriceFeed.on("UpdatedPrice", (roundId, answer, timestamp) => {
    storePrice("BTC", roundId, answer, timestamp);
  });

  ethPriceFeed.on("UpdatedPrice", (roundId, answer, timestamp) => {
    storePrice("ETH", roundId, answer, timestamp);
  });

  vault.on("CollectSwapFees", (token, feeUsd, feeTokens) => {
    storeFeeAmount(token, feeUsd, feeTokens);
  });

  vault.on("CollectMarginFees", (token, feeUsd, feeTokens) => {
    storeFeeAmount(token, feeUsd, feeTokens);
  });

  glpManager.on(
    "AddLiquidity",
    (account, token, amount, aumInUsdg, glpSupply, usdgAmount, mintAmount) => {
      storeVolume(
        glpManager.address,
        "AddLiquidity",
        account,
        token,
        usdgAmount,
        amount
      );
    }
  );

  glpManager.on(
    "RemoveLiquidity",
    (
      account,
      token,
      glpAmount,
      aumInUsdg,
      glpSupply,
      usdgAmount,
      amountOut
    ) => {
      storeVolume(
        glpManager.address,
        "RemoveLiquidity",
        account,
        token,
        usdgAmount,
        amountOut
      );
    }
  );

  vault.on(
    "IncreasePosition",
    (
      key,
      account,
      collateralToken,
      indexToken,
      collateralDelta,
      sizeDelta,
      isLong,
      price,
      fee
    ) => {
      storeVolume(
        vault.address,
        "IncreasePosition",
        account,
        indexToken,
        collateralDelta,
        sizeDelta,
        isLong ? 1 : 0,
        key
      );
    }
  );

  vault.on(
    "DecreasePosition",
    (
      key,
      account,
      collateralToken,
      indexToken,
      collateralDelta,
      sizeDelta,
      isLong,
      price,
      fee
    ) => {
      storeVolume(
        vault.address,
        "DecreasePosition",
        account,
        indexToken,
        collateralDelta,
        sizeDelta,
        isLong ? 1 : 0,
        key
      );
    }
  );

  vault.on(
    "Swap",
    async (
      account,
      tokenIn,
      tokenOut,
      amountIn,
      amountOut,
      amountOutAfterFees,
      feeBasisPoints
    ) => {
      if (account === contracts.positionRouter) return;
      const priceIn = await vault.getMinPrice(tokenIn);
      storeVolume(
        vault.address,
        "Swap",
        account,
        tokenOut,
        amountIn.mul(priceIn).div(ethers.utils.parseUnits("1", "18")),
        amountOut
      );
    }
  );

  vault.on(
    "LiquidatePosition",
    (
      key,
      account,
      collateralToken,
      indexToken,
      isLong,
      size,
      collateral,
      reserveAmount,
      realisePnl,
      markPrice
    ) => {
      storeVolume(
        vault.address,
        "LiquidatePosition",
        account,
        indexToken,
        size.mul(markPrice).div(ethers.utils.parseUnits("1", "30")),
        collateral,
        isLong ? 1 : 0,
        key
      );
      updateVolume('LiquidatePosition', key);
    }
  );

  vault.on(
    "ClosePosition",
    (
      key,
      size,
      collateral,
      averagePrice,
      entryFundingRate,
      reserveAmount,
      realisedPnl
    ) => {
      updateVolume('ClosePosition', key);
    }
  );

  orderBook.on(
    "CreateIncreaseOrder",
    (
      account,
      orderIndex,
      purchaseToken,
      purchaseTokenAmcount,
      collateralToken,
      indexToken,
      sizeDelta,
      isLong,
      triggerPrice,
      triggerAboveThreshold,
      executionFee
    ) => {
      storeVolume(
        orderBook.address,
        "CreateIncreaseOrder",
        account,
        indexToken,
        purchaseTokenAmcount,
        sizeDelta,
        isLong ? 1 : 0,
        orderIndex
      );
    }
  );

  orderBook.on(
    "CancelIncreaseOrder",
    (
      account,
      orderIndex,
      purchaseToken,
      purchaseTokenAmcount,
      collateralToken,
      indexToken,
      sizeDelta,
      isLong,
      triggerPrice,
      triggerAboveThreshold,
      executionFee
    ) => {
      updateVolume('CancelIncreaseOrder', orderIndex);
    }
  );

  orderBook.on(
    "ExecuteIncreaseOrder",
    (
      account,
      orderIndex,
      purchaseToken,
      purchaseTokenAmcount,
      collateralToken,
      indexToken,
      sizeDelta,
      isLong,
      triggerPrice,
      triggerAboveThreshold,
      executionFee
    ) => {
      updateVolume('ExecuteIncreaseOrder', orderIndex);
    }
  );

  orderBook.on(
    "CreateDecreaseOrder",
    (
      account,
      orderIndex,
      collateralToken,
      collateralDelta,
      indexToken,
      sizeDelta,
      isLong,
      triggerPrice,
      triggerAboveThreshold,
      executionFee
    ) => {
      storeVolume(
        orderBook.address,
        "CreateDecreaseOrder",
        account,
        indexToken,
        collateralDelta,
        sizeDelta,
        isLong ? 1 : 0,
        orderIndex
      );
    }
  );

  orderBook.on(
    "CancelDecreaseOrder",
    (
      account,
      orderIndex,
      collateralToken,
      collateralDelta,
      indexToken,
      sizeDelta,
      isLong,
      triggerPrice,
      triggerAboveThreshold,
      executionFee
    ) => {
      updateVolume('CancelDecreaseOrder', orderIndex);
    }
  );

  orderBook.on(
    "ExecuteDecreaseOrder",
    (
      account,
      orderIndex,
      collateralToken,
      collateralDelta,
      indexToken,
      sizeDelta,
      isLong,
      triggerPrice,
      triggerAboveThreshold,
      executionFee,
      executionPrice
    ) => {
      updateVolume('ExecuteDecreaseOrder', orderIndex);
    }
  );

  orderBook.on(
    "CreateSwapOrder",
    (
      account,
      orderIndex,
      path,
      amountIn,
      minOut,
      triggerRatio,
      triggerAboveThreshold,
      shouldUnwrap,
      executionFee
    ) => {
      storeVolume(
        orderBook.address,
        "CreateSwapOrder",
        account,
        path[0],
        amountIn,
        minOut,
        0,
        orderIndex
      );
    }
  );

  orderBook.on(
    "CancelSwapOrder",
    (
      account,
      orderIndex,
      path,
      amountIn,
      minOut,
      triggerRatio,
      triggerAboveThreshold,
      shouldUnwrap,
      executionFee
    ) => {
      updateVolume('CancelSwapOrder', orderIndex);
    }
  );

  orderBook.on(
    "ExecuteSwapOrder",
    (
      account,
      orderIndex,
      path,
      amountIn,
      minOut,
      amountOut,
      triggerRatio,
      triggerAboveThreshold,
      shouldUnwrap,
      executionFee
    ) => {
      updateVolume('ExecuteSwapOrder', orderIndex);
    }
  );

  // closeDB();
};

export default subscribePriceFeeds;
