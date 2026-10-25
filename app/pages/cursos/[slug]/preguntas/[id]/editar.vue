<template>
  <CourseQuestionForm :question-id="String(route.params.id)" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'course' })
const route = useRoute()
</script>
