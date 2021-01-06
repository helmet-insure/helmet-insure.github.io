<template>
  <div class="echart">
    <svg id="canvas" width="100%" height="200px" x="200" y="200">
      <line
        v-for="item in xAis"
        :key="item"
        x1="0"
        :y1="item"
        x2="100%"
        :y2="item"
        stroke-width="1"
        stroke="rgba(255, 150, 0, 0.2)"
      />
      <line
        v-for="(item, index) in line"
        :key="item.line"
        x1="0"
        :y1="item.line + '%'"
        x2="100%"
        :y2="item.line + '%'"
        :stroke-dasharray="index == 1 ? '6 2' : ''"
        stroke-width="1"
        :stroke="item.color"
      />
      <text
        v-for="(item, index) in line"
        :key="index"
        x="0"
        :y="item.line + 1.5 + '%'"
        style="font-size: 12px"
        fill="#919AA6"
      >
        {{ item.num }}
      </text>
      <text
        v-for="(item, index) in line"
        :key="index + 'key'"
        x="45%"
        :y="item.line + 1.5 + '%'"
        style="font-size: 12px"
        fill="#919AA6"
      >
        {{ item.title }}
      </text>
      <!-- <polyline
        :points="str"
        style="fill: none; stroke: #000; stroke-width: 2; stroke: #ff9600"
      /> -->
      <path :d="this.upCover" style="fill: rgba(0, 185, 0, 0.1)" />
      <path :d="this.dwCover" style="fill: rgba(255, 100, 0, 0.1)" />

      <!-- <circle cx="300" cy="150" r="6" fill="#FF9600" /> -->
    </svg>
  </div>
</template>

<script>
import { fixD, addCommom, autoRounding, toRounding } from "~/assets/js/util.js";
export default {
  data() {
    return {
      str: "0,150 500,150 1080,0",
      xAis: ["25%", "50%", "75%"],
      curCoin: "HELMET",
      price: {},
      linePrice: {},
      toRounding,
      autoRounding,
      max: 0,
      line: [],
      upCover: "",
      dwCover: "",
    };
  },
  mounted() {
    this.$bus.$on("WATCH_COIN", (coin) => {
      this.curCoin = coin;
    });
    this.$bus.$on("DRAW_ECHART", () => {
      this.draw();
    });
  },
  watch: {
    curCoin(newVal, Val) {
      let arr = this.$store.state.allIndexPrice[1];
      let max = toRounding(arr[this.curCoin] * 2 * 1.5, 4);
      this.max = max;
      if (newVal) {
        console.log(newVal);
        this.price = {
          IndexPrice: toRounding(Number(arr[newVal]), 4),
          Cover100: toRounding(arr[newVal] * 2, 4),
          Cover50: toRounding(arr[newVal] / 2, 4),
        };
        this.line = [
          {
            line: 100 - toRounding(((arr[this.curCoin] * 2) / max) * 100, 0),
            cover: 1 - toRounding((arr[this.curCoin] * 2) / max, 2),
            num: toRounding(arr[this.curCoin] * 2, 4),
            color: "#00B900",
            title: this.$t("Content.ChartUp"),
          },
          {
            line: 100 - toRounding(Number(arr[this.curCoin] / max) * 100, 0),
            cover: 1 - toRounding(Number(arr[this.curCoin] / max), 2),
            num: toRounding(arr[this.curCoin], 4),
            color: "#919AA6",
            title: this.$t("Content.ChartPrice"),
          },
          {
            line: 100 - toRounding((arr[this.curCoin] / 2 / max) * 100, 0),
            cover: 1 - toRounding(arr[this.curCoin] / 2 / max, 2),
            num: toRounding(arr[this.curCoin] / 2, 4),
            color: "#FF9600",
            title: this.$t("Content.ChartOff"),
          },
        ];
        this.upCover = `M0 0 L1080 0 L1080 ${this.line[0].cover * 200} L0 ${
          this.line[0].cover * 200
        } Z`;
        this.dwCover = `M0 200 L1080 200 L1080 ${this.line[2].cover * 200} L0 ${
          this.line[2].cover * 200
        } Z`;
      }
    },
  },
  computed: {
    IndexPrice() {
      return this.$store.state.allIndexPrice;
    },
  },
  methods: {
    draw() {
      setTimeout(() => {
        let arr = this.$store.state.allIndexPrice[1];
        if (arr.BNB != 0) {
          let max = toRounding(arr[this.curCoin] * 2 * 1.5, 4);
          this.max = max;
          this.price = {
            IndexPrice: toRounding(Number(arr[this.curCoin]), 4),
            Cover100: toRounding(arr[this.curCoin] * 2, 4),
            Cover50: toRounding(arr[this.curCoin] / 2, 4),
          };
          this.line = [
            {
              line: 100 - toRounding(((arr[this.curCoin] * 2) / max) * 100, 0),
              cover: 1 - toRounding((arr[this.curCoin] * 2) / max, 2),
              num: toRounding(arr[this.curCoin] * 2, 4),
              color: "#00B900",
              title: this.$t("Content.ChartUp"),
            },
            {
              line: 100 - toRounding(Number(arr[this.curCoin] / max) * 100, 0),
              cover: 1 - toRounding(Number(arr[this.curCoin] / max), 2),
              num: toRounding(arr[this.curCoin], 4),
              color: "#919AA6",
              title: this.$t("Content.ChartPrice"),
            },
            {
              line: 100 - toRounding((arr[this.curCoin] / 2 / max) * 100, 0),
              cover: 1 - toRounding(arr[this.curCoin] / 2 / max, 2),
              num: toRounding(arr[this.curCoin] / 2, 4),
              color: "#FF9600",
              title: this.$t("Content.ChartOff"),
            },
          ];

          this.upCover = `M0 0 L1080 0 L1080 ${this.line[0].cover * 200} L0 ${
            this.line[0].cover * 200
          } Z`;
          this.dwCover = `M0 200 L1080 200 L1080 ${
            this.line[2].cover * 200
          } L0 ${this.line[2].cover * 200} Z`;
        }
      }, 1000);
    },
  },
};
</script>

<style lang='scss' scoped>
.echart {
  width: 100%;
  height: 200px;
  // background: #fcc;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}
</style>