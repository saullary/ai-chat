<style lang="scss">
.chat-input {
  textarea {
    max-height: 200px;
  }
  .send-btn {
    transform: scale(0.86);
  }
  .q-field--outlined .q-field__control {
    padding-right: 6px;
  }
  .q-field__append {
    margin-top: auto;
  }
}
</style>

<template>
  <div class="chat-input pa-3 pt-0">
    <q-input
      ref="input"
      class="flex-1 s-mb-2"
      outlined
      dense
      v-model="inputVal"
      autogrow
      maxlength="1500"
      placeholder="Chat or prompt"
      @keyup.enter="onEnter"
      @focus="isFoucs = true"
      @blur="isFoucs = false"
    >
      <template #append>
        <q-btn
          class="send-btn"
          round
          :color="trimVal ? 'primary' : 'info'"
          dense
          :disable="!trimVal"
        >
          <img
            src="/img/send.svg"
            width="20"
            class="pos-r"
            style="left: -1px"
          />
        </q-btn>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFoucs: false,
      inputVal: "",
      composing: false,
    };
  },
  computed: {
    trimVal() {
      return this.inputVal.trim();
    },
  },
  watch: {},
  mounted() {
    const input = this.$refs.input.nativeEl;
    input.addEventListener("compositionstart", () => {
      this.composing = true;
    });
    input.addEventListener("compositionend", () => {
      setTimeout(() => {
        this.composing = false;
      }, 100);
    });
  },
  methods: {
    onEnter() {
      if (this.composing) return;
      if (!this.trimVal) {
        this.inputVal = "";
        return;
      }
      this.$bus.emit("send-msg", this.trimVal);
      this.inputVal = "";
    },
  },
};
</script>