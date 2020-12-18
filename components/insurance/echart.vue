<template>
  <div class="echart">
    <svg id="canvas" width="100%" height="100%" x="200" y="200">
      <line
        x1="0"
        y1="40%"
        x2="100%"
        y2="40%"
        stroke-width="1"
        stroke="rgba(255, 150, 0, 0.2)"
      />
      <line
        x1="0"
        y1="60%"
        x2="100%"
        y2="60%"
        stroke-dasharray="3 2"
        stroke-width="1"
        stroke="#FF9600"
      />
      <line
        x1="0"
        y1="80%"
        x2="100%"
        y2="80%"
        stroke-width="1"
        stroke="rgba(255, 150, 0, 0.2)"
      />
      <polyline
        :points="str"
        style="fill: none; stroke: #000; stroke-width: 2; stroke: #ff9600"
      />
      <path
        d="M0 200 L1080 200 L1080 200 L1080 0 L500 150 L0 150 Z"
        style="stroke: ff9600; fill: rgba(255, 150, 0, 0.2)"
      />
      <circle cx="300" cy="150" r="6" fill="#FF9600" />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      str: '0,150 500,150 1080,0',
    };
  },
  mounted() { },
  methods: {
    polyLinePoints() { },
  },
};
</script>

<style lang='scss' scoped>
.echart {
  width: 100%;
  height: 200px;
  // background: #fcc;
  margin-bottom: 30px;
}
</style>