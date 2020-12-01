<template>
  <div class="buy-type">
    <button @click="handleClickType(1)" :class="type == 1 ? 'active' : ''">
      {{ text1 }}
    </button>
    <button @click="handleClickType(2)" :class="type == 2 ? 'active' : ''">
      {{ text2 }}
    </button>
  </div>
</template>

<script>
export default {
  props: ['text1', 'text2'],
  data() {
    return {
      type: 1,
    };
  },
  methods: {
    handleClickType(type) {
      console.log(type);
      this.type = type;
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and(min-width:750px) {
  .buy-type {
    background: #f7f7fa;
    width: 100%;
    display: flex;
    height: 50px;
    border-bottom: 2px solid #ff9600;
    border-radius: 3px 3px 0px 0px;
    overflow: hidden;
    button {
      border: none;
      outline: none;
      flex: 1;
      text-align: center;
      line-height: 50px;
      font-size: 16px;
      font-weight: bold;
      color: #121212;
      border-radius: 3px 3px 0px 0px;
    }
    .active {
      background: #ff9600;
      color: #fff;
    }
  }
}
</style>