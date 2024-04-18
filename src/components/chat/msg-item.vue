<style lang="scss">
.msg-item-con {
  border-top-left-radius: 0;
}
.msg-item {
  .expander {
    padding: 0 3px;
    .icon-down {
      margin-top: 4px;
      &.up-down {
        margin-top: 12px;
      }
    }
  }
  .expander:hover {
    .icon-down {
      margin-top: 12px;
      &.up-down {
        margin-top: 4px;
      }
    }
  }
}
</style>

<template>
  <div class="d-flex msg-item">
    <div>
      <jazz-icon hash="test1" />
    </div>
    <div class="ml-2">
      <a class="al-c mb-1" href="/" target="_blank">
        <span>ChatGPT 3.5</span>
        <img src="/img/ic-link.svg" width="16" class="ml-2" />
      </a>
      <div class="d-flex bd-1 bdrs-8 ov-h msg-item-con">
        <div class="px-3 py-2 bg-gray-f8 fz-16">
          <span>Hello! How can I assist you today?</span>
        </div>
        <div
          class="bdl-1 expander al-c f-center bg-bd hover-1"
          @click="isEpand = !isEpand"
        >
          <div class="h-flex">
            <img
              src="/img/ic-down.svg"
              width="10"
              class="icon-up"
              :class="{
                'up-down': !isEpand,
              }"
            />
            <img
              src="/img/ic-down.svg"
              width="10"
              class="icon-down trans-200"
              :class="[
                {
                  'up-down': isEpand,
                },
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
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