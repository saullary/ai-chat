import { boot } from "quasar/wrappers";
import "../utils/extend";
import api from "../utils/api";
import { setState, setStore } from "../store";
import { EventBus, copyToClipboard } from "quasar";
import Components from "../components";
const { VITE_HOME_URL } = import.meta.env;

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  const global = app.config.globalProperties;

  global.$inDev = /localhost/.test(location.host);
  global.$http = api;

  global.$setState = setState;
  global.$setStore = setStore;

  app.use(Components);

  global.$bus = new EventBus();

  global.$getHomeUrl = (path = "") => {
    return VITE_HOME_URL + path;
  };

  global.$copy = async (txt, msg = "Copied") => {
    await copyToClipboard(txt);
    if (msg) window.$toast(msg, 1);
  };
  global.$sleep = (msec = 300) => {
    return new Promise((reslove) => {
      setTimeout(() => {
        reslove();
      }, msec);
    });
  };

  const winFuns = [
    "toast",
    "alert",
    "confirm",
    "prompt",
    "loading",
    "loadingClose",
  ];
  for (const func of winFuns) {
    global["$" + func] = (...args) => {
      return window["$" + func](...args);
    };
  }
});
