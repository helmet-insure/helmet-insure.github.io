<template>
  <div class="insurance_form">
    <div>
      <div class="dpr">
        <input type="text" value="3" readonly />
        <span class="left">DPR</span>
        <span class="right">%</span>
      </div>
      <div class="num">
        <input type="text" />
        <span class="right">全部</span>
      </div>
      <button class="b_b_button">立即创建</button>
    </div>
    <p>预期最大收益：<span>11111 BNB</span></p>
    <span>
      如果在行权日之前，价格没有达到 <i>XXX</i> ，您将获得无风险收益。
    </span>
  </div>
</template>

<script>
export default {};
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