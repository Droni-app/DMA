<script setup lang="ts">
// Ruta antigua del callback de Google: se atiende en /oauth/google/callback
const route = useRoute()
await navigateTo({ path: '/oauth/google/callback', query: route.query }, { replace: true })
</script>
