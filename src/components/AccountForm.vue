<template>
  <div class="account-form">
    <AccountFormHeader @on-add-account="onCreateAccount" />

    <el-alert
          title="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
          type="info"
          show-icon
          class="account-form__alert"
      />

    <el-table :data="localAccounts" style="width: 100%">
      <el-table-column label="Метки" width="250">
        <template #default="{ row }">
          <el-input
              v-model="labelInputs[row.id]"
              placeholder="Метки через ;"
              :class="{ 'is-error': errors[row.id]?.label }"
              @blur="onLabelBlur($event, row)" />
        </template>
      </el-table-column>

      <el-table-column label="Тип записи" width="150">
        <template #default="{ row }">
          <el-select v-model="row.type" @change="onAccountFieldChange(row, 'type')">
            <el-option :label="AccountTypes.LDAP" :value="AccountTypes.LDAP" />
            <el-option :label="AccountTypes.Local" :value="AccountTypes.Local" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Логин">
        <template #default="{ row }">
          <el-input
              v-model="row.login"
              maxlength="100"
              :class="{ 'is-error': errors[row.id]?.login }"
              @blur="onAccountFieldChange(row, 'login')"
          >
            <template #suffix>
              <span v-if="errors[row.id]?.login" style="color: #f56c6c;">
                {{ errors[row.id].login }}
              </span>
            </template>
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="Пароль">
        <template #default="{ row }">
          <el-input
              v-if="row.type === AccountTypes.Local"
              v-model="row.password"
              maxlength="150"
              danger
              show-password
              :class="{ 'is-error': errors[row.id]?.password }"
              @blur="onAccountFieldChange(row, 'password')"
          >
            <template #suffix>
              <span v-if="errors[row.id]?.password" style="color: #f56c6c;">
                {{ errors[row.id].password }}
              </span>
            </template>
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="" width="80">
        <template #default="{ row }">
          <el-button @click="onAccountRemove(row.id)" type="danger" circle>
            <Icon width="21" height="21" color="black" icon="line-md:trash" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {useAccountStore} from "../store/account/account.store.ts";
import {computed, nextTick, onMounted, reactive, ref, toRaw, watch} from "vue";
import {Icon} from "@iconify/vue";
import {AccountTypes, type IAccount} from "../store/account/account.types.ts";
import cloneDeep from 'lodash.clonedeep';
import {useLocalStorage} from "../composables/local-storage.composable.ts";
import {ElNotification} from 'element-plus'
import AccountFormHeader from "./AccountFormHeader.vue";
import {useAccountValidation} from "../composables/account-validation.composable.ts";
import {parseLabelToString} from "../utils/parse.ts";

const {
  errors,
  validateAccount,
  isAccountValid,
  hasFieldChanged,
} = useAccountValidation();

const accountsStore = computed(() => {
  return useAccountStore();
})

const localAccounts = ref<IAccount[]>([]);
const labelInputs = reactive<Record<string, string>>({});

const onAccountFieldChange = (account: IAccount, key: keyof IAccount) => {
  if (!hasFieldChanged(account, key)) return;

  const labelInput = labelInputs[account.id] || '';
  validateAccount(account, labelInput);

  if (isAccountValid(account.id)) {
    saveAccount(account);
  }
}

const onCreateAccount = async () => {
  accountsStore.value.addAccount();
  await nextTick();
}

const onAccountRemove = (accountId: number) => {
  accountsStore.value.removeAccount(accountId);

  useLocalStorage<IAccount[]>().set('accounts', accountsStore.value.accounts);

  ElNotification({
    title: 'Запись успешно стерта!',
    message: `Запись №${accountId} успешно стерта!`,
    position: 'bottom-right',
    type: 'success'
  })
}

const saveAccount = (account: IAccount) => {
  accountsStore.value.updateAccount({ ...account });
  useLocalStorage().set('accounts', accountsStore.value.accounts);

  ElNotification({
    title: 'Запись успешно обновлена!',
    message: `Запись №${account.id} успешно обновлена!`,
    position: 'bottom-right',
    type: 'success'
  })
}

const onLabelBlur = (event: Event, account: IAccount) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.trim();

  const storeAccount = accountsStore.value.accounts.find(storeAcc => storeAcc.id === account.id);

  if(!storeAccount) return;

  account.labels = parseLabelToString(value);

  const labelsEqual = account.labels.every(l =>
      storeAccount.labels.some(sl => sl.text === l.text)
  );

  if(labelsEqual) return;

  if (isAccountValid(account.id)) {
    saveAccount(account);
  }
};

onMounted(() => {
  accountsStore.value.loadAccountsFromStorage();
})

watch(
    () => accountsStore.value.accounts,
    (newAccounts) => {
      localAccounts.value = cloneDeep(toRaw(newAccounts));

      for (const acc of newAccounts) {
        labelInputs[acc.id] = acc.labels?.map(l => l.text).join('; ') || '';
      }
    },
    { immediate: true, deep: true }
);
</script>

<style lang="scss">
.account-form {
  width: 90%;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.is-error .el-input__wrapper {
  border: 1px solid #f56c6c;
}
</style>