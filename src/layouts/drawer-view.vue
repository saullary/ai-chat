<template>
  <div>
    <div class="pa-3 pos-s top-0 bdb-1" style="background: #fcf9ff">
      <div class="al-c">
        <img src="/img/model.svg" width="26" />
        <span class="fz-18 ml-2">Model</span>
      </div>
    </div>
    <div>
      <p v-for="i in 30" :key="i">{{ i }}</p>
    </div>
  </div>
</template>