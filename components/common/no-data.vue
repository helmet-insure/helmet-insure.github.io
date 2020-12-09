<template>
  <div class="no-data">
    <div class="img-box">
      <!-- <img src="~/assets/img/queshen.png" /> -->
    </div>
    <p>{{ text || $t('Content.NoData') }}</p>
  </div>
</template>
<script>
export default {
  name: 'no-data',
  props: {
    text: {
      type: String,
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
.no-data {
  text-align: center;
  padding: 30px 0px;
  .img-box {
    img {
      width: 180px;
    }
  }
  > p {
    color: $text-d;
    font-size: 14px;
    /* padding-top: 10px; */
  }
}
</style>