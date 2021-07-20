<template>
  <PDailog
    :title="$t('Table.Cancel')"
    @close="closeRePrice"
    :noCancel="true"
    :rightBtnText="$t('Table.Confirm')"
    @confirm="submitRePrice"
  >
    <div class="input">
      <label for="">
        <span>ID</span>
        <input type="text" v-model="id" readonly />
      </label>
      <label for="">
        <span>{{ $t("Table.InsurancePrice") }}</span>
        <input type="text" v-model="price" />
      </label>
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
      this.$bus.$emit("CLOSE_REPRICE");
    },
    submitRePrice() {
      let option = this.option;
      let _collateral = getTokenName(this.option._collateral);
      let _underlying = getTokenName(this.option._underlying);
      let data = {
        price: this.price,
        id: option.id,
        _collateral: _collateral,
        _underlying: _underlying,
      };
      RePrice(data);

      this.$bus.$emit("CLOSE_REPRICE");
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
    margin: 5px 0 10px 0;
  }
  label {
    margin-top: 10px;
    display: block;
  }
}
</style>