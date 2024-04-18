<script setup>
import ChatList from "./chat-list.vue";
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
  </div>
</template>

<script>
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
  methods: {
    onScroll(e) {
      // console.log(e.verticalPosition);
    },
  },
};
</script>