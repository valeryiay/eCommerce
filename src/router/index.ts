import { createRouter, createWebHistory } from "vue-router";
import RootView from "@/views/RootView.vue";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import ProductsView from "@/views/ProductsView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import ContactsView from "@/views/ContactsView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import DetailedPageView from "@/views/DetailedPageView.vue";
import { useAuthStore } from "@/store";
import ProfileView from "@/views/ProfileView.vue";

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
                    path: "/products",
                    name: "products",
                    component: ProductsView,
                },
                {
                    path: "/products/:id",
                    name: "detailed",
                    component: DetailedPageView
                },
                {
                    path: "/categories",
                    name: "categories",
                    component: CategoriesView
                },
                {
                    path: "/profile",
                    name: "profile",
                    component: ProfileView,
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: "/contact",
                    name: "contact",
                    component: ContactsView
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
            component: LoginView,
            meta: {
                requiresNoAuth: true
            }
        },
        {
            path: "/register",
            name: "registration",
            component: RegistrationView,
            meta: {
                requiresNoAuth: true
            }
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: NotFoundView
        }
    ]
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthorized) {
        return { name: "login" };
    }

    if (to.meta.requiresNoAuth && authStore.isAuthorized) {
        return { name: "root" };
    }
});

export default router;
