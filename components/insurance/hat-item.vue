<template>
  <li :class="['hat-item', data.sort === 1 ? 'no-helmet' : '']">
    <div class="no-helmet-mask"></div>
    <div class="value">
      <img class="hat-img" src="~/assets/img/WETH@2x.png" />
      <div>
        <i>=</i>
        <span
          >{{ autoRounding(precision.divide(1, data._strikePrice)) }}
          {{ data._collateral }}</span
        >
      </div>
    </div>
    <ul class="info-list">
      <li class="rent">
        <label>{{ $t('Dialog.Rent') }}:</label>
        <span>
          {{
            data.settleToken === 'USDT' || data.settleToken === 'USDC'
              ? toRounding(
                  precision.divide(
                    precision.divide(data.price, 1000000000000),
                    data._strikePrice
                  ),
                  4
                )
              : toRounding(precision.divide(data.price, data._strikePrice), 4)
          }}
          <!-- {{ toRounding(precision.divide(data.price, data._strikePrice), 4) }} -->
          {{ data.settleToken }}
        </span>
      </li>
      <li class="supply">
        <label>#{{ $t('Content.HelmetSupply') }}: </label>
        <span
          >{{ toRounding(precision.times(data.remain, data._strikePrice), 2) }}
          /
          {{
            toRounding(precision.times(data.volume, data._strikePrice), 2)
          }}</span
        >
      </li>
      <li>
        <label>{{ $t('Dialog.DueDate') }}:</label>
        <!-- <span>{{data._expiry}}</span> -->
        <span>{{ moment(parseInt(data._expiry)).format('MMM Do HH:mm') }}</span>
      </li>
    </ul>
    <button class="borrow-btn" @click="toRent(data)">
      {{ $t('Content.Borrow') }}
    </button>
  </li>
</template>
<script>
import moment from 'moment';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import precision from '~/assets/js/precision.js';

export default {
  name: 'hat-item',
  props: ['data'],
  data() {
    return {
      precision: precision,
      fixD: fixD,
      addCommom: addCommom,
      moment: moment,
      autoRounding: autoRounding,
      toRounding: toRounding,
    };
  },
  computed: {
    typeFixObj() {
      return this.$store.state.typeFixObj;
    },
  },
  methods: {
    toRent(item) {
      this.$bus.$emit('OPEN_RENT', item);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .hat-item {
    width: 285px;
    height: 294px;
    padding: 25px 16px;
    margin-right: 15px;
    margin-top: 30px;

    .info-list {
      margin-top: 30px;
    }
    .value {
      i {
        font-size: 16px;
        color: $text-d;
        margin-left: 18px;
        margin-right: 12px;
      }
      .hat-img {
        width: 98px;
        height: 54px;
      }
      div {
        > span {
          display: inline-block;
          width: 130px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .borrow-btn {
      display: block;
      width: 250px;
    }
  }
}
@media screen and (max-width: 750px) {
  .hat-item {
    width: 100%;
    height: 244px;
    padding: 20px 16px;
    margin-top: 10px;
    .info-list {
      margin-top: 20px;
    }
    .value {
      i {
        font-size: 16px;
        color: $text-d;
        margin-left: 4px;
        margin-right: 4px;
      }
      .hat-img {
        width: 52px;
      }
    }
    .borrow-btn {
      display: block;
      width: 100%;
    }
  }
}
.hat-item {
  border-radius: 4px;
  background: $bg-c;
  position: relative;
  &:last-child {
    margin-right: 0px;
  }
  &.no-helmet {
    .no-helmet-mask {
      width: 100%;
      height: 100%;
      background-color: rgba(22, 22, 22, 0.7);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background-image: url('../../assets/img/no_he@2x.png');
      background-repeat: no-repeat;
      background-size: auto 100px;
      background-position: center center;
    }
  }
  .value {
    display: flex;
    align-items: center;
    div {
      display: flex;
      align-items: center;

      span {
        font-size: 20px;
        color: $text-t;
      }
    }
  }
  .info-list {
    > li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 12px;
      label {
        color: $text-g;
      }
      span {
        color: $text-t;
        text-align: right;
      }
    }
  }
  .borrow-btn {
    display: block;
    height: 35px;
    margin: 0 auto;
    border-radius: 10px;
    background-color: $main-color;
    color: $text-m;
    margin-top: 30px;
    font-size: 16px;
    &:hover {
      background-color: $main-hover;
    }
  }
}
</style>