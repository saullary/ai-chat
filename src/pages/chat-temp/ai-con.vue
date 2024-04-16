<script setup>
import MdCon from "./md-con.vue";
</script>

<template>
  <div class="px-3" style="min-width: 50px">
    <div class="pos-s top-0 z-100 bg-white ov-a">
      <div class="al-c">
        <q-btn class="shrink-0" @click="showPop = true" flat dense size="sm">
          <q-spinner-comment v-if="streaming" color="orange" size="18px" />
          <q-icon v-else name="fullscreen" size="15px"></q-icon>
          <span class="ml-1 fz-14">{{ modelName }}</span>
        </q-btn>
        <span v-if="resCon" class="ml-auto fz-12 op-4 shrink-0"
          >{{ resCon.length }}字</span
        >
      </div>
    </div>
    <md-con class="mt-2" :content="resCon" :loading="streaming" />
  </div>

  <hqs-popup v-model="showPop">
    <template #title>
      <q-spinner-comment
        v-if="streaming"
        color="orange"
        size="24px"
        class="mr-1"
      />
      <b class="fz-17">{{ modelName }}</b>
      <span v-if="resCon" class="ml-4 fz-13 op-4 shrink-0"
        >{{ resCon.length }}字</span
      >
    </template>

    <md-con :content="resCon" :loading="streaming" />
  </hqs-popup>
</template>

<script>
import mixin from "./ai-con.js";
import { mapState } from "vuex";

export default {
  mixins: [mixin],
  props: {
    model: {
      type: String,
      default: "none",
    },
    texts: Array,
    result: String,
  },
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
      lastChatId: (s) => s.lastChatId,
      finishModels: (s) => s.finishModels,
    }),
    resCon() {
      return this.result || this.resMsg;
    },
    modelName() {
      const item = this.aiModels.find((it) => it.mid == this.model);
      if (item) return item.name;
      return this.model?.replace(/^.+\//, "").toUpperCase();
    },
  },
  data() {
    return {
      showPop: false,
      willDone: false,
    };
  },
  watch: {
    showPop(val) {
      if (!val && this.willDone) {
        this.setDone();
      }
    },
  },
  mounted() {
    if (!this.result) {
      this.onAiChat(this.texts);
    }
  },
};
</script>