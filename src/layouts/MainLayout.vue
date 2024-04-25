<style lang="scss">
</style>

<template>
  <div class="px-4">
    <div class="al-c max-wrap py-3">
      <a href="/" class="mr-auto">
        <img
          src="https://dashboard.4everland.org/img/svg/logo.svg"
          style="height: 24px"
        />
      </a>
      <q-btn href="https://docs.4everland.org/" target="_blank" flat dense
        >Docs</q-btn
      >
      <q-btn
        class="ml-4"
        href="https://dashboard.4everland.org/"
        target="_blank"
        flat
        dense
        >Dashboard</q-btn
      >
    </div>
    <q-layout
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
        <!-- <model-list /> -->
        <model-settings />
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
