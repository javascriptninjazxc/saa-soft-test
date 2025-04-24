import {defineStore} from "pinia";
import {AccountTypes, type IAccount} from "./account.types.ts";
import {useLocalStorage} from "../../composables/local-storage.composable.ts";

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
        addAccount() {
            this.accounts.push({
                id: Math.floor(Math.random() * 1_000_000_000), // Так лучше не делать, но решил оставить раз это тестовое)
                type: AccountTypes.Local,
                labels: [],
                login: '',
                password: null,
            })
        },
        removeAccount(accountId: number) {
            this.accounts = this.accounts.filter(acc => acc.id !== accountId);
        }
    }
});