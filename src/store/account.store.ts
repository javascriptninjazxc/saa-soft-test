import {defineStore} from "pinia";

export const useAccountStore = defineStore('accounts', {
    state: () => ({
        accounts: []
    }),
});