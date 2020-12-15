<template>
  <div class="helmet_pool">
    <h3>{{ list.name }}</h3>
    <div class="coin">
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-Helmet"></use>
        </svg>
        50%
        <span> HELMET </span>
      </p>
      <p>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-BNB"></use>
        </svg>
        50%
        <span> BNB </span>
      </p>
    </div>
    <div class="text">
      <p v-for="(item, index) in textList" :key="index">
        <span>{{ item.text }}</span>
        <span>{{ item.data }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: {
        name: 'HELMET-BNB'
      },
      textList: [{
        text: 'Rewards Distribution',
        data: '0'
      }, {
        text: 'Pool APY',
        data: '0'
      }, {
        text: 'Total Deposited ',
        data: '0'
      }, {
        text: 'My Deposits',
        data: '0'
      }, {
        text: 'My Rewards',
        data: '0'
      }]
    }
  }
}
</script>

<style lang='scss' scoped>
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #787878;
  overflow: hidden;
}
@media screen and (min-width: 750px) {
  .helmet_pool {
    height: 536px;
    background: #ffffff;
    padding: 40px;
    > h3 {
      text-align: center;
    }
    .coin {
      margin-top: 12px;
      justify-content: center;
      display: flex;
      align-items: center;
      p {
        display: flex;
        align-items: center;
        color: #121212;
        font-size: 14px;
        margin: 0 10px;
        .icon {
          margin-right: 4px;
        }
        span {
          margin-left: 4px;
          color: #919aa6;
        }
      }
    }
    .text {
      display: flex;
      padding: 0 140px;
      justify-content: space-between;
      margin-top: 28px;
      p {
        display: flex;
        flex-direction: column;
        span {
          &:nth-of-type(1) {
            font-size: 14px;
            color: #919aa6;
          }
          &:nth-of-type(2) {
            margin-top: 12px;
          }
        }
      }
    }
  }
}
</style>