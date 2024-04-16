<style lang="scss">
.m-wrap {
  max-width: 800px;
  margin: 0 auto;
}
</style>

<script setup>
import ChatList from "./chat-list.vue";
import ChatInput from "./chat-input.vue";
</script>

<template>
  <div
    class="h-flex"
    :style="{
      height: screen.height + 'px',
    }"
  >
    <q-scroll-area
      ref="chatList"
      :thumb-style="thumbStyle"
      class="flex-1"
      @scroll="onScroll"
    >
      <div class="m-wrap">
        <chat-list
          :texts="inputTexts"
          @clear-texts="inputTexts = []"
          @edit-last="onEditLast"
          @scroll-to-btm="scrollToBtm"
        />
      </div>
    </q-scroll-area>

    <div class="m-wrap w100p" v-show="indexId && !lastChatId">
      <chat-input
        ref="chatInput"
        :texts="inputTexts"
        @send="onSend"
        @scroll-to-btm="scrollToBtm(false)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { useQuasar } from "quasar";
let listRef;

export default {
  computed: {
    ...mapState({
      indexId: (s) => s.indexId,
      lastChatId: (s) => s.lastChatId,
    }),
  },
  data() {
    const { screen } = useQuasar();
    return {
      screen,
      thumbStyle: {
        right: "2px",
        width: "3px",
        opacity: 0.35,
      },
      inputTexts: [],
    };
  },
  mounted() {
    listRef = this.$refs.chatList;
    this.scrollToBtm();
  },
  methods: {
    onEditLast() {
      const msg = this.inputTexts.pop();
      const fn = this.$refs.chatInput.onEdit;
      fn && fn(msg);
    },
    onSend(val) {
      this.inputTexts.push(val);
      this.scrollToBtm();
    },
    scrollToBtm(anim = true) {
      this.$nextTick(() => {
        const el = listRef.getScrollTarget();
        const maxH = el.scrollHeight - el.clientHeight;
        // listRef.getScroll().verticalSize
        listRef.setScrollPosition("vertical", maxH, anim ? 160 : 0);
      });
    },
    onScroll(e) {
      // console.log(e.verticalPosition);
    },
  },
};
</script>