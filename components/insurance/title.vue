<template>
  <div class="trade_title">
    <div class="text">
      <h3>{{ $t("Banner.Title") }}</h3>
      <span>{{ $t("Banner.Text") }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .trade_title {
    height: 220px;
    background: #ffffff;
    margin-bottom: 15px;
    padding: 0 60px;
    display: flex;
    justify-content: space-between;
    background-image: url("../../assets/img/helmet/banner_ill.png");
    background-size: 344px 200px;
    background-position: 95% 20px;
    background-repeat: no-repeat;
    .text {
      h3 {
        width: 373px;
        font-size: 24px;
        font-weight: 600;
        color: #121212;
        line-height: 33px;
        margin: 64px 0 16px 0;
      }
      span {
        color: #919aa6;
        line-height: 20px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .trade_title {
    height: 360px;
    background: #ffffff;
    margin-bottom: 15px;
    padding: 0 28px;
    display: flex;
    justify-content: space-between;
    background-image: url("../../assets/img/helmet/banner_ill.png");
    background-size: 275px 160px;
    background-position: center 90%;
    background-repeat: no-repeat;
    .text {
      h3 {
        font-size: 24px;
        font-weight: 600;
        color: #121212;
        line-height: 33px;
        margin-bottom: 20px;
      }
      span {
        color: #919aa6;
        line-height: 20px;
      }
    }
  }
}
</style>