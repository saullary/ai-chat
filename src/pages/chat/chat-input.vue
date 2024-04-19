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
  .q-field--outlined.q-field--highlighted .q-field__control:after {
    border-width: 1px;
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
    >
      <template #append>
        <q-btn class="send-btn" round color="primary" dense :disable="!trimVal">
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
      inputVal: "",
      composing: false,
    };
  },
  computed: {
    trimVal() {
      return this.inputVal.trim();
    },
  },
  watch: {
    composing() {
      console.log(this.composing);
    },
  },
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
      this.$emit("send", this.trimVal);
      this.inputVal = "";
    },
  },
};
</script>