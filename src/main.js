// src/main.js
import { createApp } from 'vue';  // Importación para Vue 3
import App from './App.vue';
import router from './router';




const app = createApp(App);
app.use(router);
app.mount('#app');
