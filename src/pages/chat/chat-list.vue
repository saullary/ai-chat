<template>
  <div class="pa-4">
    <template v-for="it in showChatLogs" :key="it.id">
      <msg-item
        v-if="it.model"
        :rowId="it.id"
        :modelId="it.model"
        :text="getText(it)"
      />
      <msg-sent v-else :rowId="it.id" :text="it.content" />
    </template>
  </div>
</template>

<script>
import md5 from "md5";
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
      checkModelIds: (s) => s.checkModelIds,
      chatLogs: (s) => s.chatLogs,
    }),
    checkModels() {
      return this.checkModelIds
        .map((id) => {
          return this.aiModels.find((it) => it.id == id);
        })
        .filter((it) => !!it);
    },
    showChatLogs() {
      return this.chatLogs.filter((it) => {
        if (it.model) {
          return this.checkModelIds.includes(it.model);
        }
        return true;
      });
    },
  },
  watch: {},
  created() {
    this.$bus.on("send-msg", (msg) => {
      this.onSendMsg(msg);
    });
  },
  methods: {
    getMsgId(mm = "") {
      const rand = (Math.random() + "").substring(0, 4);
      return "msg-" + md5(Date.now() + rand + mm).substring(0, 8);
    },
    onSendMsg(content) {
      const id = this.getMsgId();
      const list = [
        {
          content,
          id,
          createAt: Date.now(),
        },
      ];
      const jobModelIds = [];
      for (const row of this.checkModels) {
        jobModelIds.push(row.id);
        list.push({
          con_id: id,
          id: this.getMsgId(row.id),
          model: row.id,
          createAt: Date.now(),
        });
      }
      this.$setStore({
        chatLogs: [...this.chatLogs, ...list],
      });
      this.$setState({
        jobModelIds,
      });
      this.$bus.emit("chat-to-btm", true);
    },
    getText(it) {
      if (it.model) {
        const msgRow = this.chatLogs.find((log) => log.id == it.con_id);
        if (msgRow) return [msgRow.content];
        return this.chatLogs.filter(
          (log) => !log.model && log.createAt < it.createAt
        );
      }
      return it.content;
    },
  },
};
</script>