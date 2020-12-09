<template>
  <div class="insurance_form">
    <div>
      <div class="dpr">
        <input type="text" v-model="dpr"  />
        <span class="left">DPR</span>
        <span class="right">%</span>
      </div>
      <div class="num">
        <input type="text" />
        <span class="right">全部</span>
      </div>
      <button class="b_b_button" @click="submitSupply">立即创建</button>
    </div>
    <p>预期最大收益：<span>11111 BNB</span></p>

    <span>
      如果在行权日之前，价格没有达到 <i>XXX</i> ，您将获得无风险收益。
    </span>
  </div>
</template>

<script>
import { onIssue } from '~/interface/order.js';
export default {
  data() {
    return {
      dpr:''
    };
  },
  methods: {
    submitSupply() {
      let Options = this.$store.state.Options;
      let{ _expiry,_strikePrice,_underlying } = Options;
      // 私有化  不要
      // 标的物
      // 执行价格
      // 到期日
      // 结算token
      // 单价
      const option = {
        
      }
      if (this.indexPx && this.dueDate && this.price && this.dpr) {
        let dpr = this.dpr / 100;
        let time1 = new Date(this.dueDate).getTime();
        let time2 = new Date().getTime();
        let day = parseInt((time1 - time2) / (1000 * 60 * 60 * 24)) + 1;
        let premium = precision.minus(
          precision.times(dpr, this.price, day),
          precision.minus(this.indexPx, this.price)
        );
        return premium;
      }
      return '--';
      const data = {
        private: this.private,
        annual: this.dpr,
        category: this.col,
        currency: this.und,
        expire: this.dueDate,
        premium: this.rent,
        price: this.price,
        volume: this.qty,
        address: this.address,
        _yield: 0,
      };
      onIssue(data, (status) => {
        // console.log('onIssue####status#####', status);
        // if (status === 'pending') {
        //   console.log('onIssue####pending');
        // } else if (status === 'approve') {
        //   console.log('onIssue####approve');
        // } else if (status === 'success' || status === 'failed') {
        //   console.log('onIssue####success or failed###', status);
        // }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
input:focus {
  border-color: #ff9600 !important;
}
@media screen and (min-width: 750px) {
  .insurance_form {
    > div {
      display: flex;
      .dpr {
        width: 320px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 30px 0 55px;
          color: #919aa6;
          text-align: right;
        }
        .left {
          position: absolute;
          left: 12px;
        }
        .right {
          position: absolute;
          right: 12px;
        }
      }
      .num {
        width: 320px;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin: 0 20px 0 10px;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 60px 0 12px;
          color: #919aa6;
        }
        .right {
          color: #ff9600;
          cursor: pointer;
          position: absolute;
          right: 12px;
          &:hover {
            color: #ffa000;
          }
        }
      }
    }
    > p {
      margin: 8px 0 4px 0;
      font-size: 14px;
      color: #919aa6;
      span {
        color: #121212;
      }
    }
    > span {
      font-size: 14px;
      color: #ff9600;
      font-weight: 500;
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance_form {
    > div {
      display: flex;
      flex-direction: column;
      .dpr {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 30px 0 55px;
          color: #919aa6;
          text-align: right;
          &:focus {
            border: 1px solid #cfcfd2 !important;
          }
        }
        .left {
          position: absolute;
          left: 12px;
        }
        .right {
          position: absolute;
          right: 12px;
        }
      }
      .num {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
        font-size: 14px;
        margin: 15px 0;
        input {
          width: 100%;
          height: 40px;
          border: 1px solid #cfcfd2;
          padding: 0 60px 0 12px;
          color: #919aa6;
        }
        .right {
          color: #ff9600;
          cursor: pointer;
          position: absolute;
          right: 12px;
          &:hover {
            color: #ffa000;
          }
        }
      }
    }
    > p {
      margin: 8px 0 4px 0;
      font-size: 14px;
      color: #919aa6;
      span {
        color: #121212;
      }
    }
    > span {
      font-size: 14px;
      color: #ff9600;
      font-weight: 500;
    }
  }
}
</style>