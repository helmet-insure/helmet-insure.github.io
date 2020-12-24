<template>
  <div class="plan_echart">
    <div class="echart_bg" id="echart_bg"></div>
  </div>
</template>

<script>
import { Liquid, measureTextWidth } from "@antv/g2plot";
import { getProgess } from "~/interface/price.js";
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
export default {
  data() {
    return {
      num: 0,
    };
  },
  mounted() {
    setTimeout(() => {
      this.getProgress();
    }, 500);
    setTimeout(() => {
      const liquidPlot = new Liquid("echart_bg", {
        percent: this.num,
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
    }, 1000);
  },
  methods: {
    async getProgress() {
      let res = await getProgess();
      res = toRounding(res, 4);
      this.num = res;
    },
  },
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