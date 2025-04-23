export enum AccountTypes {
    'LDAP' = 'LDAP',
    'Local' = 'Локальная'
}

export interface ILabel {
    text: string;
}

export interface IAccount {
    id: number;
    labels: ILabel[];
    type: AccountTypes;
    login: string;
    password: string | null;
    isValid?: boolean;
}