<template>
  <div class="my_insurance">
    <table>
      <thead>
        <tr>
          <td>{{ $t("Table.ID") }}</td>
          <td>{{ $t("Table.Type") }}</td>
          <td>{{ $t("Table.InsurancePrice") }}</td>
          <td>{{ $t("Table.Besold") }}</td>
          <td>{{ $t("Table.Unsold") }}</td>
          <td>{{ $t("Table.CanCollateral") }}</td>
          <td>{{ $t("Table.DueTime") }}</td>
          <td class="option"></td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in showList"
          :key="index"
          :class="
            getTokenName(item._underlying) == 'WBNB'
              ? 'call_style'
              : 'put_style'
          "
        >
          <template v-if="Number(item.unsold) != 0">
            <td>{{ item.id }}</td>
            <td>
              {{
                getTokenName(item._underlying) == "WBNB"
                  ? getTokenName(item._collateral)
                  : getTokenName(item._underlying)
              }}
            </td>
            <td>{{ fixD(toRounding(item.price, 4), 4) }}</td>
            <td>
              {{ fixD(toRounding(item.beSold, 4), 4) }}
            </td>
            <td>
              {{
                item.remain == "0"
                  ? fixD(toRounding(0, 4), 4)
                  : fixD(toRounding(item.unSold, 4), 4)
              }}
              <span
                class="cancel"
                @click="handleClickCancel(item)"
                v-if="item.remain != 0"
                >{{ $t("Table.Cancel") }}</span
              >
            </td>
            <td>{{ toRounding(item.shortBalance, 4) }}</td>
            <td>{{ item.dueDate }}</td>
            <td class="option">
              <!-- <button class="o_button">{{ $t("Table.outSure") }}</button> -->
              <button class="b_button" @click="toMining">
                {{ $t("Table.Stakeing") }}
              </button>
            </td>
          </template>
        </tr>
      </tbody>
      <div class="loading" v-if="isLoading">
        <img src="~/assets/img/loading.gif" />
      </div>
    </table>
    <!-- H5 -->
    <div>
      <div
        v-for="(item, index) in showList"
        :key="index"
        :class="
          getTokenName(item._underlying) == 'WBNB'
            ? 'call_style item_box'
            : 'put_style item_box'
        "
      >
        <p>
          <span>{{ $t("Table.ID") }}</span
          ><span>{{ item.id }}</span>
        </p>
        <div>
          <p>
            <span>{{ $t("Table.Type") }}</span
            ><span>
              {{
                getTokenName(item._underlying) == "WBNB"
                  ? getTokenName(item._collateral)
                  : getTokenName(item._underlying)
              }}</span
            >
          </p>
          <p>
            <span>{{ $t("Table.InsurancePrice") }}</span
            ><span>{{ fixD(toRounding(item.price, 4), 4) }}</span>
          </p>
        </div>
        <div>
          <p>
            <span>{{ $t("Table.Besold") }}/{{ $t("Table.Unsold") }}</span
            ><span
              >{{ fixD(toRounding(item.beSold, 4), 4) }}/
              {{
                item.remain == "0"
                  ? fixD(toRounding(0, 4), 4)
                  : fixD(toRounding(item.unSold, 4), 4)
              }}</span
            >
          </p>
          <p>
            <span>{{ $t("Table.CanCollateral") }}</span
            ><span>{{ toRounding(item.shortBalance, 4) }}</span>
          </p>
        </div>
        <div>
          <p>
            <span>{{ $t("Table.DueTime") }}</span
            ><span>{{ item.dueDate }}</span>
          </p>
        </div>
        <section>
          <button
            class="o_button"
            @click="handleClickCancel(item)"
            v-if="item.remain != 0"
          >
            {{ $t("Table.Cancel") }}
          </button>
          <button class="b_button" @click="toMining">
            {{ $t("Table.Stakeing") }}
          </button>
        </section>
      </div>
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
    <section class="pages" v-if="insuranceList.length > 5">
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
import precision from "~/assets/js/precision.js";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
import { toWei, fromWei } from "~/assets/utils/web3-fun.js";
import { getTokenName } from "~/assets/utils/address-pool.js";
import { onCancel, getBalance, asks, RePrice } from "~/interface/order.js";
export default {
  data() {
    return {
      precision,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
      showList: [],
      insuranceList: [],
      getTokenName,
      fixD,
      page: 0,
      limit: 5,
      isLoading: true,
    };
  },
  computed: {
    myAboutInfoSell() {
      return this.$store.state.myAboutInfoSell;
    },
    myAboutInfoBuy() {
      return this.$store.state.aboutInfoBuy;
    },
    rePriceMap() {
      return this.$store.state.repriceMap;
    },
  },
  watch: {
    myAboutInfoSell: {
      handler: "myAboutInfoSellWatch",
      immediate: true,
    },
  },
  methods: {
    myAboutInfoSellWatch(newValue) {
      if (newValue) {
        this.setSettlementList(newValue);
      }
    },
    // 格式化数据
    async setSettlementList(list) {
      this.isLoading = true;
      this.showList = [];
      let result = [];
      let item,
        resultItem,
        amount,
        InsurancePrice,
        _underlying,
        downTime,
        beSold,
        unSold,
        newArray,
        shortBalance,
        askRes;
      const currentTime = new Date().getTime();
      for (let i = 0; i < list.length; i++) {
        item = list[i];
        // 数量
        let Token = getTokenName(item.longInfo._collateral);
        amount = fromWei(item.volume, Token);
        // 保单价格
        InsurancePrice = fromWei(item.price, Token == "CTK" ? 30 : Token);
        //倒计时
        downTime = new Date(item.longInfo._expiry * 1000).toLocaleDateString();
        //已出售
        beSold = fromWei(this.getBeSold(item.askID), Token);
        unSold = precision.minus(amount, beSold);

        shortBalance = await getBalance(item.longInfo.short, item._collateral);
        resultItem = {
          id: item.askID,
          volume: amount,
          beSold: beSold,
          unSold: unSold,
          price: InsurancePrice,
          shortBalance: shortBalance,
          dueDate: downTime,
          _expiry: item.longInfo._expiry * 1000,
          _collateral: item.longInfo._collateral,
          _underlying: item.longInfo._underlying,
        };
        newArray = this.getNewPrice(item.askID);
        if (newArray) {
          resultItem["volume"] = amount = fromWei(newArray.volume, Token);
          resultItem["price"] = amount = fromWei(
            newArray.newPrice,
            Token == "CTK" ? 30 : Token
          );
          resultItem["id"] = amount = newArray.newAskID;
        }
        askRes = await asks(resultItem.id, "sync", resultItem._collateral);
        if (askRes == "0") {
          resultItem["status"] = "Beborrowed";
          resultItem["sort"] = 1;
        } else {
          resultItem["status"] = "Unborrowed";
          resultItem["sort"] = 2;
        }
        if (parseInt(resultItem._expiry) < currentTime) {
          resultItem["status"] = "Dated";
          resultItem["sort"] = 0;
        }
        resultItem["remain"] = askRes;
        if (resultItem.remain != 0) {
          result.push(resultItem);
        }
      }
      this.isLoading = false;
      this.insuranceList = result;
      this.showList = result.slice(this.page * this.limit, this.limit);
    },
    //获取已出售
    getBeSold(id) {
      let list = this.myAboutInfoBuy;
      if (!list) {
        return;
      }
      let array = list.filter((item) => item.askID === id);
      let num = 0;
      let number = 0;
      let arrayList = JSON.parse(JSON.stringify(array));
      if (arrayList.length) {
        arrayList.forEach((item) => {
          if (!isNaN(item.vol)) {
            number = Number(item.vol);
            num = num + number;
          }
        });
        return num;
      } else {
        return 0;
      }
    },
    getNewPrice(id) {
      let list = this.rePriceMap;
      if (!list) {
        return;
      }
      let array = list.filter((item) => item.askID === id)[0];
      return array;
    },
    // 撤销
    handleClickCancel(data) {
      this.$bus.$emit("OPEN_REPRICE", data);
      // onCancel(data.id, (status) => { });
      // RePrice(data)
    },
    // 分页
    upPage() {
      if (this.page <= 0) {
        return;
      }
      let page = this.page;
      this.page = page - 1;
      let list = this.insuranceList.slice(
        this.page * this.limit,
        page * this.limit
      );
      this.showList = list;
    },
    downPage() {
      if (Math.ceil(this.insuranceList.length / this.limit) <= this.page + 1) {
        return;
      }
      let page = this.page + 1;
      this.page = page;
      let list = this.insuranceList.slice(
        this.page * this.limit,
        (page + 1) * this.limit
      );
      this.showList = list;
    },
    toMining() {
      this.$router.push("/mining");
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
.cancel {
  display: inline-block;
  padding: 3px 10px;
  background: #ff9600;
  line-height: 20px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background: #ffa000;
  }
}
.call_style {
  background: rgba(0, 185, 0, 0.04);
  &:hover {
    td {
      &:first-child:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0px;
        border-left: 2px solid#00b900;
      }
    }
  }
}
.put_style {
  background: rgba(255, 100, 0, 0.04);
  &:hover {
    td {
      &:first-child:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0px;
        border-left: 2px solid#ff9600;
      }
    }
  }
}
@media screen and (min-width: 750px) {
  .o_button {
    margin-right: 12px;
  }
  .my_insurance {
    position: relative;
    > div {
      display: none;
      .loading {
        display: none;
      }
    }
    table {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
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
        width: 100px;
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
          td:nth-of-type(5) {
            width: 150px;
          }
          td:nth-of-type(6) {
            width: 150px;
          }
        }
      }
      tbody {
        width: 100%;
        tr {
          width: 100%;
          border-bottom: 1px solid #ededf0;
          box-sizing: border-box;
          position: relative;
          td {
            white-space: nowrap;
            width: 100px;
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            font-weight: bold;
            color: #121212;
          }
          td:nth-of-type(5) {
            width: 150px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          td:nth-of-type(6) {
            width: 150px;
          }
          td:last-child {
            transform: translateX(20px);
          }
          .option {
            display: flex;
            align-items: center;
            transform: translateX(20px);
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .my_insurance {
    table {
      display: none;
      .loading {
        display: none;
      }
    }
    > div {
      .item_box {
        margin-top: 20px;
        width: 100%;
        height: 256px;
        padding: 20px 10px;

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
        > section {
          display: flex;
          justify-content: space-between;
          button {
            width: 46%;
          }
        }
      }
    }
  }
}
</style>