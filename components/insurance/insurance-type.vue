<template>
  <div class="insurance_type">
    <div class="type_btn">
      <button
        @click="handleClickInsurance(1)"
        :class="insurance_type == 1 ? 'green' : ''"
      >
        {{ $t('Content.DoubleInsurance') }}<span>100%</span><i></i>
      </button>
      <button
        @click="handleClickInsurance(2)"
        :class="insurance_type == 2 ? 'orange' : ''"
      >
        {{ $t('Content.HalfInsurance') }}<span>-50%</span><i></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      insurance_type: 1,
    };
  },
  methods: {
    handleClickInsurance(type) {
      this.$emit('changeType', type);
      this.insurance_type = type;
    },
  },
};
</script>

<style lang='scss' scoped>
.green {
  border-bottom: 2px solid #00b900 !important;
}
.orange {
  border-bottom: 2px solid #ff6400 !important;
}
@media screen and (min-width: 750px) {
  .insurance_type {
    margin-bottom: 20px;
    .type_btn {
      display: flex;
      justify-content: space-between;
      button {
        width: 530px;
        height: 50px;
        display: flex;
        justify-content: center;
        line-height: 50px;
        overflow: hidden;
        border-bottom: 2px solid transparent;
        span {
          font-weight: bold;
          line-height: 52px;
          font-size: 16px;
          margin-left: 8px;
        }
        i {
          width: 16px;
          height: 16px;
          display: inline-block;
          background-repeat: no-repeat;
          background-size: cover;
          margin: auto 0px auto 4px;
        }
        &:nth-of-type(1) {
          color: #00b900;
          background: rgba(0, 185, 0, 0.04);
          i {
            background-image: url('../../assets/img/helmet/call@2x.png');
          }
        }
        &:nth-of-type(2) {
          color: #ff6400;
          background: rgba(255, 100, 0, 0.06);
          i {
            background-image: url('../../assets/img/helmet/put@2x.png');
          }
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .insurance_type {
    margin-bottom: 20px;
    .type_btn {
      display: flex;
      justify-content: space-between;
      button {
        width: 48%;
        height: 50px;
        display: flex;
        justify-content: center;
        line-height: 50px;
        overflow: hidden;
        border-bottom: 2px solid transparent;
        span {
          font-weight: bold;
          line-height: 52px;
          font-size: 16px;
          margin-left: 8px;
        }
        i {
          width: 16px;
          height: 16px;
          display: inline-block;
          background-repeat: no-repeat;
          background-size: cover;
          margin: auto 0px auto 4px;
        }
        &:nth-of-type(1) {
          color: #00b900;
          background: rgba(0, 185, 0, 0.04);
          i {
            background-image: url('../../assets/img/helmet/call@2x.png');
          }
        }
        &:nth-of-type(2) {
          color: #ff6400;
          background: rgba(255, 100, 0, 0.04);
          i {
            background-image: url('../../assets/img/helmet/put@2x.png');
          }
        }
      }
    }
  }
}
</style>