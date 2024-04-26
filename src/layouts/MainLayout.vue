<style lang="scss">
</style>

<script setup>
import MainHeader from "./main-header.vue";
</script>

<template>
  <div class="px-4">
    <main-header />
    <q-layout
      v-if="token"
      view="lHh Lpr lFf"
      class="bd-1 bdrs-8 bg-white max-wrap"
      container
      :style="{
        height: 'calc(100vh - 56px - 12px)',
      }"
    >
      <q-drawer
        :width="320"
        v-model="isOpen"
        show-if-above
        bordered
        :breakpoint="900"
        style="background: #f8f3fe"
      >
        <model-list v-show="!configModelId" />
        <model-settings v-show="!!configModelId" />
      </q-drawer>

      <q-page-container>
        <div class="d-flex h100p">
          <div class="h100p pa-1 bdr-1 al-c f-center hover-1" @click="onToggle">
            <img
              src="/img/ic-left.svg"
              class="d-b"
              width="6px"
              :class="{
                'up-down': !isOpen,
              }"
            />
          </div>
          <div class="h100p flex-1">
            <router-view />
          </div>
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    ...mapState({
      token: (s) => s.loginData.token,
      configModelId: (s) => s.configModelId,
    }),
  },
  mounted() {
    this.$bus.on("toggleMenu", () => {
      this.onToggle();
    });
  },
  methods: {
    onToggle() {
      this.isOpen = !this.isOpen;
    },
    onClose() {
      if (this.$q.screen.xs) {
        this.isOpen = false;
      }
    },
  },
};
</script>
