<template>
  <div class="sandbox-page" v-html="templateHtml"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import templateHtml from '../modules/sandbox/assets/sandbox-template.html?raw';
import '../modules/sandbox/styles/sandbox.css';
import { initSandboxApp } from '../modules/sandbox/services/initSandboxApp';

let destroySandbox = null;

onMounted(() => {
  destroySandbox = initSandboxApp();
});

onUnmounted(() => {
  if (typeof destroySandbox === 'function') {
    destroySandbox();
  }
});
</script>

<style scoped>
.sandbox-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
