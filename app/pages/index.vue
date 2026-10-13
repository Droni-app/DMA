<template>
  <section>
    <h1>Home</h1>
    <pre>
      {{ courses }}
    </pre>
  </section>
</template>
<script setup>
const courses = await useFetch('/api/appi/learn/courses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
</script>