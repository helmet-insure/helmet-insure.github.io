<template>
  <PDailog
    :title="$t('Table.Cancel')"
    @close="closeRePrice"
    :noCancel="true"
    :rightBtnText="$t('Table.Confirm')"
    @confirm="submitRePrice"
  >
    <div class="input">
      <input type="text" v-model="id" />
      <input type="text" v-model="price" />
    </div>
  </PDailog>
</template>

<script>
import PDailog from "~/components/common/p-dialog.vue";
import { RePrice } from "~/interface/order.js";
import { getTokenName } from "~/assets/utils/address-pool.js";
export default {
  components: {
    PDailog,
  },
  props: ["option"],
  data() {
    return {
      id: "",
      price: "",
    };
  },
  mounted() {
    this.id = this.option.id;
    this.price = this.option.price;
  },
  methods: {
    closeRePrice() {
      this.$bus.$emit("CLONE_REPRICE");
    },
    submitRePrice() {
      let option = this.option;
      option.price = this.price;
      option._collateral = getTokenName(this.option._collateral);
      option._underlying = getTokenName(this.option._underlying);
      RePrice(option);
      this.$bus.$emit("CLONE_REPRICE");
    },
  },
};
</script>

<style lang='scss' scoped>
.input {
  width: 100%;
  margin-top: 20px;
  input {
    width: 100%;
    height: 100%;
    padding: 0 12px;
    border: 1px solid #cfcfd2;
    height: 40px;
    margin: 20px 0 10px 0;
  }
}
</style>