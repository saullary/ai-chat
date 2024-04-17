<template>
  <div class="al-c pa-3 bdb-1">
    <span class="fz-18">Chat</span>
    <q-select
      style="width: 150px; height: 30px"
      class="ml-auto"
      v-model="apiKey"
      outlined
      dense
      :options="keyOpts"
      map-options
    ></q-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiKey: "",
      keyOpts: [
        {
          label: "test",
          value: "11",
        },
      ],
    };
  },
};
</script>