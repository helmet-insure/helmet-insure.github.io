<template>
  <div class="my_guarantee">
    <table>
      <thead>
        <tr>
          <td>{{ $t('Table.ID') }}</td>
          <td>{{ $t('Table.Type') }}</td>
          <td>{{ $t('Table.InsurancePrice') }}</td>
          <td>{{ $t('Table.Rent') }}</td>
          <td>{{ $t('Table.Position') }}</td>
          <td>{{ $t('Table.CountDonm') }}</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0123</td>
          <td>BNB</td>
          <td>200.00 QUSD</td>
          <td>21.000</td>
          <td>53737</td>
          <td>14天20时06分24秒</td>
          <td>
            <button class="b_b_button">{{ $t('Table.outSure') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <p>
        <span>{{ $t('Table.ID') }}</span
        ><span>0123</span>
      </p>
      <div>
        <p>
          <span>{{ $t('Table.Type') }}</span
          ><span>0123</span>
        </p>
        <p>
          <span>{{ $t('Table.InsurancePrice') }}</span
          ><span>0123</span>
        </p>
      </div>
      <div>
        <p>
          <span>{{ $t('Table.Rent') }}</span
          ><span>0123</span>
        </p>
        <p>
          <span>{{ $t('Table.Position') }}</span
          ><span>0123</span>
        </p>
      </div>
      <section>
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          200.0100 BNB
        </span>
        <button class="b_b_button">{{ $t('Table.outSure') }}</button>
      </section>
    </div>
    <div>
      <p><span>ID</span><span>0123</span></p>
      <div>
        <p><span>品种</span><span>0123</span></p>
        <p><span>保单价格</span><span>0123</span></p>
      </div>
      <div>
        <p><span>保费 (HELMET)</span><span>0123</span></p>
        <p><span>持有量（SHort Token)</span><span>0123</span></p>
      </div>
      <section>
        <span>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-time"></use>
          </svg>
          200.0100 BNB
        </span>
        <button class="b_b_button">出险</button>
      </section>
    </div>
  </div>
</template>

<script>
import '~/assets/svg/iconfont.js';
export default {};
</script>

<style lang='scss' scoped>
@import '~/assets/css/base.scss';
@media screen and (min-width: 750px) {
  .my_guarantee {
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

          td:last-child {
            transform: translateX(20px);
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
  .my_guarantee {
    table {
      display: none;
    }
    > div {
      margin-top: 20px;
      width: 100%;
      height: 208px;
      padding: 20px 10px;
      background: #f7f7fa;

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
      > section {
        display: flex;
        justify-content: space-between;
        span {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #787878;
  overflow: hidden;
}
</style>