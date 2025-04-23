<template>
  <div class="account-form">
      <div class="account-form-header">
        <h2 class="account-form-header__title">
          Учетные записи
        </h2>

        <button class="account-form-header__btn">
          +
        </button>
      </div>

      <el-alert
          title="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
          type="info"
          show-icon
          class="mb-4"
      />

    <el-table :data="accounts" style="width: 100%">
      <el-table-column label="Метки" width="250">
        <template #default="{ row }">
          <el-input
              v-model="labelInputs[row.id]"
              placeholder="Метки через ;"
          />
        </template>
      </el-table-column>

      <el-table-column label="Тип записи" width="150">
        <template #default="{ row }">
          <el-select v-model="row.type">
            <el-option label="LDAP" value="LDAP" />
            <el-option label="Локальная" value="Локальная" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Логин">
        <template #default="{ row }">
          <el-input
              v-model="row.login"
              maxlength="100"
              :class="{ 'is-error': row.loginError }"
          />
          <div v-if="row.loginError" class="el-form-item__error">{{ row.loginError }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Пароль">
        <template #default="{ row }">
          <el-input
              v-if="row.type === 'Локальная'"
              v-model="row.password"
              maxlength="100"
              show-password
              :class="{ 'is-error': row.passwordError }"
          />
          <div v-if="row.passwordError" class="el-form-item__error">{{ row.passwordError }}</div>
        </template>
      </el-table-column>

      <el-table-column label="" width="80">
        <template #default="{ row }">
          <el-button type="danger" circle>
            <Icon width="21" height="21" color="black" icon="line-md:trash" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {useAccountStore} from "../store/account/account.store.ts";
import {computed, reactive} from "vue";
import { Icon } from "@iconify/vue";

const accountsStore = computed(() => {
  return useAccountStore();
})

const accounts = accountsStore.value.accounts;

const labelInputs = reactive<Record<string, string>>({});
</script>