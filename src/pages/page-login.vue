<template>
  <div class="pa-4">{{ token ? "Logged" : "Login..." }}</div>
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
          token,
        },
      });
    }
    if (!this.token) {
      location.href = this.$getHomeUrl(
        "/login?loginTo=" + encodeURIComponent(location.origin)
      );
    }
  },
};
</script>