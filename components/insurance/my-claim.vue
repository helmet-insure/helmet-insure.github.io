<template>
  <div class="my_claim">
    <table>
      <thead>
        <tr>
          <td>{{ $t("Table.Type") }}</td>
          <td>{{ $t("Table.DenAssets") }}</td>
          <td>{{ $t("Table.BaseAssets") }}</td>
          <td></td>
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
          <template>
            <td :class="item._underlying == 'WBNB' ? 'green' : 'orange'">
              {{
                item._underlying == "WBNB" ? item._collateral : item._underlying
              }}
              <i
                :class="item._underlying == 'WBNB' ? 'call_icon' : 'put_icon'"
              ></i>
            </td>
            <td>
              <!-- {{ addCommom(precision.plus(item.col, item.longBalance), 4) }} -->
              {{ toRounding(item.longBalance, 4) }}
              {{ item._collateral }}
            </td>
            <td>{{ fixD(addCommom(item.und), 8) }} {{ item._underlying }}</td>
            <td class="option">
              <button class="b_b_button" @click="toClaim(item)">
                {{ $t("Table.GetBack") }}
              </button>
            </td>
          </template>
        </tr>
      </tbody>
      <div class="loading" v-if="isLoading">
        <img src="~/assets/img/loading.gif" />
      </div>
    </table>

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
        <div>
          <p>
            <span>{{ $t("Table.Type") }}</span
            ><span :class="item._underlying == 'WBNB' ? 'green' : 'orange'">
              {{
                item._underlying == "WBNB" ? item._collateral : item._underlying
              }}
              <i
                :class="item._underlying == 'WBNB' ? 'call_icon' : 'put_icon'"
              ></i
            ></span>
          </p>
        </div>
        <div>
          <p>
            <span>{{ $t("Table.DenAssets") }}</span
            ><span>
              {{ toRounding(item.longBalance, 4) }} {{ item._collateral }}</span
            >
          </p>
          <p>
            <span>{{ $t("Table.BaseAssets") }}</span
            ><span
              >{{ fixD(addCommom(item.und), 8) }} {{ item._underlying }}</span
            >
          </p>
        </div>
        <section>
          <!-- <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-time"></use>
            </svg>
            200.0100 BNB
          </span> -->
          <button class="b_b_button" @click="toClaim(item)">
            {{ $t("Table.outSure") }}
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
    <section class="pages" v-if="claimList.length > 5">
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
import "~/assets/svg/iconfont.js";
import precision from "~/assets/js/precision.js";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
import { getBalance } from "~/interface/order.js";
import {
  newGetSymbol,
  getWei,
  getTokenName,
} from "~/assets/utils/address-pool.js";
import { toWei, fromWei } from "~/assets/utils/web3-fun.js";
import { settleable, burn, settle } from "~/interface/factory.js";
export default {
  data() {
    return {
      precision,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
      showList: [],
      claimList: [],
      getTokenName,
      fixD,
      page: 0,
      limit: 8,
      isLoading: true,
    };
  },
  computed: {
    myAboutInfoSell() {
      return this.$store.state.myAboutInfoSell;
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
      const result = [];
      let mapArray = [];
      let obj = {};
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
        _collateral = getTokenName(item.longInfo._collateral, window.chainID);
        longBalance = await getBalance(item.longInfo.long, _collateral);
        _underlying = getTokenName(item.longInfo._underlying, window.chainID);
        shortBalance = await getBalance(item.longInfo.short, _collateral);
        let Token = _underlying == "WBNB" ? _underlying : _collateral;
        let resultItem = {};
        if (Number(shortBalance) > 0) {
          resultItem["askID"] = item.askID;
          resultItem["creator"] = item.seller;
          resultItem["_collateral"] = _collateral;
          resultItem["_underlying"] = _underlying;
          resultItem["long"] = item.longInfo.long;
          resultItem["short"] = item.longInfo.short;
          resultItem["longBalance"] = longBalance;
          resultItem["Balance"] = Math.min(
            Number(shortBalance),
            Number(longBalance)
          );
          resultItem["shortBalance"] = shortBalance;
          number = precision.minus(shortBalance, longBalance);
          try {
            volume = toWei(number, _collateral);
            const settle = await settleable(item.longInfo.short, volume);
            if (settle.col != "0" || settle.und != "0") {
              if (_underlying == "CTK") {
                und = fromWei(settle.und, "CTK");
              } else {
                und = fromWei(settle.und, Token);
              }
              resultItem["und"] = und;
              resultItem["col"] = fromWei(settle.col, Token);
              resultItem["fee"] = fromWei(settle.fee, Token);
            } else {
              resultItem["und"] = 0;
              resultItem["col"] = 0;
              resultItem["fee"] = 0;
            }
          } catch (err) {
            // console.log(err)
          }
          if (
            Number(resultItem.longBalance) == 0 &&
            Number(resultItem.und) == 0
          ) {
            resultItem["hidden"] = false;
          } else {
            resultItem["hidden"] = true;
          }
          // 判断有没有这个品种的单子
          let Flag = mapArray.some((item) => {
            return (
              item._underlying == resultItem._underlying &&
              item._collateral == resultItem._collateral
            );
          });
          // 没有这个品种则添加
          if (!Flag && resultItem["hidden"]) {
            result.push(resultItem);
          }
          // 判断
          mapArray = result.map((item) => {
            return {
              _underlying: item._underlying,
              _collateral: item._collateral,
            };
          });
        }
      }
      this.isLoading = false;
      this.claimList = result;
      this.showList = result.slice(this.page * this.limit, this.limit);
    },
    // 倒计时
    getDownTime(time) {
      let now = new Date() * 1;
      let dueDate = time * 1000;
      dueDate = new Date(dueDate);
      let DonwTime = dueDate - now;
      let day = Math.floor(DonwTime / (24 * 3600000));
      let hour = Math.floor((DonwTime - day * 24 * 3600000) / 3600000);
      let minute = Math.floor(
        (DonwTime - day * 24 * 3600000 - hour * 3600000) / 60000
      );
      let second = Math.floor(
        (DonwTime - day * 24 * 3600000 - hour * 3600000 - minute * 60000) / 1000
      );
      let template = `${day}天${hour}时${minute}分${second}秒`;
      return template;
    },
    // 行权
    toClaim(item) {
      if (Number(item.longBalance) != 0) {
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
    // 分页
    upPage() {
      if (this.page <= 0) {
        return;
      }
      let page = this.page;
      this.page = page - 1;
      let list = this.claimList.slice(
        this.page * this.limit,
        page * this.limit
      );
      this.showList = list;
    },
    downPage() {
      if (Math.ceil(this.claimList.length / this.limit) <= this.page + 1) {
        return;
      }
      let page = this.page + 1;
      this.page = page;
      let list = this.claimList.slice(
        this.page * this.limit,
        (page + 1) * this.limit
      );
      this.showList = list;
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
.green {
  color: #00b900 !important;
}
.orange {
  color: #ff6400 !important;
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
  .my_claim {
    position: relative;
    > div {
      display: none;
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
        }
      }
      tbody {
        width: 100%;
        tr {
          position: relative;
          width: 100%;
          box-sizing: border-box;
          border-bottom: 1px solid #ededf0;
          td {
            white-space: nowrap;
            width: 100px;
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            font-weight: bold;
            color: #121212;
            display: flex;
            align-items: center;
            i {
              display: inline-block;
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-size: cover;
              margin-left: 4px;
            }
            .call_icon {
              background-image: url("../../assets/img/helmet/tablecall.png");
            }
            .put_icon {
              background-image: url("../../assets/img/helmet/tableput.png");
            }
          }

          td:last-child {
            transform: translateX(20px);
          }
          .option {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .my_claim {
    table {
      display: none;
    }
    > div {
      .item_box {
        margin-top: 20px;
        width: 100%;
        height: 208px;
        padding: 20px 10px;
        // background: #f7f7fa;
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
          i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background-repeat: no-repeat;
            background-size: cover;
            margin-left: 4px;
          }
          .call_icon {
            background-image: url("../../assets/img/helmet/tablecall.png");
          }
          .put_icon {
            background-image: url("../../assets/img/helmet/tableput.png");
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
          span {
            display: flex;
            align-items: center;
          }
          button {
            width: 100% !important;
          }
        }
      }
    }
  }
}
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #787878;
  overflow: hidden;
}
</style>