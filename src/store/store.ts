import { createGlobalObservable, useLocalObservable } from "mobx-vue-lite";
import { UserStore } from "./UserStore";

const UseGlobalObservable = createGlobalObservable(() => {
    return useLocalObservable<{ user: UserStore | null }>(() => ({
        user: null
    }));
});

export { UseGlobalObservable };
