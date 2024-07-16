import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Index from '../components/Index.vue';
import Perfil from '../components/Perfil.vue';
import Resultado from '../components/administrador/AnalisisResultados.vue'
import Create from '../components/Encuesta.vue';
import Resolver from '../components/ResolverEncuesta.vue';
import Disponible from '../components/MisEncuestas.vue';
import Prueba from '../components/prueba.vue';
import Administrar from '../components/administrador/administracion.vue'

import NotFoundComponent from '../components/NotFoundComponent.vue';

const routes = [

  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'index',
    component: Index,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: Perfil,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },


  {
    path: '/create',
    name: 'create',
    component:Create,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    path: '/resultado',
    name: 'resultado',
    component: Resultado,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },

  {
    path: '/resolver',
    name: 'resolver',
    component: Resolver,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    path: '/disponible',
    name: 'disponible',
    component: Disponible,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación
  },
  {
    path: '/prueba',
    name: 'prueba',
    component: Prueba,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación

  },
  {
    path: '/administrar',
    name: 'administrar',
    component: Administrar,
    meta: { requiresAuth: true } // Esta ruta requiere autenticación

  },


  // Ruta para manejar cualquier ruta no definida
  {
    path: '/:catchAll(.*)', // Captura cualquier ruta que no haya sido definida arriba
    component: NotFoundComponent // Aquí debes crear y especificar tu componente de página no encontrada
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn');
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige al inicio de sesión
    if (!isAuthenticated) {
      next({ path: '/login' });
    } else {
      next(); // Permite la navegación si está autenticado
    }
  } else {
    // Para rutas públicas, si el usuario intenta acceder al inicio de sesión estando autenticado, redirige a la página de inicio
    if (to.name === 'login' && isAuthenticated) {
      next({ path: '/index' });
    } else {
      next(); // Permite la navegación para rutas públicas
    }
  }
});

export default router;
