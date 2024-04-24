<template>
  <q-btn flat dense class="bg-white bd-1" @click="isEpand = !isEpand">
    <span class="fz-13 mr-auto px-2 ta-l lh-15" style="min-width: 120px">{{
      keyName
    }}</span>
    <img
      src="/img/ic-down.svg"
      width="14"
      class="icon-down trans-200 mr-1"
      :class="[
        {
          'up-down': isEpand,
        },
      ]"
    />
    <q-menu
      transition-show="jump-down"
      transition-hide="jump-up"
      @before-hide="isEpand = false"
    >
      <q-list dense separator style="min-width: 160px">
        <q-item
          clickable
          v-close-popup
          v-for="it in keyList"
          :key="it.id"
          :active="it.key == apiKey"
          @click="onItem(it)"
        >
          <q-item-section>
            <span>{{ it.name }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      keyList: (s) => s.keyList,
      apiKey: (s) => s.apiKey,
    }),
    keyName() {
      const item = this.keyList.find((it) => it.key == this.apiKey);
      if (item) return item.name;
      return "Choose Key";
    },
  },
  data() {
    return {
      isEpand: false,
    };
  },
  watch: {
    isEpand(val) {
      if (val) this.getList();
    },
  },
  created() {
    if (!this.apiKey) this.getList();
  },
  methods: {
    onItem(it) {
      this.$setStore({
        apiKey: it.key,
      });
    },
    async getList() {
      try {
        const { data } = await this.$http.get("/rpc/ai/manager/keys");
        this.$setStore({
          keyList: data.items,
        });
        if (!this.apiKey && this.keyList.length) {
          this.onItem(this.keyList[0]);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>