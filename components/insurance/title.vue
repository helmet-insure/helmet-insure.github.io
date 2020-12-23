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
</style>