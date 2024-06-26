import { createStore } from "vuex";

const SET_DATA = "setData";

const storInit = {
  loginData: {},
  userInfo: {},
  aiModels: [],
  chatLogs: [],
  keyList: [],
  apiKey: "",
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
    checkModelIds: [],
    jobModelIds: [],
    configModelId: null, // for settings
  },
  getters: {},
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
    updateChatLog(state, body) {
      const chatLogs = [...state.chatLogs];
      const idx = chatLogs.findIndex((it) => it.id == body.id);
      if (idx == -1) {
        return console.log("chat not found", body);
      }
      if (body._delete) {
        chatLogs.splice(idx, 1);
      } else {
        chatLogs[idx] = {
          ...chatLogs[idx],
          ...body,
        };
      }
      setStore({
        chatLogs,
      });
    },
  },
  actions: {},
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
