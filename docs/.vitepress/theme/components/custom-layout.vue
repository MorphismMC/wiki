<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import SearchBar from './search-bar.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-before>
      <SearchBar />
    </template>
  </Layout>
</template>
