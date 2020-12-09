<template>
  <div class="settlement">
    <h3 class="title">{{ $t('Table.FundsWithdrawn') }}</h3>
    <table class="table">
      <thead>
        <tr>
          <th>{{ $t('Table.Type') }}</th>
          <th>{{ $t('Table.Underlying') }}</th>
          <th>{{ $t('Table.Collaborate') }}</th>
          <th>{{ $t('Table.Status') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in settlementList" :key="index">
          <td>
            <div class="settlement-type-box">
              <img :src="require(`~/assets/img/${item._underlying}@2x.png`)" />
              <span>{{ item._underlying }}</span>
            </div>
          </td>
          <td>
            {{ addCommom(item.und, 4) }}
            {{ item._underlying }}
          </td>
          <td>
            {{ addCommom(precision.plus(item.col, item.longBalance), 4) }}
            {{ item._collateral }}
          </td>
          <td>
            <button
              @click="toSettle(item, index)"
              :class="currentClaimId === index ? 'button-loading' : ''"
              :disabled="currentClaimId === index ? true : false"
            >
              <img
                src="~/assets/img/loading.gif"
                v-if="currentClaimId === index"
              />
              {{ $t('Table.Claim') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="h5-table">
      <div
        class="h5-table-item"
        v-for="(item, index) in settlementList"
        :key="index"
      >
        <div class="h5-table-top">
          <p>
            <img :src="require(`~/assets/img/${item._underlying}@2x.png`)" />
            <span>{{ item._underlying }}</span>
          </p>
          <button
            @click="toSettle(item, index)"
            :class="currentClaimId === index ? 'button-loading' : ''"
            :disabled="currentClaimId === index ? true : false"
          >
            <img
              src="~/assets/img/loading.gif"
              v-if="currentClaimId === index"
            />Claim
          </button>
        </div>
        <div class="h5-table-bottom">
          <p>
            {{ addCommom(precision.times(item.und, 1), 4) }}
            <i>{{ item._underlying }}</i>
          </p>
          <p>
            {{ addCommom(precision.plus(item.col, item.longBalance), 4) }}
            <i>{{ item._collateral }}</i>
          </p>
        </div>
      </div>
    </div>
    <NoData v-if="settlementList.length < 1 && !isLoading"></NoData>
    <div class="loading" v-if="isLoading">
      <img src="~/assets/img/loading.gif" />
    </div>
    <div class="page" v-if="originList.length >= 5">
      <div :class="['pre', page === 1 ? 'disabled' : '']" @click="preFun"></div>
      <div
        :class="[
          'next',
          page === parseInt(originList.length / limit) + 1 ? 'disabled' : '',
        ]"
        @click="nextFun"
      ></div>
    </div>
  </div>
</template>
<script>
import NoData from '~/components/common/no-data.vue';
import { getBalance } from '~/interface/order.js';
import { newGetSymbol, getWei } from '~/assets/utils/address-pool.js';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import { settleable, burn, settle } from '~/interface/factory.js';
import precision from '~/assets/js/precision.js';
import { fixD, addCommom } from '~/assets/js/util.js';

export default {
  name: 'settlement',
  components: {
    NoData,
  },
  data() {
    return {
      originList: [],
      settlementList: [],
      precision: precision,
      isLoading: false,
      offset: 0,
      limit: 5,
      page: 1,
      addCommom: addCommom,
    };
  },
  computed: {
    myAboutInfoSell() {
      return this.$store.state.myAboutInfoSell;
    },
    currentClaimId() {
      return this.$store.state.currentAllId.currentClaimId;
    },
  },
  watch: {
    myAboutInfoSell: {
      handler: 'myAboutInfoSellWatch',
      immediate: true,
    },
  },
  methods: {
    preFun() {
      if (this.offset > 0) {
        this.offset = this.offset - this.limit;
        this.page = this.page - 1;
        this.searchList();
      } else {
        this.offset = 0;
      }
    },
    nextFun() {
      const total = this.originList.length;
      if (this.offset < total) {
        this.offset = this.offset + this.limit;
        this.page = this.page + 1;
        this.searchList();
      }
    },
    myAboutInfoSellWatch(newValue) {
      if (newValue) {
        this.setSettlementList(newValue);
      }
    },
    async setSettlementList(list) {
      this.isLoading = true;
      const result = [];
      let item,
        longBalance,
        shortBalance,
        _collateral,
        _underlying,
        number,
        volume,
        id,
        und;
      for (let i = 0; i < list.length; i++) {
        item = list[i];
        _collateral = newGetSymbol(item.longInfo._collateral, window.chainID);
        longBalance = await getBalance(item.longInfo.long, _collateral);
        _underlying = newGetSymbol(item.longInfo._underlying, window.chainID);
        shortBalance = await getBalance(item.longInfo.short, _collateral);
        // console.log(i + '####item###', item);
        // console.log(i + '####longBalance###',longBalance, '###shortBalance###', shortBalance );
        if (Number(shortBalance) > 0 && Number(longBalance) > 0) {
          result.push({
            creator: item.seller,
            _collateral,
            _underlying,
            col: 0,
            fee: 0,
            und: 0,
            long: item.longInfo.long,
            short: item.longInfo.short,
            longBalance: longBalance,
            longBalance: Math.min(Number(shortBalance), Number(longBalance)),
          });
        }

        number = precision.minus(shortBalance, longBalance);

        if (Number(number) > 0) {
          try {
            volume = toWei(number, _collateral);
            const settle = await settleable(item.longInfo.short, volume);

            if (settle.col !== '0' || settle.und !== '0') {
              if (_collateral === 'USDT' || _collateral === 'USDC') {
                und = fromWei(settle.und, _collateral);
                und = precision.divide(und, 1000000000000);
              } else {
                und = fromWei(settle.und, _collateral);
              }

              result.push({
                creator: item.seller,
                _collateral,
                _underlying,
                col: fromWei(settle.col, _collateral),
                fee: fromWei(settle.fee, _collateral),
                // und: fromWei(settle.und, _collateral),
                und,
                long: item.longInfo.long,
                short: item.longInfo.short,
                // longBalance: Number(longBalance) > 0 ? String(number) : 0,
                longBalance: 0,
              });
            }
          } catch (err) {
            console.log('setSettlementList##err###', err);
          }
        }
      }
      this.isLoading = false;
      // this.settlementList = result;
      this.originList = result;
      this.settlementList = result.slice(0, this.limit);
      this.$store.dispatch('setCurrentId', { currentClaimId: '' });
    },
    searchList() {
      this.settlementList = this.originList.slice(
        this.offset,
        this.limit * this.page
      );
    },
    toSettle(item, index) {
      this.$store.dispatch('setCurrentId', { currentClaimId: index });
      if (item.longBalance != 0) {
        burn(
          item.short,
          item.longBalance,
          { _collateral: item._collateral },
          item
        );
      } else {
        settle(item.short, item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/assets/css/base.scss';

@media screen and (min-width: 750px) {
  .settlement {
    background: $bg-c;
    margin-top: 20px;
    /* width: 1200px;
    margin: 0 auto; */
    margin-bottom: 30px;
    padding-bottom: 20px;
    position: relative;
    .title {
      font-size: 16px;
      color: $text-t;
      height: 60px;
      line-height: 60px;
      padding-left: 16px;
    }
    .settlement-type-box {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 32px;
      }
      span {
        margin-left: 6px;
      }
    }
    .h5-table {
      display: none;
    }
  }
}
@media screen and (max-width: 750px) {
  .settlement {
    background: $bg-c;
    margin-bottom: 20px;
    .title {
      font-size: 14px;
      color: $text-t;
      height: 60px;
      line-height: 60px;
      padding-left: 16px;
      box-shadow: 0px 1px 0px 0px #1d1d1d;
    }
    .table {
      display: none;
    }
    .h5-table {
      .h5-table-item {
        padding: 16px 20px 16px;
        box-shadow: 0px 1px 0px 0px #1d1d1d;
      }
      .h5-table-top {
        display: flex;
        justify-content: space-between;
        p {
          display: flex;
          align-items: center;
          img {
            width: 48px;
            height: 30px;
          }
          span {
            font-size: 20px;
            font-weight: 500;
            color: #dbdbdb;
          }
        }
        > button {
          display: flex;
          padding: 6px 12px;
          background: #873232;
          border-radius: 10px;
          align-items: center;
          color: $text-m;
          img {
            width: 16px;
            height: 16px;
            margin-right: 2px;
          }
        }
        > button:hover {
          background: $main-hover;
        }
      }
      .h5-table-bottom {
        display: flex;
        margin-top: 15px;
        justify-content: space-between;
        p {
          font-size: 16px;
          font-weight: 500;
          color: #dbdbdb;
          i {
            font-size: 14px;
            color: #7d7d7d;
            line-height: 20px;
          }
        }
      }
    }
    .settlement-type-box {
      display: none;
    }
  }
}
</style>