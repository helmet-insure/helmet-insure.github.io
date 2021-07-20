<template>
  <div class="wallet-download-mask" @touchmove.prevent v-if="show">
    <div class="wallet-download">
      <div class="wallet-download-title">
        <span>Select a wallet</span>
        <i @click="closeDialog"></i>
      </div>
      <div class="wallet-download-icon">
        <img :src="require(`~/assets/img/wallet-icon/${'MetaMask'}@2x.png`)" />
        <span>{{ "MetaMask" }}</span>
      </div>
      <p class="wallet-download-text">
        You'll need to install <span>{{ "MetaMask" }}</span> tocontinue.once you
        have it installed,go ahead and
        <a @click="refreshPage">refresh the page</a>
      </p>
      <div class="wallet-download-button">
        <a href="https://metamask.io/" target="_blank" class="install"
          >Install MetaMask</a
        >
        <a class="back" @click="closeDialog">Back</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WallectDownLoad",
  data() {
    return {
      show: false,
    };
  },
  computed: {
    walletType() {
      return this.$store.state.walletType;
    },
  },
  mounted() {
    this.$bus.$on(
      "OPEN_DOWNLOAD",
      function (data) {
        this.show = true;
      }.bind(this)
    );
    this.$bus.$on(
      "CLOSE_DOWNLOAD",
      function (data) {
        this.show = false;
      }.bind(this)
    );
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
    closeDialog() {
      this.$bus.$emit("CLOSE_DOWNLOAD");
    },
  },
};
</script>

<style lang='scss' soped>
@import "~/assets/css/base.scss";
.wallet-download-mask {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba($color: #000000, $alpha: 0.7);
  left: 0;
  top: 0;
  z-index: 999;
  overflow: hidden;
}
.wallet-download {
  position: fixed;
  background-color: $bg-w;
  text-align: left;
  color: $bg-d;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .wallet-download-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .wallet-download-icon {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .wallet-download-text {
    margin-top: 20px;
  }
  .wallet-download-button {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
}
@media screen and (min-width: 750px) {
  .wallet-download {
    width: 500px;
    height: 252px;
    padding: 16px 30px;
  }
  .wallet-download-title {
    span {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }
    i {
      display: block;
      width: 20px;
      height: 20px;
      background-image: url("../../assets/img/icon/guanbi.png");
      background-repeat: no-repeat;
      background-size: 100%;
      cursor: pointer;
    }
  }
  .wallet-download-icon {
    img {
      width: 30px;
    }
    span {
      font-size: 20px;
      font-weight: 500;
      color: $text-d;
      margin-left: 8px;
    }
  }
  .wallet-download-text {
    line-height: 28px;

    span {
      font-weight: 600;
    }
    a {
      color: #ff9600;
    }
  }
  .wallet-download-button {
    .install {
      width: 142px;
      height: 32px;
      background: #ff9600;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      line-height: 32px;
      text-align: center;
    }
    .back {
      width: 58px;
      height: 32px;
      border: 1px solid #ff9600;
      font-size: 14px;
      font-weight: 500;
      color: #ff9600;
      line-height: 32px;
      text-align: center;
    }
  }
}
@media screen and (max-width: 750px) {
  .wallet-download {
    min-width: 320px;
    width: 90%;
    background: #ffffff;
    border-radius: 10px;
    padding: 16px 20px;
  }
  .wallet-download-title {
    span {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
    }
    i {
      display: block;
      width: 20px;
      height: 20px;
      background-image: url("../../assets/img/icon/guanbi.png");
      background-repeat: no-repeat;
      background-size: 100%;
      cursor: pointer;
    }
  }
  .wallet-download-icon {
    img {
      width: 30px;
    }
    span {
      font-size: 20px;
      font-weight: 500;
      color: $text-d;
      margin-left: 8px;
    }
  }
  .wallet-download-text {
    line-height: 20px;

    span {
      font-weight: 600;
    }
    a {
      color: #ff9600;
    }
  }
  .wallet-download-button {
    margin-bottom: 10px;
    .install {
      width: 142px;
      height: 32px;
      background: #ff9600;
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
      line-height: 32px;
      text-align: center;
    }
    .back {
      width: 58px;
      height: 32px;
      border: 1px solid #ff9600;
      font-size: 14px;
      font-weight: 500;
      color: #ff9600;
      line-height: 32px;
      text-align: center;
    }
  }
}
</style>  