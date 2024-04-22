<template>
  <div class="pa-4">
    <msg-sent text="test"></msg-sent>
    <msg-item :modelId="id" v-for="id in checkModelIds" :key="id"></msg-item>
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