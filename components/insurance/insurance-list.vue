<template>
  <div class="insurance_list">
    <table>
      <thead>
        <tr>
          <td>{{ $t("Table.ID") }}</td>
          <td>{{ $t("Table.Rent") }}</td>
          <td>{{ $t("Table.Amount") }}</td>
          <td class="option">{{ $t("Table.Options") }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in showList" :key="index">
          <td>
            {{ item.showID }}
          </td>
          <td>{{ item.price }}</td>
          <td>{{ item.remain }}</td>
          <td class="option">
            <PInput
              type="number"
              v-model="item.buyNum"
              fix="8"
              maxValue="10000000"
              :right="$t('Table.Insure')"
              @numChange="handleClickBuy(item)"
            ></PInput>
          </td>
        </tr>
      </tbody>
      <div class="loading" v-if="isLoading">
        <img src="~/assets/img/loading.gif" />
      </div>
    </table>
    <!-- H5 -->
    <div>
      <section v-for="(item, index) in showList" :key="index">
        <p>
          <span>{{ $t("Table.ID") }}</span
          ><span>{{ item.showID }}</span>
        </p>
        <div>
          <p>
            <span>{{ $t("Table.Rent") }}</span> <span>{{ item.price }}</span>
          </p>
          <p>
            <span>{{ $t("Table.Amount") }}</span
            ><span>{{ item.remain }}</span>
          </p>
        </div>
        <div>
          <PInput
            type="number"
            v-model="item.buyNum"
            fix="8"
            maxValue="10000000"
            :right="$t('Table.Insure')"
            @numChange="handleClickBuy(item)"
          ></PInput>
        </div>
      </section>
      <div class="loading" v-if="isLoading">
        <img src="~/assets/img/loading.gif" />
      </div>
    </div>
    <section class="noData" v-if="showList.length < 1 && !isLoading">
      <div>
        <img src="~/assets/img/helmet/nodata.png" alt="" />
        <p>{{ $t("Table.NoData") }}</p>
      </div>
    </section>
    <section class="pages" v-if="insuranceList.length > 10">
      <div>
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
      </div>
    </section>
  </div>
</template>

<script>
import PInput from "~/components/common/p-input.vue";
import "~/assets/svg/iconfont.js";
import precision from "~/assets/js/precision.js";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
import { toWei, fromWei } from "~/assets/utils/web3-fun.js";
import { buyInsuranceBuy, asks } from "~/interface/order.js";
import { getTokenName } from "~/assets/utils/address-pool.js";
export default {
  props: ["currentCoin", "currentType"],
  components: {
    PInput,
  },
  data() {
    return {
      price: "",
      precision,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
      page: 0,
      limit: 10,
      insuranceList: [],
      showList: [],
      sellList: [],
      buyList: [],
      isLoading: true,
    };
  },
  watch: {
    currentCoin(newValue) {
      if (newValue) {
        this.currentCoin = newValue;
        this.page = 0;
        this.limit = 10;
        this.checkList(newValue, this.currentType);
      }
    },
    currentType(newValue) {
      if (newValue) {
        this.currentType = newValue;
        this.page = 0;
        this.limit = 10;
        this.checkList(this.currentCoin, newValue);
      }
    },
    aboutInfoSell: {
      handler: "aboutInfoSellWatch",
      immediate: true,
    },
    aboutInfoBuy: {
      handler: "aboutInfoBuyWatch",
      immediate: true,
    },
  },
  computed: {
    aboutInfoSell() {
      let list = this.$store.state.aboutInfoSell;
      return list;
    },
    aboutInfoBuy() {
      let list = this.$store.state.aboutInfoBuy;
      return list;
    },
    indexArray() {
      let list = this.$store.state.allIndexPrice;
      return list;
    },
  },
  methods: {
    // 卖单数据
    aboutInfoSellWatch(newValue) {
      if (newValue) {
        this.setList(newValue, this.aboutInfoBuy);
      }
    },
    // 买单数据
    aboutInfoBuyWatch(newValue) {
      if (newValue) {
        this.setList(this.aboutInfoSell, newValue);
      }
    },
    // 格式化数据
    async setList(sell) {
      this.isLoading = true;
      this.showList = [];
      const sellResult = [];
      const buyResult = [];
      let spliceResult = [];
      let item, volume, price, id, seller;
      let resultItem;
      let now = new Date() * 1;
      for (let i = 0; i < sell.length; i++) {
        item = sell[i];
        let time = item.longInfo._expiry * 1000;
        let token = getTokenName(item.longInfo._underlying);
        let coToken = getTokenName(item.longInfo._collateral);
        let price =
          coToken == "CTK"
            ? fromWei(item.price, 30)
            : fromWei(item.price, token);
        let showID =
          item.seller.substr(0, 2) +
          item.seller.substr(2, 4) +
          "..." +
          item.seller.substr(-5).toUpperCase();
        if (token == "WBNB") {
          let res = await asks(item.askID, "sync", coToken);
          resultItem = {
            seller: item.seller,
            id: item.askID,
            volume: fromWei(item.volume, coToken),
            price: price,
            settleToken: item.settleToken,
            _strikePrice: fromWei(item.longInfo._strikePrice, coToken),
            _underlying: item.longInfo._underlying,
            _expiry: item.longInfo._expiry,
            _collateral: item.longInfo._collateral,
            remain: res,
            showID,
            buyNum: "",
          };
          if (res != 0 && time > now) {
            buyResult.push(resultItem);
          }
        } else {
          let Token = getTokenName(item.longInfo._collateral);
          let unToken = getTokenName(item.longInfo._underlying);
          let exPirce = fromWei(item.longInfo._strikePrice, Token);
          exPirce = precision.divide(1, exPirce);
          let volume =
            (fromWei(item.volume, Token) * this.indexArray[0][unToken]) / 2;
          let price = fromWei(item.price, Token);
          let res = await asks(item.askID, "sync", Token);
          resultItem = {
            seller: item.seller,
            id: item.askID,
            volume: volume,
            price: price,
            settleToken: item.settleToken,
            _strikePrice: fromWei(item.longInfo._strikePrice, unToken),
            _underlying: item.longInfo._underlying,
            _expiry: item.longInfo._expiry,
            _collateral: item.longInfo._collateral,
            remain: res,
            showID,
            buyNum: "",
          };
          if (res != 0 && time > now) {
            sellResult.push(resultItem);
          }
        }
      }
      this.isLoading = false;
      this.buyList = buyResult;
      this.sellList = sellResult;
      let result = this.buyList.filter(
        (item) => getTokenName(item._collateral) == this.currentCoin
      );
      this.insuranceList = result;
      this.showList = result.slice(this.page * this.limit, this.limit);
    },
    checkList(coin, type) {
      if (type == 1) {
        let result = this.buyList.filter(
          (item) => getTokenName(item._collateral) == this.currentCoin
        );
        this.insuranceList = result;
        this.showList = result.slice(this.page * this.limit, this.limit);
      } else {
        let result = this.sellList.filter(
          (item) => getTokenName(item._underlying) == this.currentCoin
        );
        this.insuranceList = result;
        this.showList = result.slice(this.page * this.limit, this.limit);
      }
    },
    // 分页
    upPage() {
      if (this.page <= 0) {
        return;
      }
      let page = this.page;
      this.page = page - 1;
      let list = this.insuranceList.slice(this.page * 10, page * 10);
      this.showList = list;
    },
    downPage() {
      if (Math.ceil(this.insuranceList.length / this.limit) <= this.page + 1) {
        return;
      }
      let page = this.page + 1;
      this.page = page;
      let list = this.insuranceList.slice(this.page * 10, (page + 1) * 10);
      this.showList = list;
    },
    // 承保按钮
    handleClickBuy(data) {
      if (!data.buyNum) {
        return;
      }
      let datas;
      if (this.currentType == 1) {
        datas = {
          askID: data.id,
          volume: data.buyNum,
          price: data.price,
          settleToken: "HELMET",
          _strikePrice: data._strikePrice,
          _underlying: getTokenName(data._underlying),
          _expiry: data._expiry,
          _collateral: getTokenName(data._collateral),
        };
      } else {
        let Token = getTokenName(data._underlying);
        // (fromWei(item.volume, Token) * this.indexArray[0][unToken]) / 2;
        datas = {
          askID: data.id,
          volume: data.buyNum,
          // volume: fixD(data.buyNum * this.indexArray[0][Token], 8) / 2,
          price: data.price,
          settleToken: "HELMET",
          _strikePrice: data._strikePrice,
          _underlying: getTokenName(data._underlying),
          _expiry: data._expiry,
          _collateral: getTokenName(data._collateral),
        };
      }

      buyInsuranceBuy(datas, (status) => {});
    },
    // 计算数量
    setNum() {},
  },
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .insurance_list {
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
      section {
        height: 160px;
        box-sizing: border-box;
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
}
</style>