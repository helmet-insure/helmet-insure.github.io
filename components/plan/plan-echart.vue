<template>
  <div class="plan_echart">
    <div class="echart_bg">
      <img src="~/assets/img/helmet/echart_pic.png" alt="" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
@media screen and(min-width: 750px) {
  .plan_echart {
    padding-top: 100px;
  }
  .echart_bg {
    width: 420px;
    height: 470px;
    background-image: url("../../assets/img/helmet/echart_bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>