<template>
  <div class="balance">
    <div>
      <span>出险价格</span>
      <p>200.0100 BNB</p>
    </div>
    <div>
      <span>保护周期</span>
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-time"></use>
        </svg>
        200.0100 BNB
      </p>
    </div>
    <div>
      <span>可用余额</span>
      <div>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-BNB"></use></svg
          >200.0100 BNB
        </p>
        <p>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Helmet"></use></svg
          >200.0100 HELMET
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/svg/iconfont.js';
export default {};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .balance {
    margin-bottom: 30px;
    display: flex;
    > div {
      margin-right: 100px;
      span {
        font-size: 14px;
        color: #919aa6;
      }
      p {
        display: flex;
        align-items: center;
        margin-top: 8px;
        line-height: 24px;
        font-size: 14px;
        font-weight: bold;
        color: #121212;
        .icon {
          margin-right: 4px;
        }
      }
      div {
        display: flex;
        p {
          margin-right: 50px;
        }
      }
    }
  }
}
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #787878;
  overflow: hidden;
}
</style>