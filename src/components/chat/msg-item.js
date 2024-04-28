const { VITE_AI_URL } = import.meta.env;

export default {
  emits: ["output-msg"],
  data() {
    return {
      streaming: false,
      resMsg: "",
      msgList: [],
      tokenNum: 0,
      beginAt: null,
    };
  },
  watch: {},
  created() {},
  methods: {
    onErr(msg) {
      if (msg == "Key not found.") {
        const url = this.$getHomeUrl("/ai-rpc?tab=Keys");
        msg = `API Key required, please create it in [Dashboard](${url})`;
      }
      if (msg == "Balance not enough.") {
        const url = this.$getHomeUrl("/billing/deposit");
        msg = `Insufhcient LAND, please recharge LAND in [Dashboard](${url})`;
        // this.onRecharge();
      }
      this.resMsg = msg;
      this.outputMsg(msg);
    },
    outputMsg(content) {
      this.setContent(content);
      this.resMsg = "";
      this.streaming = false;
      this.mySSE = null;
      this.setDone();
    },
    setDone() {
      // this.$setState({
      //   finishModels: [...this.finishModels, this.model],
      // });
    },
    async onRecharge() {
      try {
        await this.$confirm(
          "Insufhcient LAND, please recharge LAND in Dashboard",
          {
            okLabel: "Deposit LAND",
          }
        );
        window.open(this.rechargeUrl);
      } catch (error) {
        //
      }
    },
    closeAi() {
      if (this.mySSE) {
        this.mySSE.close();
      }
    },
    fetchAi() {
      try {
        this.closeAi();
        this.streaming = true;
        this.tokenNum = 0;
        this.beginAt = Date.now();
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
            if (text) {
              this.tokenNum++;
              this.resMsg = this.resMsg + text;
            }
          } catch (error) {
            if (e.data == "[DONE]") {
              this.outputMsg(this.resMsg);
            }
          }
        });
        source.addEventListener("error", (e) => {
          console.log(11, e);
          let msg = "Network Error";
          if (typeof e.data == "string") {
            try {
              const data = JSON.parse(e.data);
              msg = data.error.message || data.error.code;
            } catch (error) {
              msg = e.data.trim();
            }
          }
          this.onErr(msg);
        });
        source.addEventListener("abort", () => {
          if (!this.streaming) {
            return;
          }
          console.log(this.info.id, "abort");
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
