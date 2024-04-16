<template>
  <div>
    <div class="pa-4 pos-s top-0" style="background: #fcf9ff">
      <div class="al-c">
        <span>Model</span>
      </div>
    </div>
    <div>
      <p v-for="i in 30" :key="i">{{ i }}</p>
    </div>
  </div>
</template>