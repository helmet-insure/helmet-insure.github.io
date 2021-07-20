import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default ({ app, store }) => {
  let locale = store.state.locale;
  // let locale = 'en';
  app.i18n = new VueI18n({
    locale: locale,
    fallbackLocale: locale,
    messages: {
      en_US: require("~/locales/en_US.json"),
      zh_CN: require("~/locales/zh_CN.json"),
      // po_TU: require("~/locales/po_TU.json"),
    },
  });

  app.i18n.path = (link) => {
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`;
    }

    return `/${app.i18n.locale}/${link}`;
  };
};
