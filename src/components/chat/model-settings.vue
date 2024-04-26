<template>
  <div class="h-flex h100p" v-if="curItem">
    <div class="pa-3 bdb-1 bg-pink0">
      <div class="al-c">
        <jazz-icon hash="test" :size="30"></jazz-icon>
        <span class="fz-15 ml-2">{{ curItem.name }}</span>

        <div class="ml-auto pr-2- bg-white- bdrs-6 al-c">
          <!-- <q-toggle v-model="checked" size="xs" /> -->
          <img
            src="/img/settings2.svg"
            width="20"
            class="hover-1 ml-1"
            @click="onBack"
          />
        </div>
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
        <div class="label-1">Description (system propmt)</div>
        <q-input
          outlined
          bg-color="white"
          dense
          autogrow
          maxlength="1500"
        ></q-input>

        <div class="mt-2 al-c">
          <div class="flex-1">
            <div class="al-c label-1">
              <span class="mr-1">Max Tokens</span>
              <q-btn icon="info_outline" flat size="xs" dense>
                <q-tooltip
                  class="bg-white gray bd-1"
                  anchor="top right"
                  self="center middle"
                >
                  this is a test
                </q-tooltip>
              </q-btn>
            </div>
            <q-slider
              v-model="standard"
              :min="0"
              :max="100"
              dense
              track-size="4px"
              thumb-size="14px"
              thumb-color1="white"
            />
          </div>
          <q-input
            v-model="val"
            class="ml-3 tiny-input ta-r"
            bg-color="white"
            outlined
            dense
            style="width: 80px"
          />
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      aiModels: (s) => s.aiModels,
      configModelId: (s) => s.configModelId,
    }),
    curItem() {
      return this.aiModels.find((it) => it.id == this.configModelId);
    },
  },
  data() {
    return {
      checked: false,
      standard: 10,
      val: "10",
    };
  },
  methods: {
    onBack() {
      this.$setState({
        configModelId: null,
      });
    },
  },
};
</script>