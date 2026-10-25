<template>
  <DuiDropdown placement="bottom-end" variant="ghost" color="neutral" aria-label="Menú de usuario">
    <template #trigger>
      <span class="flex items-center gap-2">
        <img v-if="user?.avatar" :src="user.avatar" alt="" class="size-8 rounded-full object-cover" referrerpolicy="no-referrer">
        <span v-else class="grid size-8 place-items-center rounded-full bg-slate-800 text-sm font-semibold text-white dark:bg-slate-200 dark:text-slate-900">
          {{ initials(user?.fullName) }}
        </span>
        <span class="hidden text-sm font-medium sm:inline">{{ user?.fullName }}</span>
      </span>
    </template>
    <DuiDropdownItem label="Mi panel" icon="mdi mdi-view-dashboard-outline" @click="navigateTo('/panel')" />
    <DuiDropdownItem label="Mi perfil" icon="mdi mdi-account-outline" @click="navigateTo('/panel/perfil')" />
    <DuiDropdownItem v-if="isOwner" label="Administración" icon="mdi mdi-shield-crown-outline" @click="navigateTo('/panel/admin/cursos')" />
    <DuiDropdownItem label="Ir al sitio" icon="mdi mdi-home-outline" @click="navigateTo('/')" />
    <DuiDropdownSeparator />
    <DuiDropdownItem label="Cerrar sesión" icon="mdi mdi-logout" danger @click="logout" />
  </DuiDropdown>
</template>

<script setup lang="ts">
const { user, isOwner, logout } = useAuth()
</script>
