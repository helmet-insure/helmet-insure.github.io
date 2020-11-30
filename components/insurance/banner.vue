<template>
  <div class="insurance-banner">
    <ul>
      <li>
        <!-- 已经成交的保险品种的种类 -->
        <label>{{ $t('Banner.HelmetVarieties') }}</label>
        <p>{{ helmetVarieties }}</p>
      </li>
      <li>
        <!-- 保险交易过的资金量 -->
        <label>{{ $t('Banner.TotalHelmetsBorrowedVolume') }}</label>
        <p>{{ fixD(totalHelmetsBorrowedVolume, 0) }} Helmets</p>
      </li>
      <li>
        <!-- 24小时Long token 铸造量 -->
        <label>{{ $t('Banner.LongToken') }}</label>
        <p>{{ fixD(longTokenCreatedVolume, 0) }} $</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { fixD } from '~/assets/js/util.js';
export default {
  name: 'insurance-banner',
  data() {
    return {
      fixD: fixD,
    };
  },
  computed: {
    helmetVarieties() {
      // 已经成交的保险品种的种类
      return this.$store.state.helmetVarieties;
    },
    totalHelmetsBorrowedVolume() {
      // 保险交易过的资金量
      return this.$store.state.totalHelmetsBorrowedVolume;
    },
    longTokenCreatedVolume() {
      // 24小时Long token 铸造量
      return this.$store.state.longTokenCreatedVolume;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
.insurance-banner {
  ul {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: space-between;
    height: 100%;
    label {
      font-size: 16px;
      color: #7d7d7d;
    }
    p {
      font-size: 26px;
      color: #dbdbdb;
      padding-top: 12px;
    }
  }
}
@media screen and (min-width: 750px) {
  .insurance-banner {
    width: 1200px;
    height: 180px;
    /* line-height: 180px; */
    margin: 0 auto;
    background: url('../../assets/img/Banner3@2x.png') right 36px no-repeat;
    background-size: auto 100%;
    /* font-size: 40px; */
    font-size: 16px;
    color: $text-m;
    /* padding-right: 250px; */
    padding: 0px 30px;
  }
}
@media screen and (max-width: 750px) {
  .insurance-banner {
    display: flex;
    align-items: center;
    padding: 0 0px 0 16px;
    width: 100%;
    height: 180px;
    margin: 0 auto;
    background: url('../../assets/img/banner_h5.png') right no-repeat;
    background-size: auto 100%;
    /* font-size: 30px; */
    font-size: 12px;
    color: $text-m;
    ul {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      li {
        display: flex;
        align-items: center;
        margin: 10px 0px;
        text-align: left;
        label {
          font-size: 12px;
          margin-right: 10px;
        }
        p {
          font-size: 14px;
          padding-top: 0px;
        }
      }
    }
  }
}
</style>