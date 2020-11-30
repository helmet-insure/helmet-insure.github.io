<template>
  <div class="header-container">
    <a class="logo" href="https://www.payaso.io/" target="_blank">
      <img src="~/assets/img/logo_1.png" />
    </a>
    <div class="nav-list">
      <nuxt-link
        to="/product"
        :class="routeObj.name === 'product-id' ? 'active' : ''"
        >{{ $t('Header.Market') }}</nuxt-link
      >
      <nuxt-link to="/buy">{{ $t('Header.MySafetyHelmet') }}</nuxt-link>
      <nuxt-link to="/sell">{{ $t('Header.MySupply') }}</nuxt-link>
      <nuxt-link to="/mining">{{ $t('Header.LPMining') }}</nuxt-link>
      <a href="http://www.payaso.io/guides" target="_blank">{{
        $t('Header.GuideBook')
      }}</a>
    </div>
    <Assets v-if="userInfo.data.isLogin"></Assets>
    <!-- 分割线 -->
    <i class="cut-line" v-if="userInfo.data.isLogin"></i>
    <a
      v-if="!userInfo.data.isLogin"
      class="connect-wallet-btn"
      @click="openWallectSelect"
      >{{ $t('Assets.ConnectWallet') }}</a
    >
    <div v-else class="wallet-address" @click="openCurrentAccount">
      <span>{{ accountText }}</span>
      <i></i>
    </div>
    <WallectSelect
      v-if="showWallectSelect"
      @close="closeWallectSelect"
    ></WallectSelect>
    <Langauage></Langauage>
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
</template>
<script>
import WallectSelect from './wallet-select';
import CurrentAccount from '~/components/account/current-account.vue';
import ChangeAccount from '~/components/account/change-account.vue';
import Assets from '~/components/common/assets.vue';
import Langauage from '~/components/common/langauage.vue';
export default {
  name: 'p-header',
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
      accountText: '',
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
      handler: 'userInfoWatch',
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
        this.accountText = account.substr(0, 6) + '...' + account.substr(-5);
      }
    },
    openWallectSelect() {
      this.showWallectSelect = true;
    },
    closeWallectSelect() {
      this.showWallectSelect = false;
    },
    handleShowMask() {
      this.$store.dispatch('setMaskDialog', true);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
.header-container {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background: $main-color;
  text-align: center;
}
@media screen and (min-width: 750px) {
  .header-container {
    min-width: 1280px;
    padding: 0px 30px;
    .logo {
      img {
        height: 60px;
      }
    }
    .nav-list {
      flex: 1;
      display: flex;
      // justify-content: space-around;
      a {
        display: inline-block;
        // margin-left: 40px;
        height: 60px;
        line-height: 60px;
        position: relative;
        font-size: 14px;
        color: $text-m;
        &::after {
          display: none;
          content: '';
          position: absolute;
          left: 0px;
          bottom: 0px;
          width: 100%;
          height: 2px;
          background: #cb7e7e;
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
      padding: 0px 16px;
      height: 40px;
      display: flex;
      align-items: center;
      border-radius: 3px;
      border: 1px solid $bg-w;
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
      height: 40px;
      line-height: 40px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 0px 12px;
    }
  }
  .cut-line {
    width: 1px;
    height: 19px;
    background: #cb7e7e;
    margin: 0 20px 0 16px;
  }
}
@media screen and (min-width: 1600px) {
  .header-container {
    padding: 0px 60px;
    justify-content: space-around;
    .nav-list {
      a {
        margin-left: 50px;
        font-size: 16px;
      }
    }
  }
}
@media screen and (min-width: 750px) and (max-width: 1600px) {
  .header-container {
    padding: 0px 30px;
    .nav-list {
      justify-content: space-around;
      a {
        // margin-left: 50px;
        font-size: 16px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .header-container {
    padding: 0px 16px;
    justify-content: space-between;
    .logo {
      img {
        height: 50px;
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
      width: 20px;
      height: 20px;
      background-image: url('../../assets/img/more@2x.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>