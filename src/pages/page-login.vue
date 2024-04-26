<template>
  <div class="pa-4">Redirecting...</div>
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
    const { t: token, ...query } = this.$route.query;
    if (token) {
      this.$setStore({
        loginData: {
          token: decodeURIComponent(token),
        },
      });
    }
    if (!this.token) {
      location.href = this.$getHomeUrl("/quick-login?type=chat");
    } else {
      this.$router.replace({
        path: "/",
        query,
      });
    }
  },
};
</script>