<style lang="scss">
.chat-input {
  textarea {
    max-height: 200px;
  }
}
</style>

<script setup>
import ChatSetting from "./chat-input-setting.vue";
</script>

<template>
  <div v-if="indexItem.byShare">
    <q-separator color="gray" class="op-3" />
    <div class="pa-2 mb-2 ta-c">
      <q-btn icon="near_me" flat color="primary" dense @click="onMyChat">
        {{ $t("startMyChat") }}
      </q-btn>
    </div>
  </div>
  <div class="chat-input" v-else>
    <div class="px-3">
      <div class="d-flex al-end">
        <div class="pa-1 mr-1 hover-1" @click="$refs.setting.showPop = true">
          <img src="img/setting.svg" width="26" />
        </div>
        <q-input
          ref="input"
          class="flex-1 s-mb-2"
          :class="{
            'bd-primary': recSeconds,
          }"
          outlined
          :filled="!inRecord"
          :readonly="inRecord || detecting"
          dense
          clearable
          v-model="inputVal"
          autogrow
          maxlength="1500"
          :placeholder="hint"
          @focus="onFocus"
          @keyup.enter="onEnter"
          @click="clickInput"
        />
        <div class="py-2 px-1 ml-1" v-if="detecting">
          <q-spinner-oval color="primary" size="25px" />
        </div>
        <div
          v-else
          class="pa-1 hover-1 ml-1"
          :class="{
            anim_show: inRecord,
          }"
          @click="onSend"
        >
          <img class="ev-n" :src="sendImg" width="26" />
        </div>
      </div>
      <div
        class="pa-3 ta-c fz-14 fw-b gray"
        :class="{
          'text-primary': showSendTip || showVoiceTip,
          'hover-1': showVoiceTip,
        }"
        @click="onBtmTip"
      >
        {{ btmTip }}
      </div>
    </div>
  </div>
  <chat-setting ref="setting" />
</template>

<script>
import mixin from "./chat-input.js";

export default {
  mixins: [mixin],
  emits: ["send", "scroll-to-btm"],
  props: {
    texts: Array,
  },
  data() {
    return {
      isTouch: "ontouchstart" in window,
      inputVal: "",
    };
  },
  computed: {
    sendImg() {
      if (this.inRecord && this.recSeconds > 0) return "img/recording.svg";
      return this.trimVal ? "img/send.svg" : "img/record.svg";
    },
    hint() {
      if (this.detecting) return `${this.$t("translating")}...`;
      if (this.inRecord) {
        if (this.recSeconds)
          return `${this.$t("recording")} ${this.recSecFix}s / ${this.maxSec}s`;
        return this.$t("recordPrepare");
      }
      if (this.texts?.length) return this.$t("appendTip");
      return this.$t("sendTip");
    },
    trimVal() {
      return (this.inputVal || "").trim();
    },
    hasEmptyLine() {
      return /\n$/.test(this.inputVal);
    },
    showSendTip() {
      return !this.isTouch && this.trimVal;
    },
    showVoiceTip() {
      return this.recSeconds > 0 && !this.inRecord;
    },
    btmTip() {
      if (this.showVoiceTip)
        return this.isPlay
          ? this.$t("stop")
          : `${this.$t("play")} (${this.recSecFix}s)`;
      if (this.hasEmptyLine) return this.$t("enterAgain");
      if (this.showSendTip) return this.$t("enterCtrl");
      return this.$t("btmSlogan");
    },
  },
  methods: {
    onFocus() {
      this.$emit("scroll-to-btm");
    },
    onEdit(val) {
      const gap = this.trimVal ? "\n" : "";
      this.inputVal = val + gap + this.trimVal;
      if (!window.$q.platform.is.ios) {
        this.$refs.input.focus();
      }
    },
    onSend(e) {
      if (!this.trimVal) {
        if (e) {
          this.onRecord();
        }
        return;
      }
      this.$emit("send", this.trimVal);
      this.inputVal = "";
      this.recSeconds = 0;
    },
    onEnter(e) {
      if (!this.trimVal) return;
      if (e.ctrlKey || /\n\n$/.test(this.inputVal)) {
        this.onSend();
      }
    },
  },
};
</script>