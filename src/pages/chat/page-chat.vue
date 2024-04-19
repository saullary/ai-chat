<script setup>
import ChatList from "./chat-list.vue";
import ChatInput from "./chat-input.vue";
</script>

<template>
  <div class="h-flex h100p">
    <div class="al-c pa-3 bdb-1">
      <span class="fz-18">Chat</span>
      <!-- <q-select
        style="width: 150px; height: 30px"
        class="ml-auto"
        v-model="apiKey"
        outlined
        dense
        :options="keyOpts"
        map-options
      ></q-select> -->
    </div>

    <q-scroll-area
      ref="chatList"
      :thumb-style="thumbStyle"
      class="flex-1"
      @scroll="onScroll"
    >
      <chat-list />
    </q-scroll-area>

    <chat-input @send="onSend" />
  </div>
</template>

<script>
let listRef;

export default {
  data() {
    return {
      apiKey: "",
      keyOpts: [
        {
          label: "test",
          value: "11",
        },
      ],
      thumbStyle: {
        right: "2px",
        width: "3px",
        opacity: 0.35,
      },
    };
  },
  mounted() {
    listRef = this.$refs.chatList;
    this.scrollToBtm();
  },
  methods: {
    onSend(val) {
      console.log("send", val);
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