<style lang="scss">
.q-drawer-container {
}
</style>

<script setup>
import drawerView from "./drawer-view.vue";
</script>

<template>
  <div class="px-4">
    <div class="al-c max-wrap py-3">
      <a href="/">
        <img
          src="https://dashboard.4everland.org/img/svg/logo.svg"
          style="height: 24px"
        />
      </a>
    </div>
    <q-layout
      view="lHh Lpr lFf"
      class="bd-1 bdrs-8 bg-white max-wrap"
      container
      style="height: 600px"
    >
      <div class="pos-a pa-2 z-10">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="onToggle"
        />
      </div>

      <q-drawer
        :width="320"
        v-model="isOpen"
        show-if-above
        bordered
        :breakpoint="900"
        style="background: #f8f3fe"
      >
        <drawer-view @close="onClose" />
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    };
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
