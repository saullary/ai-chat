<style lang="scss">
.model-item {
  &.check {
    background: #fff;
    &:hover {
      background: #f3e8ff;
      border-color: #775da655;
      border-color: rgb(119 93 166 / 30%);
    }
  }
  &.uncheck {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    color: #94a3b8;
    &:hover {
      background: #f3e8ff;
      border-color: #775da655;
      border-color: rgb(119 93 166 / 35%);
    }
  }
}
</style>

<template>
  <div class="h-flex h100p">
    <div class="pa-3 bdb-1 bg-pink0">
      <div class="al-c">
        <img src="/img/model.svg" width="30" />
        <span class="fz-18 ml-2">Model</span>

        <q-btn
          class="ml-auto"
          color="primary"
          dense
          unelevated
          :loading="loadingModel"
        >
          <q-icon name="add_circle_outline" size="20px"></q-icon>
          <q-menu
            max-height="360px"
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <q-list dense separator style="min-width: 160px">
              <template v-for="group in modelGroups" :key="group.name">
                <div class="gray fz-12 px-4 py-2">
                  {{ group.name }}
                </div>
                <q-item
                  v-for="row in group.subs"
                  :key="row.id"
                  clickable
                  :active="selected.includes(row.id)"
                  active-class="bg-f1 gray-3"
                  @click="onSelect(row.id)"
                >
                  <q-item-section>
                    <span class="py-1">{{ row.name }}</span>
                  </q-item-section>
                </q-item>
                <q-separator />
              </template>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- <q-btn class="ml-3 bg-white bd-1" dense flat>
          <img src="/img/trash.svg" width="22" class="px-2p" />
        </q-btn> -->
      </div>
    </div>
    <q-scroll-area
      class="flex-1"
      :thumb-style="{
        right: '2px',
        width: '3px',
        opacity: 0.35,
      }"
    >
      <div class="pa-3">
        <div
          v-for="it in modelOptions"
          :key="it.id"
          class="bd-1 px-3 py-2 bdrs-6 mb-3 model-item pos-r hover-wrap"
          :class="checked.includes(it.id) ? 'check' : 'uncheck'"
        >
          <div class="al-c">
            <jazz-icon :hash="it.id" :size="30"></jazz-icon>
            <span class="ml-2">{{ it.name }}</span>
          </div>
          <div
            class="y-center right-0 mr-3 pr-1 bg-white bdrs-6 al-c hover-show"
          >
            <q-toggle v-model="checked" :val="it.id" size="sm" />
            <img
              v-show="$inDev"
              src="/img/settings.svg"
              width="20"
              class="hover-1 mr-1"
              @click="$toast('In dev')"
            />
          </div>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import Axios from "axios";
import { mapState } from "vuex";

export default {
  data() {
    return {
      loadingModel: false,
      selected: JSON.parse(localStorage.selectedModels || "[]"),
      checked: [],
    };
  },
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
    }),
    modelGroups() {
      const groups = [];
      for (const row of this.aiModels) {
        const { tokenizer } = row.architecture;
        let group = groups.find((it) => it.name == tokenizer);
        if (!group) {
          group = { name: tokenizer, subs: [], num: 0 };
          groups.push(group);
        }
        group.subs.push(row);
      }
      return groups;
    },
    modelOptions() {
      return this.selected
        .map((id) => {
          return this.aiModels.find((it) => it.id == id);
        })
        .filter((it) => !!it);
    },
  },
  watch: {
    checked(val) {
      localStorage.checkedModels = JSON.stringify(val);
      // this.$emit("update-checked", val);
      this.$setState({
        checkModelIds: val,
      });
    },
    selected(val) {
      localStorage.selectedModels = JSON.stringify(val);
    },
  },
  created() {
    this.onInit();
  },
  methods: {
    async onInit() {
      this.checked = JSON.parse(localStorage.checkedModels || "[]");
      await this.getModels();
      let { model } = this.$route.query;
      if (model) {
        const isIn = this.aiModels.find((it) => it.id == model);
        if (!isIn) model = "";
      }
      if (!this.selected.length && !model) {
        model = "openrouter/auto";
      }
      if (model) {
        if (!this.selected.includes(model)) {
          this.onSelect(model);
        } else if (!this.checked.includes(model)) {
          this.checked = [...this.checked, model];
        }
      }
    },
    onSelect(id) {
      const selected = [...this.selected];
      const checked = [...this.checked];
      let index = selected.indexOf(id);
      if (index == -1) {
        selected.push(id);
        checked.push(id);
      } else {
        selected.splice(index, 1);
        index = checked.indexOf(id);
        if (index > -1) checked.splice(index, 1);
      }
      this.selected = selected;
      this.checked = checked;
    },
    async getModels() {
      if (this.aiModels.length) {
        if (Date.now() - localStorage.t_ai_models < 3 * 3600e3)
          return console.log("models", this.aiModels.length);
      }
      try {
        this.loadingModel = true;
        const { data } = await Axios.get("https://openrouter.ai/api/v1/models");
        const rows = data.data.map((it) => {
          delete it.description;
          return it;
        });
        this.$setStore({
          aiModels: rows,
        });
        localStorage.t_ai_models = Date.now();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>