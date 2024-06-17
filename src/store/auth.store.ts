import type { Credentials, CustomerWithToken } from "@/types";
import { defineStore } from "pinia";
import { getUser } from "@/services/commercetoolsApi";
import router from "@/router";

const localStorageUserItem = "eCommerceLoggedInUser";

const getLocalStorageUserData = (): CustomerWithToken | null =>
    JSON.parse(localStorage.getItem(localStorageUserItem) || "{}");

const userData = getLocalStorageUserData();

const hasUserDataStored = (): boolean => {
    if (userData?.user) {
        return true;
    }

    return false;
};

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        user: userData,
        isAuthorized: hasUserDataStored()
    }),
    actions: {
        async logIn(credentials: Credentials) {
            try {
                const userResponse: CustomerWithToken = await getUser(credentials);

                if (userResponse instanceof Error) {
                    throw Error(userResponse.message);
                }

                this.user = userResponse;

                localStorage.setItem(localStorageUserItem, JSON.stringify(userResponse));

                this.isAuthorized = true;

                router.push({ path: "/" });
            } catch (error) {
                console.error("Login fail:\n" + error);
                this.isAuthorized = false;

                return error;
            }
        },
        logOut() {
            this.user = null;
            this.isAuthorized = false;

            localStorage.removeItem(localStorageUserItem);

            router.push({ path: "/" });
        },
        async isValidCredentials(credentials: Credentials) {
            try {
                const userResponse: CustomerWithToken | Error = await getUser(credentials);

                if (userResponse instanceof Error) {
                    throw Error(userResponse.message);
                }

                return userResponse.user?.email === credentials.email;
            } catch {
                return false;
            }
        },
        updateUserData(userData: CustomerWithToken) {
            this.user = userData;
            localStorage.setItem(localStorageUserItem, JSON.stringify(userData));
        }
    }
});
