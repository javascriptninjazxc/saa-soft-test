import {defineStore} from "pinia";
import type {IAccount} from "./account.types.ts";
import {useLocalStorage} from "../../composables/localstorage.composable.ts";

interface State {
    accounts: IAccount[];
}

export const useAccountStore = defineStore('accounts', {
    state: (): State => ({
        accounts: []
    }),
    actions: {
        updateAccount(updated: IAccount) {
            const index = this.accounts.findIndex(acc => acc.id === updated.id);
            if (index !== -1) {
                this.accounts[index] = { ...updated };
            }
        },
        loadAccountsFromStorage() {
            const localStorageAccounts = useLocalStorage<IAccount[]>().get('accounts');

            if(!localStorageAccounts) {
                console.warn("No accounts found");
                return;
            }

            this.accounts = localStorageAccounts;
        },
        removeAccount(accountId: number) {
            this.accounts = this.accounts.filter(acc => acc.id !== accountId);
        }
    }
});