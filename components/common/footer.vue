<template>
  <div class="footer-container">
    <ul>
      <li>
        <!-- <a href="/Download"> -->
        <a href="/security" target="_blank">
          <img src="~/assets/img/footer/Security@2x.png" />
          <p>Security</p>
        </a>
      </li>
      <li>
        <a href="https://twitter.com/payasoio" target="_blank">
          <img src="~/assets/img/footer/twitter@2x.png" />
          <p>Twitter</p>
        </a>
      </li>
      <li>
        <a href="https://payaso-io.medium.com/" target="_blank">
          <img src="~/assets/img/footer/Medium@2x.png" />
          <p>medium</p>
        </a>
      </li>
      <li>
        <a href="https://t.me/payaso_io" target="_blank">
          <img src="~/assets/img/footer/telegram@2x.png" />
          <p>Telegram</p>
        </a>
      </li>
      <li>
        <a href="https://discord.com/invite/pNqEPrD" target="_blank">
          <img src="~/assets/img/footer/discord@2x.png" />
          <p>Discord</p>
        </a>
      </li>
      <li>
        <a href="https://github.com/payaso-protocol/" target="_blank">
          <img src="~/assets/img/footer/github@2x.png" />
          <p>Github</p>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "p-footer",
};
</script>
<style lang="scss" scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .footer-container {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-f;
    display: flex;
    position: absolute;
    left: 0px;
    bottom: 0px;
    li {
      display: inline-block;
      margin: 0px 20px;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          height: 18px;
          width: auto;
        }
        p {
          font-size: 14px;
          color: $text-d;
          padding-top: 4px;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .footer-container {
    width: 100%;
    height: 192px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $bg-f;
    display: flex;
    position: absolute;
    left: 0px;
    bottom: 0px;

    li {
      display: inline-block;
      width: 32%;
      margin: 10px 0;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img {
          height: 24px;
          width: auto;
        }
        p {
          font-size: 14px;
          color: $text-d;
          padding-top: 4px;
        }
      }
    }
  }
}
</style>