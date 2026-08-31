<template>
  <div class="layout-shell">
    <header class="topbar">
      <div class="brand">心理沙盘平台</div>
      <nav class="nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/sandbox">3D 心理沙盘</RouterLink>
        <RouterLink to="/assessments">心理测评</RouterLink>
        <RouterLink to="/users">用户管理</RouterLink>
      </nav>
    </header>

    <main class="layout-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
.layout-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  color: #3b2f25;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: #5d4037;
}

.nav :deep(a.router-link-active) {
  color: #3b8bcc;
  font-weight: 700;
}

.layout-main {
  flex: 1;
  min-height: 0;
}

@media (max-width: 768px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .nav {
    gap: 12px;
    font-size: 14px;
  }
}
</style>
