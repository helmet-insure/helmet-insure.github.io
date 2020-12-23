<template>
  <div class="plan_echart">
    <div class="echart_bg" id="echart_bg"></div>
  </div>
</template>

<script>
import { Liquid, measureTextWidth } from "@antv/g2plot";
export default {
  data() {
    return {};
  },
  mounted() {
    const liquidPlot = new Liquid("echart_bg", {
      percent: 0.10,
      outline: {
        border: 4,
        distance: 8,
      },
      wave: {
        length: 128,
      },
      liquidStyle: ({ percent }) => {
        return {
          fill: "#FF9600",
          stroke: "#FF9600",
        };
      },
    });
    liquidPlot.render();
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
@media screen and(min-width: 750px) {
  .plan_echart {
    padding-top: 100px;
  }
  .echart_bg {
    width: 420px;
    height: 470px;
  }
}
</style>