<template>
  <q-btn flat dense class="bg-white bd-1" @click="isEpand = !isEpand">
    <span class="fz-13 mr-auto px-2 ta-l lh-15" style="min-width: 120px"
      >Choose Key</span
    >
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
        <q-item clickable v-close-popup v-for="i in 5" :key="i">
          <q-item-section>
            <span>test {{ i }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
export default {
  data() {
    return {
      isEpand: false,
    };
  },
};
</script>