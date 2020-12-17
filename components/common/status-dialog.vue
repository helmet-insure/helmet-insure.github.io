<template>
  <div class="status-dialog">
    <div class="mask" @click="closeDialog"></div>
    <div class="status-dialog-content">
      <h3 class="title">{{ data.title }}</h3>
      <span class="close" @click="closeDialog"></span>
      <div class="img-box">
        <!-- <img
          class="pending"
          v-if="data.type === 'pending'"
          src="~/assets/img/waitting.png"
        /> -->
        <!-- <img v-if="data.type === 'submit'" src="~/assets/img/submit.png" /> -->
        <!-- <img v-if="data.type === 'success'" src="~/assets/img/success.png" /> -->
      </div>
      <!-- 请在钱包中确认进行交易 -->
      <h3 class="con-tit" v-html="data.conTit"></h3>
      <div class="con-text" v-html="data.conText"></div>
      <div class="btn-box">
        <slot name="footer">
          <button
            @click="closeDialog"
            :style="data.btnText == 'Approve' ? 'visibility: hidden' : ''"
          >
            {{ data.btnText }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'status-dialog',
  props: {
    // type: {
    //     type: String,
    //     default: 'pending', // warning info success error submit pending
    // },
    // title: {
    //     type: String,
    //     default: 'Waiting For Confirmation'
    // },
    // conTit: {
    //     type: String,
    //     default: 'Please confirm the transaction in the wallet'
    // },
    // conText: {
    //     type: String,
    //     default: ''
    // },
    // btnText: {
    //     type: String,
    //     default: 'I know'
    // }
    data: {
      type: Object,
      default: () => {
        return {
          type: '',
          title: '',
          conTit: '',
          conText: '',
          btnText: '',
        };
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
@import "~/assets/css/base.scss";
@media screen and(min-width:750px) {
  .status-dialog {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    /* background-color: rgba(0, 0, 0, 0.8); */
    .mask {
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 101;
    }

    .status-dialog-content {
      background: #ffffff;
      padding: 16px 30px;
      position: relative;
      text-align: center;
      z-index: 102;
      width: 500px;
      > .title {
        font-size: 20px;
        color: $bg-d;
        text-align: left;
        padding-bottom: 16px;
      }
      .close {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center center;
        background-image: url("../../assets/img/icon/guanbi.png");
        background-size: 100% 100%;
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .img-box {
        padding-top: 10px;
        img {
          width: 40px;
          height: 40px;
          &.pending {
            -webkit-animation: animal 2s infinite linear;
            -webkit-transform-origin: center center;
            -ms-transform-origin: center center;
            transform-origin: center center;
          }
        }
      }
      .con-tit {
        color: $bg-d;
        font-size: 16px;
        font-weight: 500;
        margin-top: 16px;
        span {
          color: $main-color;
        }
        a {
          color: $main-color;
          text-decoration: underline;
        }
      }
      .con-text {
        font-size: 14px;
        color: $bg-d;
        margin-top: 12px;
        span {
          color: $main-color;
        }
        a {
          color: $main-color;
          text-decoration: underline;
        }
      }
      .btn-box {
        text-align: right;
        padding-top: 35px;
        button {
          min-width: 96px;
          height: 32px;
          padding: 0px 12px;
          background: #ff9600;
          color: $text-m;
          font-size: 14px;
          &:hover {
            background: #ffa000;
          }
        }
      }
    }
  }

  @keyframes animal {
    0% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
}
@media screen and(max-width:750px) {
  .status-dialog {
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    /* background-color: rgba(0, 0, 0, 0.8); */
    .mask {
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 101;
    }

    .status-dialog-content {
      background: #ffffff;
      padding: 16px 30px;
      position: relative;
      text-align: center;
      z-index: 102;
      width: 90%;
      > .title {
        font-size: 20px;
        color: $bg-d;
        text-align: left;
        padding-bottom: 16px;
      }
      .close {
        display: inline-block;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-position: center center;
        background-image: url("../../assets/img/icon/guanbi.png");
        background-size: 100% 100%;
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .img-box {
        padding-top: 10px;
        img {
          width: 40px;
          height: 40px;
          &.pending {
            -webkit-animation: animal 2s infinite linear;
            -webkit-transform-origin: center center;
            -ms-transform-origin: center center;
            transform-origin: center center;
          }
        }
      }
      .con-tit {
        color: $bg-d;
        font-size: 16px;
        font-weight: 500;
        margin-top: 16px;
        span {
          color: $main-color;
        }
        a {
          color: $main-color;
          text-decoration: underline;
        }
      }
      .con-text {
        font-size: 14px;
        color: $bg-d;
        margin-top: 12px;
        span {
          color: $main-color;
        }
        a {
          color: $main-color;
          text-decoration: underline;
        }
      }
      .btn-box {
        text-align: right;
        padding-top: 35px;
        button {
          min-width: 96px;
          height: 32px;
          padding: 0px 12px;
          background: #ff9600;
          color: $text-m;
          font-size: 14px;
          &:hover {
            background: #ffa000;
          }
        }
      }
    }
  }

  @keyframes animal {
    0% {
      transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
    }
  }
}
</style>