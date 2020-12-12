<template>
  <div class="my_insurance">
    <table>
      <thead>
        <tr>
          <td>{{ $t("Table.ID") }}</td>
          <td>{{ $t("Table.Type") }}</td>
          <td>{{ $t("Table.InsurancePrice") }}</td>
          <td>已出售</td>
          <td>未出售</td>
          <td>{{ $t("Table.CanCollateral") }}</td>
          <td>{{ $t("Table.DueTime") }}</td>
          <td class="option"></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sellList" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item._underlying }}</td>
          <td>{{ item.price }}</td>
          <td>{{ item.beSold }}</td>
          <td>
            {{ item.unSold }}
            <span
              class="cancel"
              @click="handleClickCancel(item)"
              v-if="item.unSold != 0"
              >撤销</span
            >
          </td>
          <td>53737</td>
          <td>{{ item.dueDate }}</td>
          <td class="option">
            <!-- <button class="o_button">{{ $t("Table.outSure") }}</button> -->
            <button class="b_button">{{ $t("Table.Stake") }}</button>
          </td>
        </tr>
      </tbody>
    </table>
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
        <p><span>剩余/总量</span><span>0123</span></p>
        <p>
          <span>{{ $t("Table.CanCollateral") }}</span
          ><span>0123</span>
        </p>
      </div>
      <div>
        <p>
          <span>{{ $t("Table.DueTime") }}</span
          ><span>2020/12/29 14:20:90</span>
        </p>
      </div>
      <section>
        <button class="o_button">撤销</button>
        <button class="b_button">质押挖矿</button>
      </section>
    </div>
  </div>
</template>

<script>
import precision from '~/assets/js/precision.js';
import { fixD, addCommom, autoRounding, toRounding } from '~/assets/js/util.js';
import { toWei, fromWei } from '~/assets/utils/web3-fun.js';
import { getTokenName } from '~/assets/utils/address-pool.js';
import { onCancel } from '~/interface/order.js'
export default {
  data() {
    return {
      precision,
      addCommom: addCommom,
      autoRounding: autoRounding,
      toRounding: toRounding,
      sellList: [],
      getTokenName
    }
  },
  computed: {
    myAboutInfoSell() {
      return this.$store.state.myAboutInfoSell;
    },
    myAboutInfoBuy() {
      return this.$store.state.myAboutInfoBuy;
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
    setSettlementList(list) {
      let result = []
      let item, resultItem, amount, InsurancePrice, _underlying, downTime, beSold, unSold;
      for (let i = 0; i < list.length; i++) {
        item = list[i]
        // 数量
        amount = precision.divide(item.volume, item.price)
        // 保单价格
        InsurancePrice = fromWei(item.volume, item.settleToken)
        // 标的物
        _underlying = getTokenName(item.longInfo._underlying)
        //倒计时
        downTime = new Date(item.longInfo._expiry * 1000).toLocaleDateString();
        //已出售
        beSold = this.getBeSold(item.askID)
        unSold = precision.minus(amount, beSold)
        resultItem = {
          id: item.askID,
          volume: amount,
          beSold: beSold,
          unSold: unSold,
          price: InsurancePrice,
          dueDate: downTime,
          _underlying: _underlying,
        }
        result.push(resultItem)
      }
      this.sellList = result
    },
    //获取已出售
    getBeSold(id) {
      let list = this.myAboutInfoBuy
      let array = list.filter(item => item.askID == id)[0]
      if (array) {
        let num = precision.divide(array.sellInfo.volume, array.sellInfo.price)
        return num
      } else {
        return 0
      }
    },
    // 撤销
    handleClickCancel(data) {
      onCancel(data.id, (status) => { });
    }
  }
};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
.cancel {
  display: inline-block;
  padding: 3px 10px;
  background: #ff9600;
  line-height: 20px;
  margin-left: 10px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background: #ffa000;
  }
}
@media screen and (min-width: 750px) {
  .o_button {
    margin-right: 12px;
  }
  .my_insurance {
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
          td:nth-of-type(6) {
            width: 150px;
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
    }
    > div {
      margin-top: 20px;
      width: 100%;
      height: 256px;
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
        button {
          width: 46%;
        }
      }
    }
  }
}
</style>