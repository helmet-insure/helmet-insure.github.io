<template>
  <div class="insurance-container">
    <WalletConnect></WalletConnect>
    <InsuranceBreadcrumb></InsuranceBreadcrumb>
    <InsuranceList></InsuranceList>
  </div>
</template>
<script>
import WalletConnect from "./wallet-connect.vue";
import InsuranceBreadcrumb from "./breadcrumb.vue";
import InsuranceList from "./list.vue";
export default {
  name: "insurance-page",
  components: {
    WalletConnect,
    InsuranceBreadcrumb,
    InsuranceList,
  },
};
</script>