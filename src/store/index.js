import { createStore } from "vuex";

const SET_DATA = "setData";

const storInit = {
  loginData: {},
  userInfo: {},
  aiModels: [],
  sysLang: "zh",
};
const storState = {
  ...storInit,
};
for (const key in storState) {
  let val = localStorage[key];
  try {
    if (val) storState[key] = JSON.parse(val);
  } catch (error) {
    console.log(key, error);
  }
}

const store = createStore({
  modules: {},
  state: {
    ...storState,
    nowDate: new Date(),
    isFocus: true,
    showProgress: false,
    lastChatId: null,
    finishModels: [],
    indexId: 0,
  },
  getters: {
    indexItem(state) {
      let item = state.indexList.find((it) => it.id == state.indexId);
      if (item) return item;
      item = state.shareList.find((it) => it.id == state.indexId);
      return {
        ...item,
        byShare: true,
      };
    },
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
  actions: {
    login(_, data) {
      setStore({
        loginData: data,
      });
    },
    logout() {
      localStorage.clear();
      setStore({
        ...storInit,
      });
    },
  },
});

export const setState = (data) => {
  store.commit(SET_DATA, data);
};

export const setStore = (data) => {
  for (const key in data) {
    try {
      localStorage[key] = JSON.stringify(data[key]);
    } catch (error) {
      console.log(key, error);
    }
  }
  setState(data);
};

window.onblur = () => {
  setState({
    isFocus: false,
  });
};
window.onfocus = () => {
  setState({
    isFocus: true,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

export default store;
