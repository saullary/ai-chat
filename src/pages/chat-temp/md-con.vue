
<template>
  <div style="" v-if="!content">
    <div class="mt-6" v-for="i in 2" :key="i">
      <q-skeleton type="text" width="100%" />
      <q-skeleton type="text" width="80%" />
      <q-skeleton type="text" width="65%" />
    </div>
  </div>
  <div v-else>
    <div class="md-con" v-html="htmlCon"></div>
    <div v-if="loading" class="ta-c py-2 mt-1 op-2">
      <q-spinner-hourglass size="34px" />
    </div>
    <div v-else class="pt-9 mt-3 mb-3 ta-c">
      <img src="img/ai-bg.svg" width="50" class="op-2" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
    loading: Boolean,
  },
  computed: {
    htmlCon() {
      return window.markdownIt
        .render(this.content)
        .replace(/<a\s/gm, '<a target="_blank" ')
        .replace('target="_blank" href="#', 'href="#');
    },
  },
};
</script>

<style lang="scss" >
.md-con {
  font-size: 15px;
  line-height: 1.6;
  word-break: break-word;
  pre {
    white-space: pre-wrap;
    tab-size: 2;
  }
  h1,
  h2,
  h3 {
    margin: 10px 0;
  }
  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 20px;
  }
  h3 {
    font-size: 18px;
  }
  p {
    margin-bottom: 10px;
  }
  ol {
    margin: 0 0 10px;
    padding-left: 20px;
    li {
      margin-top: 10px;
      color: #444;
      font-size: 14px;
    }
  }
}
</style>
