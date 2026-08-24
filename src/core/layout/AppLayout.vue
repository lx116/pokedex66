<script setup lang="ts">

import AppSideBar from "../../components/AppSideBar.vue"
</script>

<template>

<div class="min-h-screen">

  <app-side-bar/>
  <main class="main">
    <router-view/>
  </main>

</div>
</template>

<style scoped>

</style>