<template>
  <div class="action">
    <h3>LP on boarding plan</h3>
    <p>{{ $t("Content.LastOne") }}</p>
    <div class="input">
      <p>1 HELMET ≈ {{ allIndexPrice[1]["HELMET"] }} BNB</p>
      <div>
        <label>
          <input type="text" v-model="num" />
          <span>BNB</span>
        </label>
        <button @click="num = bnbBalance">MAX</button>
      </div>

      <p>我的余额: {{ bnbBalance }} BNB</p>
    </div>
    <div class="confim">
      <button class="o_button" @click="toPlanStake">质押</button>
      <!-- <div>
        <p>{{ $t("Content.curPlan") }}：<span>500% - 1000%</span></p>
        <span>{{ $t("Content.PlanToLp") }}</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { recruit } from "~/interface/price.js";
import { toWei, fromWei } from "~/assets/utils/web3-fun.js";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
export default {
  data() {
    return {
      num: "",
      bnbBalance: 0,
    };
  },
  computed: {
    allIndexPrice() {
      let obj = this.$store.state.allIndexPrice;
      return obj;
    },
  },
  mounted() {
    this.$bus.$on("GET_BALANCE", () => {
      this.getBalance();
    });
    setTimeout(() => {
      this.getBalance();
    }, 1000);
  },
  methods: {
    // 获取余额
    async getBalance() {
      if (window.CURRENTADDRESS) {
        window.WEB3.eth.getBalance(window.CURRENTADDRESS).then((res) => {
          this.bnbBalance = toRounding(fromWei(res), 4);
        });
      }
    },
    toPlanStake() {
      let num = this.num;
      recruit("PLAN", num);
    },
  },
};
</script>

<style lang='scss' scoped>
.o_button {
  width: 100%;
  height: 40px;
}
@media screen and (min-width: 750px) {
  .action {
    width: 410px;
    padding-top: 117px;
    h3 {
      font-size: 40px;
      font-weight: 500;
      color: #121212;
      line-height: 49px;
    }
    > p {
      margin-top: 20px;
      height: 36px;
      font-size: 24px;
      color: #121212;
      line-height: 36px;
    }
    .input {
      margin-top: 40px;
      margin-bottom: 30px;
      p {
        height: 14px;
        font-size: 14px;
        color: #919aa6;
        line-height: 14px;
      }
      div {
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 10px;
        label {
          width: 320px;
          position: relative;
          display: flex;
          align-items: center;
          input {
            width: 320px;
            height: 40px;
            border: 1px solid #cfcfd2;
            padding: 0 60px 0 12px;
            &:focus {
              border: 1px solid #ff9600;
            }
          }
          span {
            position: absolute;
            font-size: 16px;
            color: #121212;
            line-height: 18px;
            right: 10px;
          }
        }
        button {
          height: 40px;
          padding: 0 23px;
          border: 1px solid #cfcfd2;
          background: transparent;
          font-size: 16px;
          color: #ff9600;
          line-height: 18px;
          margin-left: 10px;
          &:focus {
            border: 1px solid #ff9600;
          }
        }
      }
    }
    .confim {
      div {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        p {
          font-size: 12px;
          color: #919aa6;
          line-height: 20px;
          span {
            color: #00b900;
          }
        }
        span {
          font-size: 12px;
          color: #ff9600;
          line-height: 20px;
        }
      }
    }
  }
}
</style>