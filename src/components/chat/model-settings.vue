<template>
  <div class="h-flex h100p">
    <div class="pa-3 bdb-1 bg-pink0">
      <div class="al-c">
        <jazz-icon hash="test" :size="30"></jazz-icon>
        <span class="fz-15 ml-2">ChatGPT3.5</span>

        <div class="ml-auto pr-2 bg-white bdrs-6 al-c">
          <q-toggle v-model="checked" size="xs" />
          <img src="/img/settings2.svg" width="20" class="hover-1 ml-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
    };
  },
};
</script>