import type {ILabel} from "../store/account/account.types.ts";

export function parseLabelToString (input: string): ILabel[] {
    return input
        .split(';')
        .map(label => label.trim())
        .filter(label => label.length > 0)
        .map(text => ({text}));
}