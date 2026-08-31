import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import HomeView from '../views/HomeView.vue';
import SandboxView from '../views/SandboxView.vue';
import AssessmentsView from '../views/AssessmentsView.vue';
import UsersView from '../views/UsersView.vue';

const routes = [
  { path: '/sandbox', name: 'sandbox', component: SandboxView },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'assessments', name: 'assessments', component: AssessmentsView },
      { path: 'users', name: 'users', component: UsersView },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
