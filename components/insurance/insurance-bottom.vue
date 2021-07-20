<template>
  <div class="insurance_bottom">
    <div class="buy-type">
      <button @click="handleClickType(1)" :class="type == 1 ? 'active' : ''">
        {{ $t("Type.MyGuarantee") }}
      </button>
      <button @click="handleClickType(2)" :class="type == 2 ? 'active' : ''">
        {{ $t("Type.IssueInsurance") }}
      </button>
      <button @click="handleClickType(3)" :class="type == 3 ? 'active' : ''">
        {{ $t("Type.Claim") }}
      </button>
    </div>
    <MyGuarantee v-if="type == 1"></MyGuarantee>
    <MyInsurance v-if="type == 2"></MyInsurance>
    <MyClaim v-if="type == 3"></MyClaim>
  </div>
</template>

<script>
import MyInsurance from './my-insurance.vue';
import MyGuarantee from './my-guarantee.vue';
import MyClaim from './my-claim.vue';

export default {
  components: {
    MyInsurance,
    MyGuarantee,
    MyClaim
  },
  data() {
    return {
      type: 1,
    };
  },
  mounted() { },
  methods: {
    handleClickType(type) {
      this.type = type;
    },
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .insurance_bottom {
    margin-bottom: 10px;
    background: #fff;
    padding: 40px 60px;
  }
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
      background: #f7f7fa;
      border-radius: 3px 3px 0px 0px;
    }
    .active {
      background: #ff9600;
      color: #fff;
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance_bottom {
    background: #fff;
    padding: 20px 16px 30px;
  }
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