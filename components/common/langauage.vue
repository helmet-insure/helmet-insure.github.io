<template>
  <div class="langauage">
    <div class="hover_box">
      <img src="~/assets/img/helmet/globe@2x.png" alt="" />
      <span>{{ langName }}</span>
      <img src="~/assets/img/helmet/chevrondown@2x.png" alt="" />
      <div class="hint_box">
        <ul>
          <li
            v-for="item in localeList"
            :key="item.key"
            @click="switchLang(item.key)"
          >
            <!-- <img src="~/assets/img/icon/radio1.png" v-if="item.key == lang" /> -->
            <!-- <img src="~/assets/img/icon/radio2.png" v-else /> -->
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'langauage',
  data() {
    return {
      lang: '',
      langName: '',
    };
  },

  computed: {
    locales() {
      return this.$store.state.locales;
    },
    locale() {
      return this.$store.state.locale;
    },
    localeList() {
      return this.$store.state.localeList;
    },
  },
  watch: {
    lang(newVol) {
      this.switchLang(newVol);
      this.langName = this.localeList.filter(
        (item) => item.key == newVol
      )[0].name;
    },
    locale: {
      handler: 'watchLocale',
      immediate: true,
    },
  },
  mounted() {
    this.lang = window.localStorage.getItem('lang') || this.locale;
  },

  methods: {
    watchLocale(newVol) {
      this.lang = newVol;
    },
    switchLang(lang) {
      this.lang = lang;
      window.localStorage.setItem('lang', this.lang);
      this.$store.dispatch('setLanguage', this.lang);
      this.$i18n.locale = this.lang;
    },
  },
};
</script>

<style lang='scss'>
@media screen and (min-width: 750px) {
  .langauage {
    height: 100%;
    display: flex;
    align-items: center;
    .hover_box {
      width: 160px;
      height: 40px;
      border-radius: 3px;
      border: 1px solid #212121;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
        transform: rotate(180deg);
        &:nth-of-type(1) {
          margin-left: 10px;
          margin-right: 10px;
        }
        &:nth-of-type(2) {
          margin-right: 10px;
        }
      }
      span {
        flex: 1;
        color: #dbdbdb;
      }
    }
    .hint_box {
      display: none;
      position: absolute;
      top: calc(-100% - 45px);
      z-index: 9;
      margin-bottom: 40px;
      ul {
        background: #000;
        width: 160px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        li {
          padding-left: 16px;
          height: 40px;
          display: flex;
          align-items: center;
          color: #dbdbdb;
          font-size: 14px;
          img {
            margin-right: 10px;
            width: 16px;
            height: 16px;
          }
          &:hover {
            background: #1d1d1d;
          }
        }
      }
    }
  }
  .langauage:hover {
    img {
      transform: rotate(360deg);
    }
    .hint_box {
      display: block;
    }
  }
}
@media screen and (max-width: 750px) {
  .langauage {
    display: none;
  }
}
</style>