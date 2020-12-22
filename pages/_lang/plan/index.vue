<template>
  <div class="plan-container">
    <div class="top">
      <PlanAction></PlanAction>
      <PlanEchart></PlanEchart>
    </div>
    <PlanWarn></PlanWarn>
  </div>
</template>
<script>
import PlanAction from "~/components/plan/plan-action.vue";
import PlanEchart from "~/components/plan/plan-echart.vue";
import PlanWarn from "~/components/plan/plan-warn.vue";
export default {
  layout: "default",
  name: "p-sell",
  components: {
    PlanAction,
    PlanEchart,
    PlanWarn,
  },
  data() {
    return {};
  },

  methods: {},
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .plan-container {
    width: 1200px;
    min-height: 800px;
    background: #fff;
    padding: 0 100px;
    margin-bottom: 40px;
    .top {
      display: flex;
      justify-content: space-between;
    }
  }
}
@media screen and (max-width: 750px) {
  .plan-container {
  }
}
</style>