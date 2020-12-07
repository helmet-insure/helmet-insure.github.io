<template>
  <div class="route">
    <nuxt-link to="/mining">LP Mining</nuxt-link>
    <img class="icon" src="~/assets/img/icon/right2.png" />
    <span class="current">{{ current }} LP token</span>
  </div>
</template>

<script>
export default {
  props: ["current"],
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .route {
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 62px;
    .icon {
      widows: 20px;
      height: 20px;
      margin: 0px 4px;
    }
    > a {
      color: $text-l;
      &:hover {
        color: #c34b4c;
      }
    }
    > span {
      color: $text-t;
    }
  }
}
@media screen and (max-width: 750px) {
  .route {
    display: flex;
    display: none;
    align-items: center;
    font-size: 14px;
    height: 62px;
    .icon {
      widows: 20px;
      height: 20px;
      margin: 0px 4px;
    }
    > a {
      color: $main-color;
      &:hover {
        color: $main-hover;
      }
    }
    > span {
      color: $text-t;
    }
  }
}
</style>