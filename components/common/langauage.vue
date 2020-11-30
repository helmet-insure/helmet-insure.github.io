<template>
  <div class="langauage">
    <div class="hover_box">
      <span>{{ langName }}</span>
      <img src="~/assets/img/icon/icon_minor_select@2x.png" alt="" />
      <div class="hint_box">
        <ul>
          <li
            v-for="item in localeList"
            :key="item.key"
            @click="switchLang(item.key)"
          >
            <img src="~/assets/img/icon/radio1.png" v-if="item.key == lang" />
            <img src="~/assets/img/icon/radio2.png" v-else />
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
      width: 130px;
      height: 40px;
      border-radius: 20px;
      border: 1px solid #ffffff;
      margin-left: 20px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      img {
        width: 20px;
        height: 20px;
        margin-left: 4px;
      }
    }
    .hint_box {
      display: none;
      position: absolute;
      top: 35px;
      margin-top: 8px;
      z-index: 9;
      ul {
        background: #ffffff;
        border-radius: 10px;
        width: 130px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        li {
          height: 40px;
          display: flex;
          align-items: center;
          padding-left: 10px;
          color: #1d2023;
          font-size: 14px;
          img {
            margin-right: 10px;
            width: 16px;
            height: 16px;
          }
          &:hover {
            background: #e8eaec;
          }
        }
      }
    }
  }
  .langauage:hover {
    img {
      transform: rotate(180deg);
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