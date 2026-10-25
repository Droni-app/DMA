<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

await navigateTo('/panel')
</script>
