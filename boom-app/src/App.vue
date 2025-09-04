<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computedNavState } from './store'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/tree.png" width="125" height="125" />
    <h1>BOOM-app</h1>
  </header>

  <div class="wrapper">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/upload">Upload</RouterLink>
      <RouterLink v-if="computedNavState > 1" to="/mapping">Mapping</RouterLink>
      <RouterLink v-if="computedNavState > 2" to="/preview">Preview</RouterLink>
    </nav>
    <RouterView class="view" />
  </div>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
  margin: 1rem;
}

.logo {
  height: 5rem;
  width: auto;
}

.wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 1rem;
  margin: 1rem;
}

.view {
  width: 100%;
  margin: 1rem;
}

nav {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 2rem;
  margin: 2rem 0;
  width: 20%;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
}
</style>
