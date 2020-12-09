<template>
  <select class="due-date select" v-model="dueDate">
    <option
      v-for="(item, index) in dateList"
      :key="index"
      :value="item + ' 00:00'"
    >
      {{ item + " 00:00" }}
    </option>
  </select>
</template>
<script>
import moment from "moment";
export default {
  name: "du-date",
  data() {
    return {
      dueDate: "",
    };
  },
  computed: {
    dateList() {
      const date = new Date();
      const threeDayAgo = new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000);
      let currentMonthLastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      );
      let nextMonthLastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 2,
        0
      );

      if (currentMonthLastDay <= threeDayAgo) {
        currentMonthLastDay = new Date(
          date.getFullYear(),
          date.getMonth() + 2,
          0
        );
        nextMonthLastDay = new Date(date.getFullYear(), date.getMonth() + 3, 0);
      }

      const dateArr = [];
      let time;
      for (let i = 1; i <= 3; i++) {
        time = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);
        dateArr.push(moment(time).format("YYYY-MM-DD"));
      }
      dateArr.push(moment(currentMonthLastDay).format("YYYY-MM-DD"));
      dateArr.push(moment(nextMonthLastDay).format("YYYY-MM-DD"));
      if (!this.dueDate) {
        this.dueDate = dateArr[0] + " 00:00";
      }
      // console.log('new Date((new Date().getTime()) + 1 * 24 *60 * 60 * 1000)###', new Date((new Date().getTime()) + 1 * 24 *60 * 60 * 1000));
      return dateArr;
    },
  },
  watch: {
    dueDate(newValue) {
      this.$emit("change", newValue);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .due-date {
    width: 200px;
  }
}
</style>