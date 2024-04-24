<style lang="scss">
.msg-item-con {
  border-top-left-radius: 0;
  .bg-con {
    background: #f1f5f9;
  }
  &:hover .bg-con {
    background: #f8fafc;
  }
}
.msg-item {
  .expander {
    padding: 0 3px;
    .icon-down {
      margin-top: 4px;
      &.up-down {
        margin-top: 12px;
      }
    }
  }
  .expander:hover {
    .icon-down {
      margin-top: 12px;
      &.up-down {
        margin-top: 4px;
      }
    }
  }
}
</style>

<template>
  <div class="d-flex msg-item mb-5 hover-wrap">
    <div>
      <jazz-icon :hash="modelId" />
    </div>
    <div class="ml-2">
      <div class="d-flex mb-1 fz-13">
        <a
          class="al-c hover-1"
          :href="$getHomeUrl('/ai-rpc/model/' + encodeURIComponent(modelId))"
          target="_blank"
        >
          <span v-if="modelRow">{{ modelRow.name }}</span>
          <span v-else>{{ modelId }}</span>
          <img src="/img/ic-link.svg" width="12" class="ml-2" />
        </a>
      </div>

      <div class="d-flex">
        <div class="d-flex bd-1 bdrs-8 ov-h msg-item-con">
          <div class="px-3 py-2 bg-con fz-16">
            <div
              :class="{
                'line-3': !isEpand,
              }"
            >
              <md-con :content="mdCon" />
            </div>
          </div>

          <div
            class="bdl-1 expander al-c f-center bg-bd hover-1 select-none"
            @click="isEpand = !isEpand"
          >
            <div class="h-flex ev-n">
              <img
                src="/img/ic-down.svg"
                width="10"
                class="icon-up trans-200"
                :class="{
                  'up-down': !isEpand,
                }"
              />
              <img
                src="/img/ic-down.svg"
                width="10"
                class="icon-down trans-200"
                :class="[
                  {
                    'up-down': isEpand,
                  },
                ]"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-1 al-c gray op-9">
        <span>~{{ tokenNum }} tokens</span>
        <div class="al-c ml-2 hover-show">
          <img
            v-show="!streaming"
            src="/img/ic-refresh.svg"
            width="14"
            class="hover-1 mr-2"
            @click="onUpdate"
          />
          <img
            v-show="mdCon"
            src="/img/ic-copy.svg"
            width="14"
            class="hover-1 mr-2"
            @click="$copy(mdCon)"
          />
          <img
            src="/img/ic-delete.svg"
            width="14"
            class="hover-1 mr-2"
            @click="onDel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "quasar";
import { mapState } from "vuex";
import mixin from "./msg-item";

export default {
  mixins: [mixin],
  props: {
    rowId: String,
    info: Object,
    modelId: String,
    text: Array,
  },
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
    }),
    modelRow() {
      return this.aiModels.find((it) => it.id == this.modelId);
    },
    mdCon() {
      return this.resMsg || this.info.content;
    },
  },
  data() {
    return {
      isEpand: false,
      apiKey: "40b0f112f10ee8d0958e06f54b7b7cd6",
    };
  },
  watch: {
    resMsg() {
      this.setNewContent();
    },
  },
  created() {
    this.setNewContent = debounce(this.setContent, 300);
    this.tokenNum = this.info.tokens || 0;
    if (!this.info.content) {
      this.fetchAi();
    }
  },
  methods: {
    onDel() {
      this.updateLog({
        _delete: true,
      });
    },
    onUpdate() {
      this.updateLog({
        content: "",
      });
      this.fetchAi();
    },
    setContent() {
      if (!this.resMsg) return;
      // console.log(this.info.id, this.resMsg);
      this.updateLog({
        content: this.resMsg,
        spend: Date.now() - this.beginAt,
        tokens: this.tokenNum,
      });
    },
    updateLog(body) {
      this.$store.commit("updateChatLog", {
        id: this.info.id,
        ...body,
      });
    },
  },
};
</script>