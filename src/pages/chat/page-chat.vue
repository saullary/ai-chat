<script setup>
import ChatList from "./chat-list.vue";
import ChatInput from "./chat-input.vue";
</script>

<template>
  <div class="h-flex h100p">
    <div class="al-c pa-3 bdb-1">
      <span class="fz-18 mr-auto">Chat</span>
      <choose-key-btn />
      <q-btn class="ml-3 bg-white bd-1" dense flat @click="onClearChat">
        <img src="/img/ic-clear.svg" width="20" class="px-2p" />
      </q-btn>
    </div>

    <q-scroll-area
      ref="chatList"
      :thumb-style="thumbStyle"
      class="flex-1"
      @scroll="onScroll"
    >
      <chat-list
        :class="{
          'op-0': !showList,
        }"
      />
    </q-scroll-area>

    <chat-input />
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
      showList: false,
    };
  },
  mounted() {
    listRef = this.$refs.chatList;
    setTimeout(() => {
      this.scrollToBtm(false);
      this.showList = true;
    }, 60);
    this.$bus.on("chat-to-btm", (anim) => {
      this.scrollToBtm(anim);
    });
  },
  methods: {
    getKeys() {
      // /rpc/ai/manager/keys
    },
    scrollToBtm(anim = true) {
      this.$nextTick(() => {
        const el = listRef.getScrollTarget();
        const maxH = el.scrollHeight - el.clientHeight;
        // listRef.getScroll().verticalSize
        listRef.setScrollPosition("vertical", maxH, anim ? 240 : 0);
      });
    },
    onScroll(e) {
      // console.log(e.verticalPosition);
    },
    onClearChat() {
      this.$setStore({
        chatLogs: [],
      });
    },
  },
};
</script>