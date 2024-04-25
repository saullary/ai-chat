<template>
  <div class="al-c max-wrap py-3">
    <a href="/" class="mr-auto">
      <img
        src="https://dashboard.4everland.org/img/svg/logo.svg"
        style="height: 24px"
      />
    </a>
    <q-btn href="https://docs.4everland.org/" target="_blank" flat dense
      >Docs</q-btn
    >
    <q-btn
      class="ml-4 mr-4"
      href="https://dashboard.4everland.org/"
      target="_blank"
      flat
      dense
      >Dashboard</q-btn
    >
    <q-btn v-if="userInfo.uid" flat class="bg-white">
      <jazz-icon :hash="userInfo.uid" :size="18" />
      <span class="ml-2">{{ userInfo.uname }}</span>
      <img src="/img/ic-down.svg" width="14" class="ml-2" />
      <q-menu
        transition-show="jump-down"
        transition-hide="jump-up"
        @before-hide="isEpand = false"
      >
        <q-list separator>
          <q-item clickable v-close-popup @click="goApiManage">
            <q-item-section>
              <span>API Key Manage</span>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="onLogout">
            <q-item-section>
              <span>Sign Out</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn v-else class="bg-white" :loading="loadingUser" @click="onLogin">
      Sign In
    </q-btn>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      loadingUser: false,
    };
  },
  computed: {
    ...mapState({
      token: (s) => s.loginData.token,
      userInfo: (s) => s.userInfo,
    }),
  },
  created() {
    if (this.token) {
      this.getUserInfo();
    } else {
      this.$confirm("Sign in and start chatting", {
        title: "Notice",
        ok: {
          label: "Sign In",
          color: "primary",
          flat: false,
        },
      }).then(() => {
        this.onLogin();
      });
    }
  },
  methods: {
    onLogin() {
      this.$router.replace("/login");
    },
    goApiManage() {
      window.open(this.$getHomeUrl("/ai-rpc?tab=Keys"));
    },
    onLogout() {
      this.$setStore({
        loginData: {},
        userInfo: {},
      });
    },
    async getUserInfo() {
      try {
        this.loadingUser = true;
        const { data } = await this.$http.get("$auth/user");
        const { uid = "", username } = data;
        data.uname = (username || uid).cutStr(4, 4);
        this.$setStore({
          userInfo: data,
        });
      } catch (error) {
        console.log(error);
      }
      this.loadingUser = false;
    },
  },
};
</script>