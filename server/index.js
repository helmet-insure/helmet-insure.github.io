const Koa = require("koa");
// const consola = require('consola')
const { Nuxt, Builder } = require("nuxt");
const ApiConfig = require("../config/api.config.js");
const app = new Koa();

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = app.env !== "production";

async function start() {
  // Instantiate nuxt.js
  const host = process.env.HOST || "0.0.0.0";
  const port = process.env.PORT || 30001;

  const nuxt = new Nuxt(config);

  // const {

  // } = nuxt.options.server

  await nuxt.ready();
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(async (ctx, next) => {
    ctx.req.locale = ctx.cookies.get("lang");
    if (!ctx.req.locale) {
      let acceptLanguage = ctx.req && ctx.req.headers["accept-language"];
      if (acceptLanguage) {
        if (~acceptLanguage.indexOf("zh_CN") > -1) {
          acceptLanguage = "zh_CN";
        }
        if (~acceptLanguage.indexOf("en_US")) {
          acceptLanguage = "en_US";
        }
        // if (~acceptLanguage.indexOf('CN')) {
        //   acceptLanguage = 'zh-cn'
        // }

        if (~["en_US", "zh_CN"].indexOf(acceptLanguage)) {
          ctx.cookies.set("lang", acceptLanguage, {
            domain: ApiConfig.domain,
            maxAge: 3600 * 24 * 10,
            httpOnly: false,
          });
          ctx.req.locale = acceptLanguage;
        }
      }
    } else {
      if (~ctx.req.locale.indexOf("en_US")) {
        ctx.req.locale = "en_US";
      }
    }
    // ctx.req.locale = "en_US";
    await next();
  });

  app.use((ctx) => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host);
  // consola.ready({
  //   message: `Server listening on http://${host}:${port}`,
  //   badge: true
  // })
  console.log(`Server listening on http://${host}:${port}`);
}

start();
