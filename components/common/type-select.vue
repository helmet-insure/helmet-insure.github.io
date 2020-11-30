<template>
  <div class="type-select">
    <div class="name" @click="toggle">
      <img class="coin" :src="require(`~/assets/img/icon/${current}@2x.png`)" />
      <span>{{ current }}</span>
      <img class="icon" src="~/assets/img/icon/pull.png" />
    </div>
    <ul v-if="showList">
      <li v-for="item in typeList" :key="item" @click="selectType(item)">
        <img :src="require(`~/assets/img/icon/${item}@2x.png`)" />
        <span>{{ item == "OTHERS" ? "..." : item }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "type-select",
  data() {
    return {
      current: "WETH",
      showList: false,
    };
  },
  computed: {
    typeList() {
      return this.$store.state.typeList;
    },
  },
  methods: {
    selectType(type) {
      this.current = type;
      this.$emit("change", type);
      this.closeList();
    },
    openList() {
      this.showList = true;
    },
    closeList() {
      this.showList = false;
    },
    toggle() {
      this.showList = !this.showList;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .type-select {
    min-width: 120px;
  }
}
@media screen and (max-width: 750px) {
  .type-select {
    min-width: 120px;
  }
}
.type-select {
  position: relative;
  height: 32px;
  .name {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0px 10px;
    border-radius: 10px;
    background: $border;
    color: $text-t;
    font-size: 14px;
    cursor: pointer;
    .coin {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    > span {
      flex: 1;
    }
    .icon {
      width: 20px;
      height: 20px;
      margin-left: 8px;
    }
  }
  > ul {
    position: absolute;
    left: 0px;
    top: 38px;
    border-radius: 4px;
    border: 1px solid $border;
    background-color: $bg-d;
    width: 100%;
    z-index: 9;
    li {
      cursor: pointer;
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding: 0px 10px;
      display: flex;
      align-items: center;
      font-size: 14px;
      &:hover {
        background: $border;
      }
      > img {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
  }
}
</style>