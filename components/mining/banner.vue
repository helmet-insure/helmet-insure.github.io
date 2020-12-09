<template>
  <div class="mining-banner">
    <h1>Short Token 抵押挖矿</h1>
    <!-- <p> -->
    <!-- Deposite ETH-USDT LP Token to mint PAYA -->
    <!-- <a>Read more about PAYA mining </a> -->
    <!-- {{ $t('Content.Report') }} -->
    <!-- <a href="/security" target="_blank">{{ $t('Content.Here') }}</a> -->
    <!-- </p> -->
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
.mining-banner {
}
@media screen and (min-width: 750px) {
  .mining-banner {
    width: 1200px;
    height: 166px;
    background-image: url('../../assets/img/helmet/minning_banner@2x.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 40px;
      font-weight: bold;
      color: #121212;
      line-height: 56px;
      margin: 63px 0 10px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: $text-g;
      line-height: 20px;
      a {
        font-size: 14px;
        font-weight: 400;
        color: #be3a3b;
        text-decoration: underline;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .mining-banner {
    width: 100%;
    height: 180px;
    background-image: url('../../assets/img/helmet/minning_banner@2x.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    h1 {
      font-size: 24px;
      font-weight: 500;
      color: $text-m;
      text-align: center;
      margin: 47px 0 18px;
      height: 56px;
    }
    p {
      display: flex;
      flex-direction: column;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: $text-g;
      line-height: 20px;
      a {
        font-size: 14px;
        font-weight: 400;
        color: #be3a3b;
      }
    }
  }
}
</style>