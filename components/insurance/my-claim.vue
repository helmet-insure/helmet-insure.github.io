<template>
  <div class="my_guarantee">
    <table>
      <thead>
        <tr>
          <td>{{ $t("Table.Type") }}</td>
          <td>计价资产</td>
          <td>基础资产</td>
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
          <td>
            {{
              item._underlying == "WBNB" ? item._collateral : item._underlying
            }}
            <i
              :class="item._underlying == 'WBNB' ? 'call_icon' : 'put_icon'"
            ></i>
          </td>
          <td>{{ item.dueDate }}</td>
          <td>
            <button class="b_b_button" @click="toActive(item)">
              {{ $t("Table.outSure") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <section class="noData" v-if="!showList.length">
      <div>
        <img src="~/assets/img/helmet/nodata.png" alt="" />
        <p>暂无保险</p>
      </div>
    </section>
    <section class="pages" v-if="showList.length">
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
    <div>
      <p>
        <span>{{ $t("Table.ID") }}</span
        ><span>0123</span>
      </p>
      <div>
        <p>
          <span>{{ $t("Table.Type") }}</span
          ><span>0123</span>
        </p>
        <p>
          <span>{{ $t("Table.InsurancePrice") }}</span
          ><span>0123</span>
        </p>
      </div>
      <div>
        <p>
          <span>{{ $t("Table.Rent") }}</span
          ><span>0123</span>
        </p>
        <p>
          <span>{{ $t("Table.Position") }}</span
          ><span>0123</span>
        </p>
      </div>
      <section>
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          200.0100 BNB
        </span>
        <button class="b_b_button">{{ $t("Table.outSure") }}</button>
      </section>
    </div>
    <div>
      <p><span>ID</span><span>0123</span></p>
      <div>
        <p><span>品种</span><span>0123</span></p>
        <p><span>保单价格</span><span>0123</span></p>
      </div>
      <div>
        <p><span>保费 (HELMET)</span><span>0123</span></p>
        <p><span>持有量（SHort Token)</span><span>0123</span></p>
      </div>
      <section>
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          200.0100 BNB
        </span>
        <button class="b_b_button">出险</button>
      </section>
    </div>
  </div>
</template>

<script>
import '~/assets/svg/iconfont.js';
import precision from '~/assets/js/precision.js';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import { getBalance } from '~/interface/order.js';
import { newGetSymbol, getWei, getTokenName } from '~/assets/utils/address-pool.js';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import { settleable, burn, settle } from '~/interface/factory.js';
export default {
  data() {
    return {
      precision,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
      showList: [],
      guaranteeList: [],
      getTokenName,
      page: 0,
      limit: 5,
    }
  },
  computed: {
    myAboutInfoSell() {
      return this.$store.state.myAboutInfoSell;
    },
  },
  watch: {
    myAboutInfoSell: {
      handler: 'myAboutInfoSellWatch',
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
        _collateral = getTokenName(item.longInfo._collateral, window.chainID);
        longBalance = await getBalance(item.longInfo.long, _collateral);
        _underlying = getTokenName(item.longInfo._underlying, window.chainID);
        shortBalance = await getBalance(item.longInfo.short, _collateral);
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
          }
        }
      }
      this.claimList = result
      this.showList = result.slice(this.page * this.limit, this.limit)
      console.log(this.showList)
    },
    // 倒计时
    getDownTime(time) {
      let now = new Date() * 1
      let dueDate = time * 1000
      dueDate = new Date(dueDate)
      let DonwTime = dueDate - now
      let day = Math.floor(DonwTime / (24 * 3600000))
      let hour = Math.floor((DonwTime - (day * 24 * 3600000)) / 3600000)
      let minute = Math.floor(((DonwTime - (day * 24 * 3600000)) - (hour * 3600000)) / 60000)
      let second = Math.floor((((DonwTime - (day * 24 * 3600000)) - (hour * 3600000)) - (minute * 60000)) / 1000)
      let template = `${day}天${hour}时${minute}分${second}秒`
      return template
    },
    // 行权
    toActive(item) {
      let data = {
        token: getTokenName(item._underlying),
        _underlying_vol: item.volume * item._strikePrice,
        vol: toRounding(item.volume, 2),
        bidID: item.bidID,
        long: item.long,
        exPrice: autoRounding(precision.divide(1, item._strikePrice)),
        _underlying: item._underlying,
        settleToken: item.settleToken,
      }
      onExercise(data)
    },
    // 分页
    upPage() {
      if (this.page <= 0) {
        return
      }
      let page = this.page
      this.page = page - 1
      let list = this.claimList.slice((this.page * this.limit), (page * this.limit))
      this.showList = list
    },
    downPage() {
      if (Math.ceil(this.claimList.length / this.limit) <= (this.page + 1)) {
        return
      }
      let page = this.page + 1
      this.page = page
      let list = this.claimList.slice((this.page * this.limit), ((page + 1) * this.limit))
      this.showList = list;
    },
  }
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
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

  .my_guarantee {
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
            transform: translateX(20px);
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .my_guarantee {
    table {
      display: none;
    }
    > div {
      margin-top: 20px;
      width: 100%;
      height: 208px;
      padding: 20px 10px;
      background: #f7f7fa;

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
        span {
          display: flex;
          align-items: center;
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