import { makeAutoObservable, runInAction } from "mobx";
import type { CustomerWithToken } from "../types";
import { LocalStorageState } from "../services/localstorage";
import { getAnonymousUser, getRefreshedToken } from "../services/commercetoolsApi";

class UserStore {
    private shadowIsAuthorized: boolean;
    private shadowUser: null | CustomerWithToken;
    private localStorageState: LocalStorageState;

    constructor() {
        this.shadowIsAuthorized = false;
        this.shadowUser = null;
        this.localStorageState = new LocalStorageState();
        this.getCustomerFromLocalStorage().then();
        makeAutoObservable(this);
    }

    async updateToken() {
        const savedCustomer = this.localStorageState.getField("customer");

        if (savedCustomer) {
            try {
                const refreshToken = savedCustomer.token.refresh_token;
                const result = await getRefreshedToken(refreshToken);
                savedCustomer.token = result;
                savedCustomer.token.refresh_token = refreshToken;
                this.setUser(savedCustomer);
            } catch {
                runInAction(() => {
                    this.setUser(null);
                });
            }
        }
    }

    async getCustomerFromLocalStorage() {
        const savedCustomer = this.localStorageState.getField("customer");

        if (savedCustomer) {
            const tokenExpiresIn = Math.max(
                0,
                Number(savedCustomer.token.expires_at || 0) - Date.now() - 10000
            );

            setTimeout(() => this.updateToken(), tokenExpiresIn);

            runInAction(() => {
                this.shadowIsAuthorized = !!savedCustomer.user;
                this.shadowUser = savedCustomer;
            });
        } else {
            const user = await getAnonymousUser();

            runInAction(() => {
                this.shadowIsAuthorized = false;
                this.shadowUser = user;
            });

            const tokenExpiresIn = Math.max(0, Number(user?.token.expires_at || 0) - Date.now() - 10000);

            setTimeout(() => this.updateToken(), tokenExpiresIn);

            this.localStorageState.setField("customer", this.shadowUser);
            this.localStorageState.saveState();
        }
    }

    setIsAuth(value: boolean) {
        this.shadowIsAuthorized = value;
    }

    async setUser(value: null | CustomerWithToken) {
        if (value) {
            runInAction(() => {
                this.shadowUser = value;
            });

            const tokenExpiresIn = Math.max(0, Number(value.token.expires_at || 0) - Date.now() - 10000);

            setTimeout(() => this.updateToken(), tokenExpiresIn);
        } else {
            const user = await getAnonymousUser();

            runInAction(() => {
                this.shadowUser = user;
            });
        }

        this.localStorageState.setField("customer", this.shadowUser);
        this.localStorageState.saveState();
    }

    getUser(): CustomerWithToken | null {
        return this.shadowUser;
    }

    get isAuthorized() {
        return this.shadowIsAuthorized;
    }

    get user() {
        return this.shadowUser;
    }
}

export { UserStore };
