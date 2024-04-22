import PageChat from "pages/chat/page-chat.vue";
import PageLogin from "pages/page-login.vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: PageChat }],
  },
  {
    path: "/login",
    component: PageLogin,
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
