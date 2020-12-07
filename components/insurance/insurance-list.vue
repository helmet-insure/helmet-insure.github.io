<template>
  <div class="insurance_list">
    <table>
      <thead>
        <tr>
<<<<<<< HEAD
          <td>{{ $t('Table.ID') }}</td>
          <td>{{ $t('Table.Rent') }}</td>
          <td>{{ $t('Table.Amount') }}</td>
          <td class="option">{{ $t('Table.Options') }}</td>
=======
          <td>ID</td>
          <td>保费 (HELMET)</td>
          <td>保单数量</td>
          <td class="option">操作</td>
>>>>>>> 2d9c12bebefc8728c6869dc3edc405e950fd9391
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
<<<<<<< HEAD
              :right="$t('Table.Insure')"
=======
              right="投保"
              placeholder="请输入数量"
>>>>>>> 2d9c12bebefc8728c6869dc3edc405e950fd9391
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
<<<<<<< HEAD
              :right="$t('Table.Insure')"
=======
              right="投保"
              placeholder="请输入数量"
>>>>>>> 2d9c12bebefc8728c6869dc3edc405e950fd9391
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
<<<<<<< HEAD
              :right="$t('Table.Insure')"
              maxValue="10000"
=======
              right="投保"
              maxValue="10000"
              placeholder="请输入数量"
>>>>>>> 2d9c12bebefc8728c6869dc3edc405e950fd9391
            ></PInput>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <p><span>ID</span><span>01239012</span></p>
      <div>
        <p><span>保费(HELMET)</span> <span>100只</span></p>
        <p><span>保单数量</span><span>10000</span></p>
      </div>
      <div>
        <PInput
          type="number"
          v-model="price"
          fix="2"
<<<<<<< HEAD
          :right="$t('Table.Insure')"
          maxValue="10000"
=======
          right="投保"
          maxValue="10000"
          placeholder="请输入数量"
>>>>>>> 2d9c12bebefc8728c6869dc3edc405e950fd9391
        ></PInput>
      </div>
    </div>
    <div>
      <p><span>ID</span><span>01239012</span></p>
      <div>
        <p><span>保费(HELMET)</span> <span>100只</span></p>
        <p><span>保单数量</span><span>10000</span></p>
      </div>
      <div>
        <PInput
          type="number"
          v-model="price"
          fix="2"
<<<<<<< HEAD
          :right="$t('Table.Insure')"
          maxValue="10000"
=======
          right="投保"
          maxValue="10000"
          placeholder="请输入数量"
>>>>>>> 2d9c12bebefc8728c6869dc3edc405e950fd9391
        ></PInput>
      </div>
    </div>
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
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .insurance_list {
    > div {
      display: none;
    }
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
@media screen and (max-width: 750px) {
  .insurance_list {
    table {
      display: none;
    }
    > div {
      width: 100%;
      height: 160px;
      padding: 20px 10px;
      background: #f7f7fa;
      margin-bottom: 10px;
      &:last-of-type {
        margin-bottom: 0;
      }
      p {
        display: flex;
        span:nth-of-type(1) {
          font-size: 12px;
          color: #919aa6;
        }
        span:nth-of-type(2) {
          font-weight: bold;
          color: #121212;
        }
      }
      > p {
        align-items: center;
        span:nth-of-type(1) {
          margin-right: 4px;
        }
      }
      > div {
        margin: 12px 0 16px 0;
        display: flex;
        p {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
      }
    }
  }
}
</style>