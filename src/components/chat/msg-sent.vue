<style lang="scss">
.msg-sent-con {
  border-top-right-radius: 0;
}
</style>

<template>
  <div class="d-flex f-end">
    <div class="mr-2 ta-r">
      <div class="fz-14 op-6 mb-1">Saul</div>
      <div class="d-flex">
        <div>
          <q-btn icon="cached" size="sm" dense flat color="primary"></q-btn>
        </div>
        <div class="msg-sent-con bg-pink1 px-3 py-2 bdrs-8 fz-16">
          <div>hello</div>
        </div>
      </div>
    </div>

    <div>
      <jazz-icon hash="user" />
    </div>
  </div>
</template>