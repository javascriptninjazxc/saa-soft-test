<template>
  <div class="account-form-header">
    <h2 class="account-form-header__title">
      Учетные записи
    </h2>

    <button @click="onClickAddAccount" class="account-form-header__btn">
      +
    </button>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['onAddAccount']);

const onClickAddAccount = () => {
  emits('onAddAccount');
}
</script>

<style lang="scss" scoped>
.account-form-header {
  display: flex;
  gap: 20px;
  align-items: center;

  &__btn {
    background: transparent;
    border: 1px solid black;
    border-radius: 5px;
    width: 40px;
    font-size: 18px;
    cursor: pointer;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>