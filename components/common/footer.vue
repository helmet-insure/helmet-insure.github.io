<template>
  <div class="footer-container">
    <div class="footer_top">
      <a href="">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-Twitter"></use>
        </svg>
        <span>Twitter</span>
      </a>
      <a href="">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-Telegram"></use>
        </svg>
        <span>Telegram</span>
      </a>
      <a href="">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-Discord"></use>
        </svg>
        <span>Discord</span>
      </a>
      <a href="">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-medium"></use>
        </svg>
        <span>Medium</span>
      </a>
    </div>
    <div class="footer_bottom">
      <p>Powered by HELMET Core team</p>
      <Langauage />
    </div>
  </div>
</template>
<script>
import Langauage from '~/components/common/langauage.vue';
import '~/assets/svg/iconfont.js';
export default {
  name: 'p-footer',
  components: { Langauage },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .footer-container {
    width: 100%;
    height: 240px;
    background: #121212;
    display: flex;
    flex-direction: column;
    .footer_top {
      width: 300px;
      flex: 1;
      margin: 74px auto 0;
      display: flex;
      justify-content: space-between;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 24px;
          height: 24px;
        }
        span {
          margin-top: 4px;
          font-size: 14px;
          color: #787878;
        }
      }
    }
    .footer_bottom {
      border-top: 1px solid #212121;
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      display: flex;
      padding: 0 200px;
      p {
        font-size: 14px;
        font-weight: 400;
        color: #545454;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .footer-container {
    width: 100%;
    height: 192px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-f;
    display: flex;
    position: absolute;
    left: 0px;
    bottom: 0px;
    li {
      display: inline-block;
      width: 32%;
      margin: 74px 0 0 0;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          height: 24px;
          width: auto;
        }
        p {
          font-size: 14px;
          color: $text-d;
          padding-top: 4px;
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
.footer_top {
  a:hover {
    .icon {
      fill: #ff9600;
    }
    span {
      color: #ff9600 !important;
    }
  }
}
</style>