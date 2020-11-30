<template>
  <div class="advert-list">
    <div class="order-option-container">
      <OrderOption statusType="advStatus" @search="searchList"></OrderOption>
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
            <th>{{ $t('Table.Rent') }}/{{ $t('Table.Total') }}</th>
            <th>{{ $t('Table.TotalCollateral') }}</th>
            <th>
              <Tooltip
                :name="$t('Table.TotalRents')"
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in advertList" :key="index">
            <!-- Type -->
            <td>{{ item._underlying }}</td>
            <!-- Executive Price -->
            <td>
              {{ autoRounding(precision.divide(1, item._strikePrice)) }}
              {{ item._collateral }}
            </td>
            <!-- Rest/Total -->
            <td>
              {{
                toRounding(precision.times(item.remain, item._strikePrice), 2)
              }}
              /
              {{
                toRounding(precision.times(item.volume, item._strikePrice), 2)
              }}
            </td>
            <!-- Total Collateral -->
            <td>{{ addCommom(item.volume, 4) }} {{ item._collateral }}</td>
            <!-- Total Rents -->
            <td>
              {{
                item._collateral === 'USDT' || item._collateral === 'USDC'
                  ? addCommom(
                      precision.times(
                        precision.divide(item.price, 1000000000000),
                        item.volume
                      ),
                      4
                    )
                  : addCommom(precision.times(item.price, item.volume), 4)
              }}
              {{ item._collateral }}
            </td>
            <!-- Due Date -->
            <td>
              {{
                moment(parseInt(item._expiry)).format('MMMM Do YYYY, HH:mm:ss')
              }}
            </td>
            <!-- Status -->
            <td>{{ item.status }}</td>
            <td>
              <button
                v-if="item.status === 'Unborrowed'"
                :class="currentCancelId === index ? 'button-loading' : ''"
                :disabled="currentCancelId === index ? true : false"
                @click="openCancelDialog(item, index)"
              >
                <img
                  src="~/assets/img/loading.gif"
                  alt=""
                  v-if="currentCancelId === index"
                />
                {{ $t('Dialog.Cancel') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="tabs-item-box"
        v-for="(item, index) in advertList"
        :key="index"
      >
        <div class="tabs-item-box-title">
          <img :src="require(`~/assets/img/${item._underlying}@2x.png`)" />
          <h3>{{ item._underlying }}</h3>
          <p>
            <span>{{ item.status }}</span>
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
            <span>{{ $t('Table.Rent') }}/{{ $t('Table.Total') }}</span>
            <span>
              {{
                addCommom(precision.times(item.remain, item._strikePrice), 4)
              }}
              /
              {{
                addCommom(precision.times(item.volume, item._strikePrice), 4)
              }}
            </span>
          </p>
        </div>
        <div class="tabs-item-box-text">
          <p>
            <span>{{ $t('Table.TotalCollateral') }}l</span>
            <span>{{ addCommom(item.vol, 4) }} {{ item._collateral }} </span>
          </p>
          <p>
            <span>{{ $t('Table.TotalRents') }}</span>
            <span>
              {{
                item._collateral === 'USDT' || item._collateral === 'USDC'
                  ? addCommom(
                      precision.times(
                        precision.divide(item.price, 1000000000000),
                        item.volume
                      ),
                      4
                    )
                  : addCommom(precision.times(item.price, item.volume), 4)
              }}
              {{ item._collateral }}
            </span>
          </p>
        </div>
        <div class="tabs-item-box-text">
          <p>
            <span>{{ $t('Table.DueDate') }}</span>
            <span>
              {{
                moment(parseInt(item._expiry)).format('MMMM Do YYYY, HH:mm:ss')
              }}
            </span>
          </p>
        </div>
        <div class="tabs-item-box-btn" v-if="item.status === 'Unborrowed'">
          <button
            v-if="item.status === 'Unborrowed'"
            :class="currentCancelId === index ? 'button-loading' : ''"
            :disabled="currentCancelId === index ? true : false"
            @click="openCancelDialog(item, index)"
            class="giveBack size-big"
          >
            <img
              src="~/assets/img/loading.gif"
              alt=""
              v-if="currentCancelId === index"
            />
            {{ $t('Dialog.Cancel') }}
          </button>
        </div>
      </div>
    </div>
    <NoData v-if="advertList.length < 1 && !isLoading"></NoData>
    <div class="loading" v-if="isLoading">
      <img src="~/assets/img/loading.gif" />
    </div>
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

    <PDialog
      v-if="showCancelDialog"
      title="Cancel"
      @close="closeCancelDialog"
      @confirm="confirmCancel"
    >
      <p class="cancel-dialog">Confirm to turn off Supply advertising?</p>
    </PDialog>
  </div>
</template>
<script>
import OrderOption from '~/components/buy/order-option.vue';
import Tooltip from '~/components/common/tooltip.vue';
import NoData from '~/components/common/no-data.vue';
import { newGetSymbol, getWei } from '~/assets/utils/address-pool.js';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import { asks, onCancel } from '~/interface/order.js';
import precision from '~/assets/js/precision.js';
import moment from 'moment';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import PDialog from '~/components/common/p-dialog.vue';

export default {
  name: 'advert-list', // 出租的广告
  components: {
    Tooltip,
    NoData,
    OrderOption,
    PDialog,
  },
  data() {
    return {
      originList: [],
      precision: precision,
      advertList: [],
      isLoading: true,
      moment: moment,
      offset: 0,
      limit: 10,
      page: 1,
      searchItem: null,
      addCommom: addCommom,
      autoRounding: autoRounding,
      showCancelDialog: false,
      currentItem: null,
      toRounding: toRounding,
      curCancelId: '',
    };
  },
  computed: {
    myAboutInfoSell() {
      return this.$store.state.myAboutInfoSell;
    },
    currentCancelId() {
      return this.$store.state.currentAllId.currentCancelId;
    },
  },
  watch: {
    myAboutInfoSell: {
      handler: 'myAboutInfoSellWatch',
      immediate: true,
    },
  },
  methods: {
    openCancelDialog(item, index) {
      this.curCancelId = index;
      this.currentItem = item;
      this.showCancelDialog = true;
    },
    closeCancelDialog() {
      this.curCancelId = '';
      this.showCancelDialog = false;
    },
    confirmCancel() {
      this.$store.dispatch('setCurrentId', {
        currentCancelId: this.curCancelId,
      });
      onCancel(this.currentItem.askID, (status) => {
        if (status === 'pending') {
          // this.props.sendAction("Status", "padding");
          console.log('onCancel###pending');
        } else if (status === 'approve') {
          // this.props.sendAction("Status", "approve");
          console.log('onCancel###pending');
        } else if (status === 'success' || status === 'failed') {
          console.log('onCancel###success##and##failed');
          this.$store.dispatch('setCurrentId', {
            currentCancelId: '',
          });
          // if (!Look) {
          //   Look = true;
          // }
          // this.props.sendAction("Status", "off");
        }
      });
      this.closeCancelDialog();
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
    myAboutInfoSellWatch(newValue) {
      if (newValue) {
        this.setAdvertList(newValue);
      }
    },
    async setAdvertList(list) {
      this.isLoading = true;
      const result = [];
      let item, _collateral, _underlying, settleToken, resultItem, askRes;
      const currentTime = new Date().getTime();
      for (let i = 0; i < list.length; i++) {
        item = list[i];
        _collateral = newGetSymbol(
          item.longInfo._collateral.toLowerCase(),
          window.chainID
        );
        _underlying = newGetSymbol(
          item.longInfo._underlying.toLowerCase(),
          window.chainID
        );
        settleToken = newGetSymbol(
          item.settleToken.toLowerCase(),
          window.chainID
        );
        resultItem = {
          askID: item.askID,
          seller: item.seller,
          long: item.long,
          volume: fromWei(item.volume, _collateral),
          price: fromWei(item.price, _collateral),
          settleToken,
          _collateral,
          _underlying,
          _strikePrice: fromWei(item.longInfo._strikePrice, _collateral),
          _expiry: parseInt(item.longInfo._expiry) * 1000,
          short: item.longInfo.short,
          count: item.longInfo.count,
        };

        askRes = await asks(resultItem.askID, 'sync', resultItem._collateral);
        if (askRes === '0') {
          resultItem['status'] = this.$t('Status.Beborrowed');
          resultItem['sort'] = 1;
        } else {
          resultItem['status'] = this.$t('Status.Unborrowed');
          resultItem['sort'] = 2;
        }
        if (parseInt(resultItem._expiry) < currentTime) {
          resultItem['status'] = this.$t('Status.Dated');
          resultItem['sort'] = 0;
        }
        // resultItem['remain'] = precision.times(askRes, 1);
        resultItem['remain'] = askRes;

        result.push(resultItem);
      }

      const sortResult = result.sort((a1, a2) => {
        return a2.sort - a1.sort;
      });
      this.isLoading = false;
      // this.advertList = sortResult;
      this.originList = sortResult || [];
      // this.list = sortResult || [];
      this.advertList = sortResult.slice(0, this.limit);
    },
    // 搜索
    searchList(data) {
      if (!data) {
        this.advertList = this.originList.slice(
          this.offset,
          this.limit * this.page
        );
        return;
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
      this.advertList = result.slice(this.offset, this.limit * this.page);
    },
  },
};
</script>
<style scoped lang="scss">
.cancel-dialog {
  padding: 30px 0px;
}
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