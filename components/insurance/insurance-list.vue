<template>
  <div class="insurance_list">
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>保费 (HELMET)</td>
          <td>保单数量</td>
          <td class="option">操作</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0123</td>
          <td>10.000</td>
          <td>1000000</td>
          <td class="option">
            <PInput
              type="number"
              v-model="price"
              fix="2"
              maxValue="10000"
              right="投保"
              placeholder="请输入数量"
            ></PInput>
          </td>
        </tr>
        <tr>
          <td>0123</td>
          <td>10.000</td>
          <td>1000000</td>
          <td class="option">
            <PInput
              type="number"
              v-model="price"
              fix="2"
              maxValue="10000"
              right="投保"
              placeholder="请输入数量"
            ></PInput>
          </td>
        </tr>
        <tr>
          <td>0123</td>
          <td>10.000</td>
          <td>1000000</td>
          <td class="option">
            <PInput
              type="number"
              v-model="price"
              fix="2"
              right="投保"
              maxValue="10000"
              placeholder="请输入数量"
            ></PInput>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import PInput from '~/components/common/p-input.vue';
export default {
  components: {
    PInput,
  },
  data() {
    return {
      price: '',
    };
  },
};
</script>

<style lang='scss' scoped>
@media screen and (min-width: 750px) {
  .insurance_list {
    padding-bottom: 40px;
    table {
      width: 100%;
      display: flex;
      flex-direction: column;
      tr {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        box-sizing: border-box;
        align-items: center;
        td {
          width: 100px;
          white-space: nowrap;
        }
      }
      .option {
        text-align: right;
        width: 265px;
      }
      thead {
        width: 100%;
        background: #f7f7fa;
        tr {
          height: 40px;
          color: #919aa6;
          td {
            line-height: 40px;
            font-size: 14px;
          }
        }
      }
      tbody {
        width: 100%;
        tr {
          width: 100%;
          box-shadow: 0px 1px 0px 0px #ededf0;
          td {
            white-space: nowrap;
            width: 100px;
            height: 60px;
            line-height: 60px;
            width: 42px;
            font-size: 14px;
            font-weight: bold;
            color: #121212;
          }
          .option {
            display: flex;
            align-items: center;
            transform: translateX(20px);
          }
        }
      }
    }
  }
}
</style>