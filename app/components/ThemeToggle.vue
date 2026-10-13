<template>
  <DuiButton variant="ghost" color="neutral" :title="isDark ? 'Usar modo claro' : 'Usar modo oscuro'" @click="toggle">
    <i :class="isDark ? 'mdi mdi-weather-sunny' : 'mdi mdi-weather-night'" class="text-xl" aria-hidden="true" />
  </DuiButton>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>
