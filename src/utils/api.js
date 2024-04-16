import Axios from "axios";
import store from "../store";
import router from "../router";

const { VITE_BASE_URL: baseURL } = import.meta.env;

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
      config.headers["token"] = token;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  async (res) => {
    // const data = res.data;
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
  if (status == 4011) {
    let isRefresh = false;
    if (status != 403) {
      refreshing = true;
      isRefresh = await getRefreshToken();
    }
    if (isRefresh) {
      pendingQueue.forEach(({ config, resolve }) => {
        resolve(http(config));
      });
      return http(config);
    } else {
      console.log("redirect to login");
      store.dispatch("logout");
      const loginPath = "/login";
      if (location.pathname != loginPath) {
        localStorage.loginTo = location.pathname + location.search;
      }
      router.replace({
        path: loginPath,
      });
      return;
    }
  }
  if (!config.noTip) {
    let msg = data.msg || "Unknown error";
    if (msg.length < 50) window.$toast(msg);
    else window.$alert(msg);
  }
}

async function getRefreshToken() {
  const refreshToken = getToken(1);
  if (!refreshToken) {
    return false;
  }
  try {
    const res = await Axios.post(
      baseURL + "/login/refresh",
      {
        refreshToken,
      },
      {
        headers: {
          // Authorization: "Bearer " + getToken(),
        },
      }
    );
    store.dispatch("login", res.data.data);
    return res.status == 200;
  } catch (error) {
    console.log("refresh err", error);
  }
  return false;
}

export default http;
