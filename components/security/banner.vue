<template>
  <div class="security-banner">
    <p>{{ $t('Content.ReportTitle') }}</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .security-banner {
    width: 1200px;
    height: 180px;
    // background: url('../../assets/img/banner.png') right 36px no-repeat;
    background-size: auto 80%;
    font-size: 40px;
    font-weight: 500;
    color: #ffffff;
    line-height: 180px;
  }
}
@media screen and (max-width: 750px) {
  .security-banner {
    width: 100%;
    height: 180px;
    // background: url('../../assets/img/banner_h5.png') right 36px no-repeat;
    background-size: auto 80%;
    font-size: 30px;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    align-items: center;
    p {
      width: 270px;
      margin-left: 16px;
    }
  }
}
</style>