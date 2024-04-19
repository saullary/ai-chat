const { VITE_MP_URL } = import.meta.env;

export default {
  emits: ["output-msg"],
  props: {
    model: String,
  },
  data() {
    return {
      apiKey: "",
      streaming: false,
      resMsg: "",
      msgList: [],
    };
  },
  watch: {
    lastChatId(val) {
      // if (!val) this.mySSE?.close();
    },
  },
  methods: {
    onErr(msg) {
      this.resMsg = msg;
      this.outputMsg(msg);
    },
    outputMsg(content) {
      this.$emit("output-msg", {
        content,
        // time: Date.now(),
      });
      // this.resMsg = "";
      this.streaming = false;
      if (!this.showPop) this.setDone();
      else this.willDone = true;
    },
    setDone() {
      this.$setState({
        finishModels: [...this.finishModels, this.model],
      });
    },
    onAiChat(texts) {
      if (!texts) {
        this.resMsg = "Loading";
        return;
      }
      try {
        this.streaming = true;
        const msgs = texts.map((content) => {
          return {
            role: "user",
            content,
          };
        });
        const body = this.getPayload(msgs);
        const source = new window.SSE(
          VITE_MP_URL + "/v1/chat/completions",
          body
        );
        source.addEventListener("message", (e) => {
          try {
            const json = JSON.parse(e.data);
            // console.log(this.model, json);
            if (json.error) {
              this.onErr(json.error.message);
              return;
            }
            const text = json.choices[0].delta?.content || "";
            this.resMsg = this.resMsg + text;
          } catch (error) {
            // console.log(this.model, e.data, 2);
            if (e.data == "[DONE]") {
              this.outputMsg(this.resMsg);
            }
          }
        });
        source.addEventListener("error", (e) => {
          let msg = "Network Error";
          try {
            if (e.data) {
              const data = JSON.parse(e.data);
              msg = data.error.message || data.error.code;
            }
          } catch (error) {
            //
          }
          console.log(msg, e);
          this.onErr(msg);
        });
        source.addEventListener("abort", () => {
          if (!this.streaming) {
            return;
          }
        });
        source.stream();
        this.mySSE = source;
      } catch (error) {
        console.log(error);
        this.onErr(error.message);
      }
    },
    getPayload(messages = [], opt = {}) {
      const body = {
        model: this.model,
        messages,
        stream: true,
        ...opt,
      };
      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        method: "POST",
        payload: JSON.stringify(body),
      };
    },
  },
};
