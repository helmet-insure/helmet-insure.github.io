<template>
  <div class="hat-list-box">
    <ul class="hat-list">
      <HatItem
        v-for="(item, index) in hatList"
        :key="index"
        :data="item"
      ></HatItem>
    </ul>
    <NoData v-if="hatList.length < 1 && !isLoading"></NoData>
    <div class="loading"  v-if="isLoading">
      <img src="~/assets/img/loading.gif"/>
    </div>
  </div>
  
</template>
<script>
import HatItem from "./hat-item.vue";
import NoData from '~/components/common/no-data.vue';

export default {
  name: "hat-list",
  components: {
    HatItem,
    NoData
  },
  data() {
    return {
      isLoading: true
    }
  },
  computed: {
    aboutInfoSell() {
      return this.$store.state.aboutInfoSell;
    },
    notExpriedAbountInfoSell() {
      return this.$store.state.notExpriedAbountInfoSell;
    },
    hatList() {
      return this.$store.state.hatList || [];
    },
    routerId() {
      return this.$route.params.id;
    },
  },
  watch: {
    aboutInfoSell: {
      handler: "aboutInfoSellWatch",
      immediate: true,
    },
    hatList(newValue) {
      if (newValue) {
        this.isLoading = false;
      }
    },
  },
  methods: {
    aboutInfoSellWatch(newValue) {
      if (newValue) {
        this.$store.dispatch("getHatList", { und: this.routerId.toUpperCase() });
      }
    },
  },
  mounted() {
    this.$bus.$on('HAT_LIST_LOADING', (data) => {
      this.isLoading = true;
    })
  }
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .hat-list-box {
    position: relative;
    .loading {
      position: absolute;
      left: 0px;
      top: 0px;
      right: 0px;
      bottom: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .hat-list {
    width: 1200px;
    margin: 0 auto;
    margin-top: 33px;
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-between; */
  }
}
@media screen and (max-width: 750px) {
  .hat-list {
    display: flex;
    flex-direction: column;
    margin: 0 16px;
  }
}
</style>