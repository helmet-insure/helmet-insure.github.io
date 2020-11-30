<template>
  <div class="private-order">
    <Tooltip :name="$t('Dialog.PrivateOrder')" :hint="$t('Tips.Tip4')">
    </Tooltip>

    <ul class="coin-radio-list">
      <li v-for="item in typeList" :key="item" @click="selectCoin(item)">
        <img v-if="item !== current" src="~/assets/img/icon/radio2.png" />
        <img v-else src="~/assets/img/icon/radio1.png" />
        <label>{{ item }}</label>
      </li>
    </ul>
  </div>
</template>
<script>
import Tooltip from '~/components/common/tooltip.vue';
export default {
  components: { Tooltip },
  name: 'private-radio',
  data() {
    return {
      current: 'NO',
    };
  },
  computed: {
    typeList() {
      return ['YES', 'NO'];
    },
  },
  methods: {
    selectCoin(coin) {
      this.current = coin;
      this.$emit('change', coin);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .private-order {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .coin-radio-list {
    li {
      display: flex;
      align-items: center;
      > img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .private-order {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 30px;
  }
  .coin-radio-list {
    li {
      display: flex;
      align-items: center;
      > img {
        width: 16px;
        height: 16px;
      }
      label {
        font-size: 14px;
      }
    }
  }
}
.coin-radio-list {
  margin-left: 10px;
  display: flex;
  align-items: center;
  li {
    display: flex;
    align-items: center;
    margin-right: 20px;
    > img {
      margin-right: 10px;
    }
  }
}
</style>