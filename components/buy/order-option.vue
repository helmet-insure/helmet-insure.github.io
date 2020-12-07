<template>
  <div class="order-option">
    <div class="type-select-box">
      <label>{{ $t('Table.Type') }}</label>
      <TypeSelect @change="typeChanged"></TypeSelect>
    </div>
    <!-- <div class="coin-tab-box">
      <label>Collateral</label>
      <CoinTab @change="coinChanged"></CoinTab>
    </div> -->
    <div class="gap"></div>
    <div class="status-box">
      <label>{{ $t('Table.Status') }}</label>
      <select class="select" v-model="status">
        <option v-for="item in statusList" :key="item">{{ item }}</option>
      </select>
    </div>
    <div class="period-box">
      <label>{{ $t('Status.Period') }}</label>
      <select class="select" v-model="period">
        <option v-for="item in dataList" :key="item">{{ item }}</option>
      </select>
      <button class="search-btn-h5 search-btn" @click="toSearch">
        {{ $t('Status.Search') }}
      </button>
    </div>
    <button class="search-btn search-btn-pc" @click="toSearch">
      {{ $t('Status.Search') }}
    </button>
  </div>
</template>
<script>
import TypeSelect from '~/components/common/type-select.vue';
import CoinTab from '~/components/common/coin-tab.vue';

export default {
  name: 'order-option',
  components: {
    TypeSelect,
    CoinTab,
  },
  props: {
    statusType: {
      type: String,
      default: 'buyStatus',
    },
  },
  data() {
    return {
      buyStatus: [
        this.$t('Status.All'),
        this.$t('Status.Nonactivated'),
        this.$t('Status.Activated'),
        this.$t('Status.Closed'),
      ],
      advStatus: [
        this.$t('Status.All'),
        this.$t('Status.Unborrowed'),
        this.$t('Status.Beborrowed'),
        this.$t('Status.Dated'),
      ],
      orderStatus: [
        this.$t('Status.All'),
        this.$t('Status.Unactivated'),
        this.$t('Status.Activated'),
        this.$t('Status.Dated'),
      ],
      dataList: [
        this.$t('Status.All'),
        this.$t('Status.Within1day'),
        this.$t('Status.Within3days'),
        this.$t('Status.Within7days'),
        this.$t('Status.Within31days'),
      ],
      type: 'WETH',
      coin: this.$t('Status.All'),
      status: this.$t('Status.All'),
      period: this.$t('Status.All'),
      dataObj: {
        All: 0,
        'Within 1 day': 1,
        'Within 3 days': 3,
        'Within 7 days': 7,
        'Within 31 days': 31,
      },
    };
  },
  computed: {
    statusList() {
      return this[this.statusType];
    },
  },
  methods: {
    toSearch() {
      // let now = new Date().getTime();
      const data = {
        type: this.type,
        coin: this.coin,
        status: this.status,
        period: this.dataObj[this.period] * 24 * 60 * 60 * 1000,
      };
      this.$emit('search', data);
    },
    typeChanged(type) {
      this.type = type;
    },
    coinChanged(coin) {
      this.coin = coin;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .order-option {
    align-items: center;
    .coin-tab-box,
    .period-box {
      margin-left: 30px;
    }
    .search-btn-h5 {
      display: none;
    }
  }
}
@media screen and (max-width: 750px) {
  .order-option {
    flex-direction: column;
    .type-select-box,
    .status-box,
    .coin-tab-box,
    .period-box {
      margin-top: 20px;
    }
    .select {
      width: 50%;
      height: 32px;
      min-width: 180px;
      height: 32px;
    }
    .search-btn-pc {
      display: none;
    }
  }
}
.order-option {
  display: flex;
  padding: 0px 16px;
  .search-btn {
    padding: 0px 15px;
    background: $main-color;
    color: $text-m;
    border-radius: 10px;
    height: 32px;
    margin-left: 20px;
    &:hover {
      background: lighten($color: $main-color, $amount: 5);
    }
  }
  .gap {
    flex: 1;
  }
  > div {
    display: flex;
    align-items: center;
    label {
      margin-right: 10px;
    }
  }
}
</style>