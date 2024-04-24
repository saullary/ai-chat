const { VITE_AI_URL } = import.meta.env;

export default {
  emits: ["output-msg"],
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
      this.setContent(content);
      this.resMsg = "";
      this.streaming = false;
      this.setDone();
    },
    setDone() {
      // this.$setState({
      //   finishModels: [...this.finishModels, this.model],
      // });
    },
    fetchAi() {
      try {
        this.streaming = true;
        const msgs = this.text.map((content) => {
          return {
            role: "user",
            content,
          };
        });
        const body = this.getPayload(msgs);
        const source = new window.SSE(VITE_AI_URL + "/chat/completions", body);
        source.addEventListener("message", (e) => {
          try {
            const json = JSON.parse(e.data);
            if (json.error) {
              this.onErr(json.error.message);
              return;
            }
            const text = json.choices[0].delta?.content || "";
            this.resMsg = this.resMsg + text;
          } catch (error) {
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
          console.log(this.lastChatId, "abort");
          // let msg = this.resMsg;
          // if (msg) msg += "...\n\n";
          // msg += "Aborted";
          // this.onErr(msg);
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
        model: this.modelId,
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
