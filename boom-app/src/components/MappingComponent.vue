<script setup lang="ts">
import SelectObject from '@/components/mappingcomponents/SelectObject.vue'
</script>

<template>
  <div class="mapping-box">
    <div class="header-names-box">
      <h2>Header Names</h2>
      <p>Some header names</p>
    </div>
    <div class="object-type-box">
      <SelectObject />
    </div>
  </div>
</template>

<style scoped>
.mapping-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
}
.header-names-box {
  display: flex;
  flex-direction: column;
  flex: 0 0 50%;
  align-items: center;
  padding: 20px;
}
.object-type-box {
  display: flex;
  flex-direction: column;
  flex: 0 0 50%;
  align-items: right;
  padding: 20px;
}
label {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
