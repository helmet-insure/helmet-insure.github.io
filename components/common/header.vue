<template>
  <div class="header-container">
    <div>
      <a class="logo" href="/" target="_self">
        <img src="~/assets/img/helmet/trade_logo.png" />
      </a>
      <div class="nav-list">
        <nuxt-link
          to="/product"
          :class="routeObj.name === 'product-id' ? 'active' : ''"
          >{{ $t("Header.Trade") }}</nuxt-link
        >
        <nuxt-link to="/mining">{{ $t("Header.Mining") }}</nuxt-link>
        <!-- <nuxt-link to="/plan">{{ $t("Header.Plan") }}</nuxt-link> -->
        <a href="https://helmet-insure.gitbook.io/helmet/" target="_blank">{{
          $t("Header.GuideBook")
        }}</a>
      </div>
      <!-- <Assets v-if="userInfo.data.isLogin"></Assets> -->
      <!-- 分割线 -->
      <!-- <i class="cut-line" v-if="userInfo.data.isLogin"></i> -->
      <a
        v-if="!userInfo.data.isLogin"
        class="connect-wallet-btn"
        @click="openWallectSelect"
        >CONNECT WALLET</a
      >
      <div v-else class="wallet-address" @click="openCurrentAccount">
        <span>{{ accountText }}</span>
        <i></i>
      </div>

      <WallectSelect
        v-if="showWallectSelect"
        @close="closeWallectSelect"
      ></WallectSelect>
      <!-- <Langauage></Langauage> -->
      <div class="more" @click="handleShowMask"></div>

      <CurrentAccount
        v-if="showCurrentAccount"
        @close="closeCurrentAccount"
        @change="openChangeWallet"
      ></CurrentAccount>
      <ChangeAccount
        v-if="showChangeWallet"
        @close="closeChangeWallet"
        @back="openCurrentAccount"
      ></ChangeAccount>
    </div>
  </div>
</template>
<script>
import WallectSelect from "./wallet-select";
import CurrentAccount from "~/components/account/current-account.vue";
import ChangeAccount from "~/components/account/change-account.vue";
import Assets from "~/components/common/assets.vue";
import Langauage from "~/components/common/langauage.vue";
export default {
  name: "p-header",
  components: {
    WallectSelect,
    CurrentAccount,
    ChangeAccount,
    Assets,
    Langauage,
  },
  data() {
    return {
      showWallectSelect: false,
      accountText: "",
      showMask: false,
      showCurrentAccount: false, // 显示当前账户信息
      showChangeWallet: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    routeObj() {
      return this.$route;
    },
  },
  watch: {
    userInfo: {
      handler: "userInfoWatch",
      immediate: true,
    },
  },
  methods: {
    openChangeWallet() {
      this.showChangeWallet = true;
    },
    closeChangeWallet() {
      this.showChangeWallet = false;
    },
    openCurrentAccount() {
      this.showCurrentAccount = true;
    },
    closeCurrentAccount() {
      this.showCurrentAccount = false;
    },
    userInfoWatch(newValue) {
      if (newValue.data && newValue.data.account) {
        let account = newValue.data.account;
        account = account.toUpperCase();
        this.accountText =
          account.substr(0, 1) +
          " " +
          account.substr(1, 1) +
          " " +
          account.substr(2, 4) +
          "..." +
          account.substr(-5);
      }
    },
    openWallectSelect() {
      this.showWallectSelect = true;
    },
    closeWallectSelect() {
      this.showWallectSelect = false;
    },
    handleShowMask() {
      this.$store.dispatch("setMaskDialog", true);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
.header-container {
  width: 100%;
  height: 80px;
  background: #fff;
  > div {
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    text-align: center;
    .nav-list {
      flex: 1;
      display: flex;
      a {
        display: inline-block;
        margin-left: 40px;
        position: relative;
        color: #121212;
        font-weight: bold;
        &::after {
          display: none;
          content: "";
          position: absolute;
          left: 0px;
          bottom: 0px;
          width: 100%;
          height: 2px;
          background: #ff9600;
        }
        &.active,
        &.nuxt-link-exact-active {
          &::after {
            display: block;
          }
        }
      }
    }
    .wallet-address {
      padding: 0px 12px;
      display: flex;
      align-items: center;
      background: #121212;
      color: #ffffff;
      cursor: pointer;
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #14b465;
        margin-left: 8px;
      }
    }
    .connect-wallet-btn {
      display: block;
      background: #121212;
      padding: 0px 12px;
      color: #ffffff;
      &:hover {
        background: #2c2c2c;
      }
    }
  }
}
@media screen and (min-width: 1280px) {
  .header-container {
    > div {
      width: 1200px;
      .logo {
        img {
          height: 40px;
        }
      }
      .nav-list {
        flex: 1;
        display: flex;
        a {
          height: 80px;
          line-height: 80px;
          font-size: 16px;
        }
      }
      .wallet-address {
        height: 48px;
      }
      .connect-wallet-btn {
        height: 48px;
        line-height: 48px;
        font-size: 16px;
      }
    }
  }
  .cut-line {
    width: 1px;
    height: 19px;
    background: #cb7e7e;
    margin: 0 20px 0 16px;
  }
}
@media screen and (min-width: 750px) and (max-width: 1280px) {
  .header-container {
    height: 60px;
    > div {
      width: 1200px;
      .logo {
        img {
          height: 40px;
        }
      }
      .nav-list {
        flex: 1;
        display: flex;
        a {
          display: inline-block;
          margin-left: 40px;
          height: 60px;
          line-height: 60px;
          position: relative;
          color: #121212;
          font-size: 16px;
          font-weight: 500;
        }
      }
      .wallet-address {
        height: 40px;
      }
      .connect-wallet-btn {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
      }
    }
  }
}

@media screen and (max-width: 750px) {
  .header-container {
    justify-content: space-between;
    > div {
      padding: 0 16px;
      justify-content: space-between;
      width: 100%;
      .logo {
        img {
          height: 40px;
        }
      }
      .nav-list {
        display: none;
      }
      .wallet-address {
        display: none;
      }
      .connect-wallet-btn {
        display: none;
      }
      .more {
        width: 24px;
        height: 24px;
        background-image: url("../../assets/img/helmet/caidan@2x.png");
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>