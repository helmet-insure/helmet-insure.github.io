<template>
  <div class="order-list">
    <div class="order-option-container">
      <OrderOption statusType="orderStatus" @search="searchList"></OrderOption>
    </div>
    <div class="table-list-box">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t('Table.Type') }}</th>
            <th>
              <Tooltip
                :name="$t('Table.ExecutivePrice')"
                width="300px"
                :hint="$t('Tips.HoverTip5')"
              ></Tooltip>
            </th>
            <th>{{ $t('Table.Amount') }}</th>
            <th>{{ $t('Table.TotalCollateral') }}</th>
            <th>
              <Tooltip
                :name="$t('Table.Rents')"
                width="300px"
                :hint="$t('Tips.HoverTip3')"
              ></Tooltip>
            </th>
            <th>
              <Tooltip
                :name="$t('Table.DueDate')"
                width="300px"
                :hint="$t('Tips.HoverTip4')"
              ></Tooltip>
            </th>
            <th>{{ $t('Table.Status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in orderList" :key="index">
            <!-- Type -->
            <td>{{ item._underlying }}</td>
            <!-- Executive Price -->
            <td>
              {{ autoRounding(precision.divide(1, item._strikePrice)) }}
              {{ item._collateral }}
            </td>
            <!-- Amount -->
            <td>
              {{ toRounding(precision.times(item.vol, item._strikePrice), 2) }}
            </td>
            <!-- Total Collateral -->
            <td>{{ addCommom(item.vol, 4) }} {{ item._collateral }}</td>
            <!-- Rents -->
            <td>
              {{
                item.settleToken === 'USDT' || item.settleToken === 'USDC'
                  ? addCommom(
                      precision.times(
                        precision.divide(item.price, 1000000000000),
                        item.vol
                      ),
                      4
                    )
                  : addCommom(precision.times(item.price, item.vol), 4)
              }}
              {{ item.settleToken }}
            </td>
            <!-- Due Date -->
            <td>
              {{
                moment(parseInt(item._expiry)).format('MMMM Do YYYY, HH:mm:ss')
              }}
            </td>
            <td>{{ item.status }}</td>
          </tr>
        </tbody>
      </table>
      <div
        class="tabs-item-box"
        v-for="(item, index) in orderList"
        :key="index"
      >
        <div class="tabs-item-box-title">
          <img :src="require(`~/assets/img/${item._underlying}@2x.png`)" />
          <h3>{{ item._underlying }}</h3>
          <p>
            <i v-if="statusFilter(item.status)"></i
            ><span>{{ item.status }}</span>
          </p>
        </div>
        <div class="tabs-item-box-text">
          <p>
            <span>{{ $t('Table.ExecutivePrice') }}</span>
            <span>
              {{ autoRounding(precision.divide(1, item._strikePrice)) }}
              {{ item._collateral }}
            </span>
          </p>
          <p>
            <span>{{ $t('Table.Amount') }}</span>
            <span>
              {{ toRounding(precision.times(item.vol, item._strikePrice), 2) }}
            </span>
          </p>
        </div>
        <div class="tabs-item-box-text">
          <p>
            <span>{{ $t('Table.TotalCollateral') }}</span>
            <span>{{ addCommom(item.vol, 4) }} {{ item._collateral }} </span>
          </p>
          <p>
            <span>{{ $t('Table.Rents') }}</span>
            <span>
              {{ addCommom(precision.times(item.price, item.vol), 4) }}
              {{ item.settleToken }}
            </span>
          </p>
        </div>
        <div class="tabs-item-box-text">
          <p>
            <span>{{ $t('Dialog.DueDate') }}</span>
            <span>
              {{
                moment(parseInt(item._expiry)).format('MMMM Do YYYY, HH:mm:ss')
              }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="loading" v-if="isLoading">
      <img src="~/assets/img/loading.gif" />
    </div>
    <NoData v-if="!isLoading && orderList.length < 1"></NoData>
    <div class="page" v-if="originList.length >= 10">
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
import OrderOption from '~/components/buy/order-option.vue';
import Tooltip from '~/components/common/tooltip.vue';
import NoData from '~/components/common/no-data';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import {
  getID,
  newGetSymbol,
  getAddress,
} from '~/assets/utils/address-pool.js';
import { getExercise } from '~/interface/order.js';
import precision from '~/assets/js/precision.js';
import moment from 'moment';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';

export default {
  name: 'order-list',
  components: {
    Tooltip,
    NoData,
    OrderOption,
  },
  data() {
    return {
      originList: [],
      orderList: [],
      isLoading: true,
      precision: precision,
      moment: moment,
      offset: 0,
      limit: 10,
      searchItem: null,
      page: 1,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
    };
  },
  computed: {
    aboutInfoBuySeller() {
      return this.$store.state.aboutInfoBuySeller;
    },
  },
  watch: {
    aboutInfoBuySeller: {
      handler: 'aboutInfoBuySellerWatch',
      immediate: true,
    },
  },
  methods: {
    statusFilter(status) {
      switch (status) {
        case this.$t('Status.Activated'):
          return true;
          break;
        default:
          return false;
          break;
      }
    },
    preFun() {
      if (this.offset > 0) {
        this.offset = this.offset - this.limit;
        this.page = this.page - 1;
        this.searchList(this.searchItem);
      } else {
        this.offset = 0;
      }
    },
    nextFun() {
      const total = this.originList.length;
      if (this.offset < total) {
        this.offset = this.offset + this.limit;
        this.page = this.page + 1;
        this.searchList(this.searchItem);
      }
    },
    aboutInfoBuySellerWatch(newValue) {
      if (newValue) {
        this.setOrderList(newValue);
      }
    },
    async setOrderList(list) {
      this.isLoading = true;
      const result = [];
      let item, _collateral, _underlying, settleToken;
      let currentTime = new Date().getTime();
      let resultItem, exerciseRes;
      let bidIDArr;

      for (let i = 0; i < list.length; i++) {
        item = list[i];
        _collateral = newGetSymbol(
          item.sellInfo.longInfo._collateral.toLowerCase(),
          window.chainID
        );
        _underlying = newGetSymbol(
          item.sellInfo.longInfo._underlying.toLowerCase(),
          window.chainID
        );
        settleToken = newGetSymbol(
          item.sellInfo.settleToken.toLowerCase(),
          window.chainID
        );

        resultItem = {
          askID: item.askID,
          bidID: item.bidID,
          buyer: item.buyer,
          amt: fromWei(item.amt),
          vol: fromWei(item.vol, _collateral),
          seller: item.sellInfo.seller,
          volume: fromWei(item.sellInfo.volume, _collateral),
          settleToken,
          price: fromWei(item.sellInfo.price, _collateral),
          creator: item.sellInfo.longInfo.creator,
          _expiry: parseInt(item.sellInfo.longInfo._expiry) * 1000,
          _underlying,
          _collateral,
          _strikePrice: fromWei(
            item.sellInfo.longInfo._strikePrice,
            _collateral
          ),
          short: item.sellInfo.longInfo.short,
          count: item.sellInfo.longInfo.count,
        };

        if (resultItem._expiry < currentTime) {
          resultItem['status'] = this.$t('Status.Dated');
          resultItem['sort'] = 0;
        } else {
          resultItem['status'] = this.$t('Status.Unactivated');
          resultItem['sort'] = 2;
        }

        exerciseRes = await getExercise(resultItem.buyer);
        bidIDArr = exerciseRes.map((eItem) => {
          return eItem.returnValues.bidID;
        });
        if (bidIDArr.includes(resultItem.bidID)) {
          resultItem['status'] = this.$t('Status.Activated');
          resultItem['sort'] = 1;
        }

        result.push(resultItem);
      }

      const sortResult = result.sort((a1, a2) => {
        return a2.sort - a1.sort;
      });

      this.isLoading = false;
      // this.orderList = sortResult;
      this.originList = sortResult || [];
      // this.list = sortResult || [];
      this.orderList = sortResult.slice(0, this.limit);
    },
    // 搜索
    searchList(data) {
      if (!data) {
        this.orderList = this.originList.slice(
          this.offset,
          this.limit * this.page
        );
      }
      this.searchItem = data;
      let item;
      const result = [];
      const now = new Date().getTime();
      let flag = false;
      for (let i = 0; i < this.originList.length; i++) {
        item = this.originList[i];
        // 时间筛选
        if (
          (data.period === 0 || parseInt(item._expiry) - now <= data.period) &&
          (data.type === 'All' || item._underlying === data.type) &&
          (data.coin === 'All' || item._collateral === data.coin) &&
          (data.status === 'All' || item.status === data.status)
        ) {
          result.push(item);
        }
      }
      this.orderList = result.slice(this.offset, this.limit * this.page);
    },
  },
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 750px) {
  .table-list-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    .table {
      display: none;
    }
  }
}
@media screen and (min-width: 750px) {
  .table-list-box {
    padding-top: 20px;
  }
}
</style>