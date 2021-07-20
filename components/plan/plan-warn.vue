<template>
  <div class="plan-warn">
    <h3>规则说明</h3>
    <p>1.HELMET总量10,000，本次LP招募计划消耗2%的HELMET流动性预留兑换池。</p>
    <p>
      2.在有预留池剩余时申请成为流动性商并且质押资金后，将会完全兑换成HELMET/BNB
      pool的LP token，其中有约10%的HELMET来自质押资金在HELMET/BNB
      pool的直接兑换，剩余部分来自2%的项目预留池。当预留池不足时会将剩余部分将通过HELMET/BNBpool兑换HELMET。
    </p>
    <p>
      3.LP token没有锁定，当你需要使用HELMET时，可以随时直接使用LP
      token从Uniswap赎回HELMET。流动性挖矿奖励在生成LP
      token后即开始计算收益，产品上线后会根据HELMET质押比例陆续分派治理和收益权限。
    </p>
    <p>4. 本次招募将在 UTC 时间9月2x日 24:00 结束</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .plan-warn {
    margin-top: 30px;
    h3 {
      height: 16px;
      font-size: 16px;
      font-weight: 500;
      color: #919aa6;
      line-height: 16px;
    }
    p {
      font-size: 14px;
      color: #919aa6;
      line-height: 24px;
      margin-top: 12px;
    }
  }
}
</style>