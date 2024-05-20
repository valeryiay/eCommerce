import { createRouter, createWebHistory } from "vue-router";
import RootView from "@/views/RootView.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import RegistrationView from "@/views/RegistrationView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "root",
            component: RootView,
            children: [
                {
                    path: "/",
                    name: "home",
                    component: HomeView
                },
                {
                    path: "/about",
                    name: "about",
                    component: AboutView
                }
            ]
        },
        {
            path: "/login",
            name: "login",
            component: LoginView
        },
        {
            path: "/not-found",
            name: "not-found",
            component: NotFoundView
        },
        {
            path: "/registration",
            name: "registration",
            component: RegistrationView
        }
    ]
});

export default router;
