<script setup lang="ts">
import {useAccountStore} from "./store/account.store.ts";
import {computed} from "vue";

const store = computed(() => {
  return useAccountStore().test;
})
</script>

<template>
  <div class="app">
    {{store}}
  </div>
</template>

<style lang="scss" scoped>
</style>
