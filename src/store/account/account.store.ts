import {defineStore} from "pinia";
import type {IAccount} from "./account.types.ts";

interface State {
    accounts: IAccount[];
}

export const useAccountStore = defineStore('accounts', {
    state: (): State => ({
        accounts: [
            {
                id: '1',
                isValid: true,
                labels: [{
                    text: 'Hell'
                }],
                type: 'LDAP',
                login: '123',
                password: '321'
            },
            {
                id: '1',
                isValid: true,
                labels: [{
                    text: 'Гений'
                }],
                type: 'Локальная',
                login: 'albamsd',
                password: '321'
            },
        ]
    }),
    actions: {

    }
});