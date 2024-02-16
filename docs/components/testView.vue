<template>
  <div class="container">
    {{ a }}
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  const a = ref<string>('vue局部组件');
</script>
<style scoped lang="scss"></style>
