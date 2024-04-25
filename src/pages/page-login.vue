<template>
  <div class="pa-4">{{ token ? "Signed In" : "Redirecting..." }}</div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      token: (s) => s.loginData.token,
    }),
  },
  created() {
    const { token } = this.$route.query;
    if (token) {
      this.$setStore({
        loginData: {
          token: decodeURIComponent(token),
        },
      });
    }
    if (!this.token) {
      location.href = this.$getHomeUrl("/ai-rpc?tab=Models&act=login");
    } else {
      this.$router.replace("/");
    }
  },
};
</script>