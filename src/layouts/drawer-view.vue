<template>
  <div>
    <div class="pa-3 pos-s top-0 bdb-1" style="background: #fcf9ff">
      <div class="al-c">
        <img src="/img/model.svg" width="30" />
        <span class="fz-18 ml-2">Model</span>
        <q-btn class="ml-auto" color="primary" dense unelevated>
          <q-icon name="add_circle_outline" size="20px"></q-icon>
        </q-btn>
        <q-btn class="ml-3 bg-white bd-1" dense flat>
          <img src="/img/trash.svg" width="22" class="px-2p" />
        </q-btn>
      </div>
    </div>
    <div class="pa-3">
      <div class="bd-1 bg-white px-3 py-2 bdrs-6">
        <div class="al-c">
          <jazz-icon hash="test"></jazz-icon>
          <span class="ml-2">Chat GPT-3.5</span>
        </div>
      </div>
    </div>
  </div>
</template>