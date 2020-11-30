<template>
  <ul class="p-tabs">
    <li
      v-for="(item, index) in data"
      :class="item === current ? 'active' : ''"
      :key="index"
      @click="selectTab(item)"
    >
      {{ item }}
    </li>
  </ul>
</template>
<script>
export default {
  name: "p-tabs",
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    current: {
      type: String,
      default: "",
    },
  },
  methods: {
    selectTab(item) {
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (max-width: 750px) {
  .p-tabs {
    padding: 0 16px;
  }
}
.p-tabs {
  display: flex;
  align-items: center;
  li {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: $text-t;
    margin-right: 48px;
    cursor: pointer;
    &.active {
      color: $main-color;
      border-bottom: 2px solid $main-color;
    }
  }
}
</style>