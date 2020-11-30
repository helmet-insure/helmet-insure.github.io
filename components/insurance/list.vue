<template>
  <ul class="insurance-list">
    <li v-for="item in productList" :key="item">
      <div class="product">
        <div class="coin-name">
          <img :src="require(`~/assets/img/${item}@2x.png`)" />
          <span>{{ item }}</span>
        </div>
        <p>
          {{
            $t('Content.HelmetsinSupply', {
              num: (totalInfo && totalInfo[item] && totalInfo[item].count) || 0,
            })
          }}
        </p>
      </div>
      <div class="value-wrap">
        <div class="value">
          <span>1</span>
          <img class="icon" :src="require(`~/assets/img/${item}@2x.png`)" />
          <img class="arrow" src="~/assets/img/icon/weibiaoti40.png" />
          <span>1</span>
          <img
            class="icon"
            :src="require(`~/assets/img/icon/${item}@2x.png`)"
          />
        </div>
        <div class="value">
          <span>1</span>
          <img class="icon" src="~/assets/img/un@2x.png" />
          <i>= $</i>
          <span
            >{{
              (totalInfo &&
                totalInfo[item] &&
                autoRounding(totalInfo[item].min)) ||
              0
            }}
            -
            {{
              (totalInfo &&
                totalInfo[item] &&
                autoRounding(totalInfo[item].max)) ||
              0
            }}</span
          >
        </div>
      </div>
      <div class="borrow-btn">
        <nuxt-link :to="{ path: `/product/${item.toLowerCase()}` }">{{
          $t('Content.Borrow')
        }}</nuxt-link>
      </div>
    </li>
  </ul>
</template>
<script>
import { autoRounding } from '~/assets/js/util.js';

export default {
  name: 'insurance-list',
  data() {
    return {
      // productList: ["WETH", "WBTC", "UNI", "CRV"],
      productList: ['WETH', 'WBTC'],
      autoRounding: autoRounding,
    };
  },
  computed: {
    totalInfo() {
      return this.$store.state.totalInfo;
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .insurance-list {
    width: 1200px;
    margin: 0 auto;
    li {
      width: 100%;
      background: $bg-c;
      height: 124px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      padding: 20px 30px;
      justify-content: space-between;
      .product {
        flex: 1;
        .coin-name {
          display: flex;
          align-items: center;
          color: $text-t;
          font-size: 26px;
          img {
            height: 48px;
            margin-right: 24px;
          }
        }
        p {
          padding-top: 12px;
          color: $text-d;
        }
      }
      .value-wrap {
        flex: 2;
        display: flex;
        .value {
          color: $text-m;
          display: flex;
          align-items: center;
          font-size: 16px;
          flex: 1;
          .icon {
            width: 23px;
            margin-left: 4px;
          }
          .arrow {
            width: 23px;
            margin: 0px 10px;
          }
          i {
            font-style: normal;
            font-size: 18px;
            margin: 0px 4px;
          }
        }
      }

      .borrow-btn {
        a {
          display: block;
          width: 104px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border-radius: 10px;
          background: $main-color;
          color: $text-m;
          &:hover {
            background: lighten($color: $main-color, $amount: 5);
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance-list {
    width: 100%;
    margin: 0 auto;
    padding: 0 16px;
    li {
      width: 100%;
      background: $bg-c;
      display: flex;
      margin-top: 10px;
      padding: 20px 12px;
      flex-direction: column;
      .product {
        margin-bottom: 15px;
        .coin-name {
          display: flex;
          align-items: center;
          color: $text-t;
          font-size: 26px;
          img {
            height: 32px;
            margin-right: 10px;
          }
        }
        p {
          padding-top: 12px;
          color: $text-d;
        }
      }
      .value-wrap {
        display: flex;
        .value {
          color: $text-m;
          display: flex;
          align-items: center;
          font-size: 16px;
          flex: 1;
          .icon {
            width: 23px;
            margin-left: 4px;
          }
          .arrow {
            width: 23px;
            margin: 0px 10px;
          }
          i {
            font-style: normal;
            font-size: 18px;
            margin: 0px 4px;
          }
        }
      }

      .borrow-btn {
        margin-top: 20px;
        a {
          display: block;
          width: 104px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border-radius: 10px;
          background: $main-color;
          color: $text-m;
          &:hover {
            background: lighten($color: $main-color, $amount: 5);
          }
        }
      }
    }
  }
}
</style>