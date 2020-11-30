<template>
  <div class="security">
    <Banner></Banner>
    <Download></Download>
  </div>
</template>

<script>
import Banner from '~/components/security/banner';
import Download from '~/components/security/download';
export default {
  layout: 'default',
  components: { Banner, Download },
};
</script>

<style>
</style>