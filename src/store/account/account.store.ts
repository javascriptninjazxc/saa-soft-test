import {defineStore} from "pinia";
import type {IAccount} from "./account.types.ts";

interface State {
    accounts: IAccount[];
}

export const useAccountStore = defineStore('accounts', {
    state: (): State => ({
        accounts: []
    }),
    actions: {

    }
});