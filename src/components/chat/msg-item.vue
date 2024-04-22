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
          v-if="modelRow"
          class="al-c hover-1"
          :href="$getHomeUrl('/ai-rpc/model/' + encodeURIComponent(modelId))"
          target="_blank"
        >
          <span>{{ modelRow.name }}</span>
          <img src="/img/ic-link.svg" width="12" class="ml-2" />
        </a>
        <span v-else>{{ modelId }}</span>
      </div>

      <div class="d-flex">
        <div class="d-flex bd-1 bdrs-8 ov-h msg-item-con">
          <div class="px-3 py-2 bg-con fz-16">
            <div
              :class="{
                'line-3': !isEpand,
              }"
            >
              <md-con content="" />
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
        <!-- <span>3.9s</span> -->
        <div class="ml-2 al-c hover-show">
          <img src="/img/ic-refresh.svg" width="14" class="hover-1" />
          <img src="/img/ic-copy.svg" width="14" class="hover-1 ml-2" />
          <img src="/img/ic-delete.svg" width="14" class="hover-1 ml-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    modelId: String,
    msgId: String,
    text: String,
  },
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
    }),
    modelRow() {
      return this.aiModels.find((it) => it.id == this.modelId);
    },
  },
  data() {
    return {
      isEpand: false,
    };
  },
  methods: {},
};
</script>