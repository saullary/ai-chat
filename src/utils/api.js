import Axios from "axios";
import store from "../store";
import router from "../router";

const { VITE_BASE_URL: baseURL, VITE_HOME_URL } = import.meta.env;

// console.log({ baseURL });
const http = Axios.create({
  baseURL,
});

let refreshing = false;
const pendingQueue = [];

function getToken(isRefresh) {
  const key = isRefresh ? "refreshToken" : "token"; //"accessToken";
  return store.state.loginData[key];
}

http.interceptors.request.use(
  (config) => {
    // config.url = config.url.replace("$mp", mpURL);
    let token = getToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  async (res) => {
    const data = res.data;
    if (typeof data == "object" && data && "code" in data) {
      if (data.code != 200 && data.code != "SUCCESS") {
        data.msg = data.message || `${data.code} error`;
        // handleMsg(200, data.code, msg, res.config);
        const pending = await handleError(200, res.config, data);
        if (pending) {
          return pending;
        }
        const error = new Error(data.msg);
        error.code = data.code;
        throw error;
      }
      if ("data" in data) {
        return data;
      }
    }
    return res;
  },
  async (error) => {
    // , status, statusText, config = {}
    const { data = {}, status, config = {} } = error.response || {};
    const msg = data.message || error.message;
    const pending = await handleError(status, config, {
      ...data,
      msg,
    });
    if (pending) {
      return pending;
    }
    error.message = msg;
    // error.code = data.code;
    return Promise.reject(error);
  }
);

async function handleError(status, config, data) {
  if (refreshing) {
    return new Promise((resolve) => {
      pendingQueue.push({
        config,
        resolve,
      });
    });
  }
  // console.log(data);
  if (status == 401) {
    location.href = VITE_HOME_URL + "/ai-rpc?tab=Models&act=login";
  }
  if (!config.noTip) {
    let msg = data.msg || "Unknown error";
    if (msg.length < 50) window.$toast(msg);
    else window.$alert(msg);
  }
}

export default http;
