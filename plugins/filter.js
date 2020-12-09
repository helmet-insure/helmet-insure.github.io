import Vue from "vue";
import {
  fixD,
  addCommom,
  timeFormat,
  mathCeil,
  formatNumW,
  formatNumM
} from "~/assets/js/util.js";

const Filter = {
  fixD: fixD,
  addCommom: addCommom,
  timeFormat: timeFormat,
  mathCeil: mathCeil,
  formatNumM: formatNumM,
  formatNumW: formatNumW
};

Object.keys(Filter).forEach(key => {
  Vue.filter(key, Filter[key]);
});

export default Filter;
