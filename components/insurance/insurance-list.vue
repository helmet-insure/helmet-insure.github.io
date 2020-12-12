<template>
  <div class="insurance_list">
    <table>
      <thead>
        <tr>
          <td>{{ $t("Table.ID") }}</td>
          <!-- <td>{{ $t("Table.Rent") }}</td> -->
          <td>保单单价</td>
          <td>{{ $t("Table.Amount") }}</td>
          <td class="option">{{ $t("Table.Options") }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in insuranceList" :key="index">
          <td>
            {{
              (
                item.id.substr(0, 2) +
                item.id.substr(2, 4) +
                "..." +
                item.id.substr(-5)
              ).toUpperCase()
            }}
          </td>
          <td>{{ item.price }}</td>
          <td>{{ item.volume }}</td>
          <td class="option">
            <PInput
              type="number"
              v-model="item.buyNum"
              fix="2"
              maxValue="100000"
              :right="$t('Table.Insure')"
              @numChange="handleClickBuy(item)"
            ></PInput>
          </td>
        </tr>
      </tbody>
    </table>
    <section class="pages">
      <p @click="upPage">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chevronleft1"></use>
        </svg>
      </p>
      <i></i>
      <p @click="downPage">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chevronright1"></use>
        </svg>
      </p>
    </section>
    <div>
      <p><span>ID</span><span>01239012</span></p>
      <div>
        <p><span>保费(HELMET)</span> <span>100只</span></p>
        <p><span>保单数量</span><span>10000</span></p>
      </div>
      <div>
        <PInput
          type="number"
          v-model="price"
          fix="2"
          :right="$t('Table.Insure')"
          maxValue="10000"
        ></PInput>
      </div>
    </div>
    <div>
      <p><span>ID</span><span>01239012</span></p>
      <div>
        <p><span>保费(HELMET)</span> <span>100只</span></p>
        <p><span>保单数量</span><span>10000</span></p>
      </div>
      <div>
        <PInput
          type="number"
          v-model="price"
          fix="2"
          :right="$t('Table.Insure')"
          maxValue="10000"
        ></PInput>
      </div>
    </div>
  </div>
</template>

<script>
import PInput from '~/components/common/p-input.vue';
import '~/assets/svg/iconfont.js'
import precision from '~/assets/js/precision.js';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import { buyInsurance } from '~/interface/order.js'
import { getTokenName } from '~/assets/utils/address-pool.js';
export default {
  props: ['currentCoin', 'currentType',],
  components: {
    PInput,
  },
  data() {
    return {
      price: '',
      CoinType: 'HELMET',
      InsureType: 1,
      precision,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
      insuranceList: [],
      page: 0,
      limit: 10,
      ListType: 'buy'
    };
  },
  watch: {
    currentCoin(newValue) {
      if (newValue) {
        this.CoinType = newValue
        this.page = 0;
        this.limit = 10;
        this.setList(this.$store.state.aboutInfoSell)
      }
    },
    currentType(newValue) {
      if (newValue) {
        this.InsureType = newValue
        this.ListType = newValue
        this.page = 0;
        this.limit = 10;
        this.setList(this.$store.state.aboutInfoSell)
      }
    },

    aboutInfoSell: {
      handler: 'aboutInfoSellWatch',
      immediate: true,
    },
    aboutInfoBuy: {
      handler: 'aboutInfoBuyWatch',
      immediate: true,
    }
  },
  computed: {
    aboutInfoSell() {
      let list = this.$store.state.aboutInfoSell
      return list
    },
    aboutInfoBuy() {
      let list = this.$store.state.aboutInfoBuy
      return list
    }
  },
  methods: {
    aboutInfoSellWatch(newValue) {
      if (newValue) {
        this.setList(newValue, this.aboutInfoBuy);
      }
    },
    aboutInfoBuyWatch(newValue) {
      if (newValue) {
        this.setList(this.aboutInfoSell, newValue);
      }
    },
    setList(sell, buy) {
      const sellResult = []
      const buyResult = []
      let spliceResult = []
      let item, volume, price, id, seller;
      let resultItem;
      for (let i = 0; i < sell.length; i++) {
        item = sell[i]
        let token = getTokenName(item.longInfo._underlying)
        if (token == 'WBNB') {
          resultItem = {
            id: item.seller,
            volume: precision.divide(item.volume, item.longInfo._strikePrice),
            price: fromWei(item.price, item.longInfo._underlying),
            settleToken: item.settleToken,
            _strikePrice: item.longInfo._underlying,
            _underlying: item.longInfo._underlying,
            _expiry: item.longInfo._expiry,
            _collateral: item.longInfo._collateral,
            buyNum: ''
          }
          buyResult.push(resultItem)
        } else {
          resultItem = {
            id: item.seller,
            volume: precision.divide(item.volume, item.longInfo._strikePrice),
            price: fromWei(item.price, item.longInfo._underlying),
            settleToken: item.settleToken,
            _strikePrice: item.longInfo._underlying,
            _underlying: item.longInfo._underlying,
            _expiry: item.longInfo._expiry,
            _collateral: item.longInfo._collateral,
            buyNum: ''
          }
          sellResult.push(resultItem)
        }
      }
      if (this.ListType == 'buy') {
        spliceResult = buyResult.splice(this.page * this.limit, this.limit)
      } else {
        spliceResult = sellResult.splice(this.page * this.limit, this.limit)
      }
      console.log(spliceResult)
      this.insuranceList = spliceResult
    },
    // 分页
    upPage() {
      if (this.page <= 0) {
        return
      }
      this.page = this.page - 1
      this.setList(this.aboutInfoSell);
    },
    downPage() {
      if (Math.floor(this.aboutInfoSell.length / this.limit) <= this.page) {
        return
      }
      this.page = this.page + 1
      this.setList(this.aboutInfoSell);
    },
    // 承保按钮
    handleClickBuy(data) {
      if (!data.buyNum) {
        return
      }
      const datas = {
        askID: data.id,
        volume: data.buyNum,
        price: data.price,
        settleToken: 'WBNB',
        _strikePrice: data.price,
        _underlying: 'HELMET',
        _expiry: data._expiry,
        _collateral: 'WBNB',

      };
      buyInsurance(datas, (status) => { });
    },
    // 计算数量
    setNum() {

    },
  }

};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .insurance_list {
    padding-bottom: 40px;
    position: relative;
    > div {
      display: none;
    }
    table {
      width: 100%;
      display: flex;
      flex-direction: column;
      tr {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
        td {
          width: 100px;
          white-space: nowrap;
        }
      }
      .option {
        text-align: right;
        width: 265px;
      }
      thead {
        width: 100%;
        background: #f7f7fa;
        tr {
          height: 40px;
          color: #919aa6;
          td {
            line-height: 40px;
            font-size: 14px;
          }
        }
      }
      tbody {
        width: 100%;
        tr {
          width: 100%;
          box-shadow: 0px 1px 0px 0px #ededf0;
          td {
            white-space: nowrap;
            width: 100px;
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            font-weight: bold;
            color: #121212;
          }
          .option {
            display: flex;
            align-items: center;
            transform: translateX(20px);
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance_list {
    table {
      display: none;
    }
    > div {
      width: 100%;
      height: 160px;
      padding: 20px 10px;
      background: #f7f7fa;
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
      p {
        display: flex;
        span:nth-of-type(1) {
          font-size: 12px;
          color: #919aa6;
        }
        span:nth-of-type(2) {
          font-weight: bold;
          color: #121212;
        }
      }
      > p {
        align-items: center;
        span:nth-of-type(1) {
          margin-right: 4px;
        }
      }
      > div {
        margin: 12px 0 16px 0;
        display: flex;
        p {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>