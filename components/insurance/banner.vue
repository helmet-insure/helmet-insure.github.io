<template>
  <div class="insurance-banner">
    <ul>
      <li>
        <!-- 已经成交的保险品种的种类 -->
        <p>
          <label>{{ $t('Banner.HelmetVarieties') }}</label>
          <span>{{ helmetVarieties }}</span>
        </p>
        <img src="~/assets/img/helmet/ba1@2x.png" alt="" />
      </li>
      <li>
        <!-- 保险交易过的资金量 -->
        <p>
          <label>{{ $t('Banner.TotalHelmetsBorrowedVolume') }}</label>
          <span> {{ helmetVarieties }}</span>
        </p>
        <img src="~/assets/img/helmet/ba2@2x.png" alt="" />
      </li>
      <li>
        <!-- 24小时Long token 铸造量 -->
        <p>
          <label>{{ $t('Banner.LongToken') }}</label>
          <span>{{ helmetVarieties }}</span>
        </p>
        <img src="~/assets/img/helmet/ba3@2x.png" alt="" />
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
  background: #fff;
  ul {
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
    height: 200px;
    padding: 40px 60px;
    margin: 0 auto;
    font-size: 16px;
    color: $text-m;
    margin-bottom: 10px;
    ul {
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: space-between;
      li {
        padding: 20px 30px;
        width: 340px;
        height: 120px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p {
          display: flex;
          flex-direction: column;
          text-align: left;
          span {
            margin-top: 8px;
            font-size: 20px;
            font-weight: bold;
            color: #121212;
          }
        }
        img {
          width: 120px;
          height: 80px;
        }
      }
      li:nth-of-type(1) {
        background: #f7f7fa;
        border-radius: 3px;
      }
      li:nth-of-type(2) {
        background: #ff9600;
        border-radius: 3px;
      }
      li:nth-of-type(3) {
        background: #f7f7fa;
        border-radius: 3px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance-banner {
    padding: 20px 16px;
    font-size: 16px;
    color: $text-m;
    margin-bottom: 10px;
    ul {
      li {
        padding: 20px 20px;
        width: 100%;
        height: 120px;
        display: flex;
        justify-content: space-between;
        p {
          display: flex;
          flex-direction: column;
          text-align: left;
          span {
            margin-top: 8px;
            font-size: 20px;
            font-weight: bold;
            color: #121212;
          }
        }
        img {
          width: 120px;
          height: 80px;
        }
      }
      li:nth-of-type(1) {
        background: #f7f7fa;
        margin-bottom: 20px;
        border-radius: 3px;
      }
      li:nth-of-type(2) {
        background: #ff9600;
        margin-bottom: 20px;
        border-radius: 3px;
      }
      li:nth-of-type(3) {
        background: #f7f7fa;
        border-radius: 3px;
      }
    }
  }
}
</style>