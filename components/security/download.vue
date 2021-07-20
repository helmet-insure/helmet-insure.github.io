<template>
  <div class="security-download">
    <div class="download-title">{{ $t("Content.Security") }}</div>
    <p class="download-text">
      {{ $t("Tips.Tip3") }}
    </p>
    <div class="download-link">
      <a href="/doc/en_US.pdf" target="_blank">
        {{ $t("Content.PDF") }}
      </a>
      <a
        href="https://bscscan.com/address/0x4E76DfeA6Fb3726e9A77628AAa23839E3298BC37"
        target="_blank"
      >
        {{ $t("Content.ViewContractAdress") }}
      </a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang='scss' scoped>
@import "~/assets/css/base.scss";
@media screen and (min-width: 750px) {
  .download-title {
    height: 60px;
    margin-top: 20px;
    line-height: 60px;
    box-shadow: 0px 1px 0px 0px #1d1d1d;
    font-size: 16px;
    font-weight: 500;
  }
  .download-text {
    margin-top: 20px;
    font-size: 14px;
    color: #dbdbdb;
  }
  .download-link {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    a {
      font-size: 14px;
      color: #be3a3b;
      text-decoration: underline;
    }
    a:nth-of-type(2) {
      margin-top: 14px;
    }
  }
}
@media screen and (max-width: 750px) {
  .download-title {
    padding-left: 16px;
    height: 60px;
    margin-top: 30px;
    line-height: 60px;
    box-shadow: 0px 1px 0px 0px #1d1d1d;
    font-size: 16px;
    font-weight: 500;
  }
  .download-text {
    padding: 0 16px;
    margin-top: 20px;
    font-size: 14px;
    color: #dbdbdb;
  }
  .download-link {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    a {
      font-size: 14px;
      color: #be3a3b;
      text-decoration: underline;
    }
    a:nth-of-type(2) {
      margin-top: 14px;
    }
  }
}
</style>