import {computed, reactive} from "vue";
import {AccountTypes, type IAccount} from "../store/account/account.types.ts";
import {useAccountStore} from "../store/account/account.store.ts";

export type ErrorsType = {
    login?: string;
    password?: string;
    label?: string;
}

const accountsStore = computed(() => {
    return useAccountStore();
})

const errors = reactive<Record<string, ErrorsType>>({});

const validateAccount = (account: IAccount, labelInput: string): void => {
    if (!errors[account.id]) {
        errors[account.id] = {}
    }

    const accErrors = errors[account.id];

    if (!account.login?.trim()) {
        accErrors.login = 'Логин обязателен';
    } else if (account.login.length > 100) {
        accErrors.login = 'Макс. 100 символов';
    } else {
        delete accErrors.login;
    }

    if (account.type === AccountTypes.Local) {
        if (!account.password?.trim()) {
            accErrors.password = 'Пароль обязателен';
        } else if (account.password.length > 100) {
            accErrors.password = 'Макс. 100 символов';
        } else {
            delete accErrors.password;
        }
    } else {
        delete accErrors.password;
    }

    if (labelInput && labelInput.length > 50) {
        accErrors.label = 'Макс. 50 символов';
    } else {
        delete accErrors.label;
    }

    errors[account.id] = accErrors;
}

const isAccountValid = (accountId: number): boolean => {
    const accErrors = errors[accountId];
    return !accErrors || Object.keys(accErrors).length === 0;
}

const hasFieldChanged = (localAccount: IAccount, key: keyof IAccount): boolean => {
    const storeAccount = accountsStore.value.accounts.find(a => a.id === localAccount.id);
    if (!storeAccount) return true;

    // Если элемент empty - тогда сообщяем, чтобы валидация с ошибками появилась;
    const isEmpty = localAccount[key] === '' || localAccount[key]?.toString().length === 0;

    if(isEmpty) return true;

    return localAccount[key] !== storeAccount[key];
}

export const useAccountValidation = () => ({
    errors,
    validateAccount,
    isAccountValid,
    hasFieldChanged
})