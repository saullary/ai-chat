<template>
  <div class="pa-4">
    <msg-sent></msg-sent>
    <msg-item :modelId="i" v-for="i in checkModelIds" :key="i"></msg-item>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
      checkModelIds: (s) => s.checkModelIds,
    }),
  },
};
</script>