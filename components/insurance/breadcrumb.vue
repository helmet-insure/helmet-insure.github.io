<template>
  <div class="insurance-option">
    <div class="tabs" v-if="!current">
      <span class="active">{{ $t('Content.HelmetMarket') }}</span>
    </div>
    <div v-else class="route">
      <nuxt-link to="/">{{ $t('Content.HelmetMarket') }}</nuxt-link>
      <img v-if="current" class="icon" src="~/assets/img/icon/right2.png" />
      <span v-if="current" class="current"
        >{{ current }} {{ $t('Dialog.Helmet') }}</span
      >
    </div>
    <!-- <div class="search-box">
            <input type="text" placeholder="搜索智能合约"/>
            <button>确认</button>
        </div> -->
    <div class="spacing"></div>
    <a class="supply-btn have-icon-btn" @click="openSupply">
      <img src="~/assets/img/icon/chengbao@2x.png" />
      <span>{{ $t('Content.Supply') }}</span>
    </a>
    <WallectSelect
      v-if="showWallectSelect"
      @close="closeWallectSelect"
    ></WallectSelect>

    <Supply
      v-if="showSupply"
      :showDialog="showSupply"
      @close="closeSupply"
    ></Supply>
  </div>
</template>
<script>
import WallectSelect from '~/components/common/wallet-select.vue';
import Supply from './supply/index.vue';

export default {
  name: 'insurance-option',
  components: {
    WallectSelect,
    Supply,
  },
  props: ['current'],
  data() {
    return {
      showWallectSelect: false,
      showSupply: false,
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
  methods: {
    openWallectSelect() {
      this.showWallectSelect = true;
    },
    closeWallectSelect() {
      this.showWallectSelect = false;
    },

    openSupply() {
      let flag = this.userInfo.data.isLogin;
      if (!flag) {
        this.openWallectSelect();
        return;
      }
      this.showSupply = true;
    },
    closeSupply() {
      this.showSupply = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .insurance-option {
    height: 60px;
    display: flex;
    align-items: center;
    box-shadow: 0px 1px 0px 0px #1d1d1d;
    margin-top: 35px;
    .tabs {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        height: 30px;
        font-size: 16px;
        color: $text-l;
        &.active {
          border-bottom: 2px solid $text-l;
        }
      }
    }
    .route {
      display: flex;
      align-items: center;
      font-size: 14px;
      .icon {
        widows: 20px;
        height: 20px;
        margin: 0px 6px;
      }
      > a {
        color: $text-l;
        &:hover {
          color: #c34b4c;
        }
      }
      > span {
        color: $text-t;
      }
    }
    .search-box {
      display: flex;
      align-items: center;
      margin-left: 34px;
      input::-webkit-input-placeholder {
        font-size: inherit;
        color: $text-d;
      }
      input {
        font-size: 14px;
        color: $text-d;
        width: 215px;
        height: 32px;
        border-radius: 3px;
        border: 1px solid $border;
        background: none;
        background: url('../../assets/img/icon/search.png') 12px center
          no-repeat;
        background-size: auto 16px;
        padding-left: 36px;
      }
      button {
        height: 32px;
        padding: 0px 12px;
        font-size: 14px;
        color: $text-m;
        background: $main-color;
        margin-left: 16px;
        border-radius: 10px;
      }
    }
    .spacing {
      flex: 1;
    }
    .supply-btn {
      background: $warning-color;
      min-width: 108px;
      padding: 0 10px;
      height: 32px;
      color: $text-b;
      border-radius: 10px;
      &:hover {
        background: lighten($color: $warning-color, $amount: 5);
      }
      img {
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance-option {
    margin: 0 16px;
    height: 60px;
    display: flex;
    align-items: center;
    box-shadow: 0px 1px 0px 0px #1d1d1d;
    margin-top: 35px;
    .tabs {
      display: flex;
      align-items: center;
      span {
        display: inline-block;
        height: 30px;
        font-size: 16px;
        color: $text-l;
        &.active {
          border-bottom: 2px solid $text-l;
        }
      }
      .icon {
        widows: 20px;
        height: 20px;
      }
    }
    .route {
      display: flex;
      align-items: center;
      font-size: 14px;
      .icon {
        widows: 20px;
        height: 20px;
        margin: 0px 6px;
      }
      > a {
        color: $text-l;
        &:hover {
          color: #c34b4c;
        }
      }
      > span {
        color: $text-t;
      }
    }
    .search-box {
      display: flex;
      align-items: center;
      margin-left: 34px;
      input::-webkit-input-placeholder {
        font-size: inherit;
        color: $text-d;
      }
      input {
        font-size: 14px;
        color: $text-d;
        width: 215px;
        height: 32px;
        border-radius: 3px;
        border: 1px solid $border;
        background: none;
        background: url('../../assets/img/icon/search.png') 12px center
          no-repeat;
        background-size: auto 16px;
        padding-left: 36px;
      }
      button {
        height: 32px;
        padding: 0px 12px;
        font-size: 14px;
        color: $text-m;
        background: $main-color;
        margin-left: 16px;
        border-radius: 10px;
      }
    }
    .spacing {
      flex: 1;
    }
    .supply-btn {
      background: $warning-color;
      width: 108px;
      height: 32px;
      color: $text-b;
      border-radius: 10px;
      &:hover {
        background: lighten($color: $warning-color, $amount: 5);
      }
      img {
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>