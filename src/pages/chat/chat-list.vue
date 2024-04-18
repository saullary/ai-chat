<template>
  <div class="pa-4">
    <msg-sent></msg-sent>
    <msg-item v-for="i in 2" :key="i"></msg-item>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>