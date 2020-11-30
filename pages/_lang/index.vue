<template>
  <div class="helmet_container">
    <div class="helmet_logo">
      <a href="#"></a>
    </div>
    <div class="helmet_content">
      <div class="right_text">
        <h3><span>HELMET</span>.INSURE</h3>
        <p>HELMET will be with you any corner</p>
        <div>
          <button @click="toProduct">
            <img src="~/assets/img/helmet/home_btn_icon.png" alt="" />
            Lauch APP
          </button>
          <button>
            <img src="~/assets/img/helmet/home_github.png" alt="" />
            View GitHub
          </button>
        </div>
      </div>
      <div class="right_pic">
        <img src="~/assets/img/helmet/home_banner.png" alt="" />
      </div>
    </div>
    <div class="helmet_footer">
      <div class="footer_top">
        <a href="">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Twitter"></use>
          </svg>
          <span>Twitter</span>
        </a>
        <a href="">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Telegram"></use>
          </svg>
          <span>Telegram</span>
        </a>
        <a href="">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-Discord"></use>
          </svg>
          <span>Discord</span>
        </a>
        <a href="">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-medium"></use>
          </svg>
          <span>Medium</span>
        </a>
      </div>
      <div class="footer_bottom">
        <p>Powered by HELMET Core team</p>
      </div>
    </div>
  </div>
</template>
<script>
import Insurance from '~/components/insurance/index.vue';
import Banner from '~/components/insurance/banner.vue';
import '~/assets/svg/iconfont.js';
export default {
  layout: 'helmet',
  name: 'home',
  components: {
    Banner,
    Insurance,
  },
  methods: {
    toProduct() {
      this.$router.push('/product');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/assets/css/base.scss';

@media screen and (min-width: 1280px) {
  .helmet_container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 6.25vw;
    .helmet_logo {
      height: 108px;
      display: flex;
      align-items: flex-end;
      a {
        display: block;
        width: 255px;
        height: 48px;
        background-image: url('../../assets/img/helmet/home_logo.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    .helmet_content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      .right_text {
        margin-top: 20vh;
        H3 {
          color: #fff;
          font-size: 5vw;
          font-weight: 300;
          span {
            color: #ff9600;
          }
        }
        p {
          font-size: 2vw;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
        }
        div {
          display: flex;
          margin-top: 6.4vh;
          button {
            min-width: 128px;
            min-height: 36px;
            width: 8vw;
            height: 5vh;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              transition: transform 0.5s ease;
              transform: scale(1.04);
            }
            &:nth-of-type(1) {
              border: 1px solid #ff9600;
              background: none;
              font-size: 16px;
              font-weight: 600;
              color: #ff9600;
              margin-right: 20px;
              img {
                width: 24px;
                height: 24px;
                margin-right: 4px;
              }
            }

            &:nth-of-type(2) {
              background: #ff9600;
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              img {
                width: 24px;
                height: 24px;
                margin-right: 4px;
              }
            }
          }
        }
      }
      .right_pic {
        min-width: 474px;
        min-height: 322px;
        margin-top: 18vh;
        width: 35vw;
        height: 46vh;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .helmet_footer {
      width: 100%;
      height: 150px;
      display: flex;
      flex-direction: column;
      .footer_top {
        width: 300px;
        flex: 1;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 24px;
            height: 24px;
          }
          span {
            margin-top: 4px;
            font-size: 14px;
            color: #e8e7e9;
          }
        }
      }
      .footer_bottom {
        border-top: 1px solid #212121;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          font-size: 14px;
          font-weight: 400;
          color: #545454;
        }
      }
    }
  }
}
@media screen and(max-width:1280px) {
  .helmet_container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 0 100px;
    .helmet_logo {
      height: 108px;
      display: flex;
      align-items: flex-end;
      a {
        display: block;
        width: 210px;
        height: 40px;
        background-image: url('../../assets/img/helmet/home_logo.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
    .helmet_content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      .right_text {
        margin-top: 150px;
        H3 {
          color: #fff;
          font-size: 64px;
          font-weight: 300;
          span {
            color: #ff9600;
          }
        }
        p {
          font-size: 24px;
          font-weight: 300;
          color: rgba(255, 255, 255, 0.6);
        }
        div {
          display: flex;
          margin-top: 40px;
          button {
            width: 134px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              transition: transform 0.5s ease;
              transform: scale(1.04);
            }
            &:nth-of-type(1) {
              border: 1px solid #ff9600;
              background: none;
              font-size: 16px;
              font-weight: 600;
              color: #ff9600;
              margin-right: 20px;
              img {
                width: 24px;
                height: 24px;
                margin-right: 4px;
              }
            }

            &:nth-of-type(2) {
              background: #ff9600;
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              img {
                width: 24px;
                height: 24px;
                margin-right: 4px;
              }
            }
          }
        }
      }
      .right_pic {
        min-width: 474px;
        min-height: 322px;
        margin-top: 140px;
        width: 474px;
        height: 322px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .helmet_footer {
      width: 100%;
      height: 150px;
      display: flex;
      flex-direction: column;
      .footer_top {
        width: 300px;
        flex: 1;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 24px;
            height: 24px;
          }
          span {
            margin-top: 4px;
            font-size: 14px;
            color: #e8e7e9;
          }
        }
      }
      .footer_bottom {
        border-top: 1px solid #212121;
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          font-size: 14px;
          font-weight: 400;
          color: #545454;
        }
      }
    }
  }
}
.icon {
  width: 24px;
  height: 24px;
  vertical-align: -0.15em;
  fill: #ffffff;
  overflow: hidden;
}
.footer_top {
  a:hover {
    .icon:hover {
      fill: #ff9600;
    }
    span {
      color: #ff9600 !important;
    }
  }
}
</style>
