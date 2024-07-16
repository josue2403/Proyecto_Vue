<template>
    <!-- Botón de Menú -->
    <div class="menu-btn" @click.stop="toggleMenu">
      <i class="fas fa-bars fa-2x"></i>
    </div>

    <!-- Navegación -->
    <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
      <!-- Marca -->
      <router-link to="/administrar" class="nav-brand">DANI<span class="logo-highlight">QUIZ</span></router-link>
      <!-- Navegación Izquierda -->
      <ul class="nav-menu" :class="{ 'show': menuOpen }">
        <li ><router-link to="/resultado">Resultado</router-link></li>

        <li @click="cerrarSesion"><router-link to="">Salir de Administrador</router-link></li>
      </ul>
    </nav>
  <!-- Contenedor principal para la tabla de registros -->
  <div class="registros">
    <!-- Título de la sección de registros -->
    <h1>USUARIOS DEL SISTEMA</h1>
    <!-- Tabla para mostrar los registros -->
    <table v-if="usuarios.length > 0">
      <thead>
        <tr class="encabezado" >
          <!-- Encabezados de la tabla -->
          <th>ID</th>
          <th>NOMBRE COMPLETO</th>
          <th>CORREO</th>
          <th>CONTRASEÑA</th>
          <th>RESPUESTAS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usuario, index) in usuarios" :key="index" class="parametros" >
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.email }}</td>
          <td>{{ usuario.password }}</td>
          <td>{{ usuario.respuestas }}</td>

        </tr>
      </tbody>
    </table>
    <p v-else>No hay usuarios para mostrar.</p>
  </div>
</template>

<script>
// Importar función para obtener usuarios desde localStorage
import { getUsersFromLocalStorage} from './LocalStorageService';

export default {
  name: 'InterfazUsuarios',
  data() {
    return {
      usuarios: [],
      menuOpen: false,
      profileMenuOpen: false,
    };
  },

  mounted() {
    // Obtener usuarios desde localStorage al cargar el componente
    this.usuarios = getUsersFromLocalStorage();
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleProfileMenu() {
      this.profileMenuOpen = !this.profileMenuOpen;
    },
    closeProfileMenu(event) {
      if (this.$refs.profileMenu && !this.$refs.profileMenu.contains(event.target)) {
        this.profileMenuOpen = false;
      }
    },
    cerrarSesion() {
      // Limpiar localStorage
      localStorage.removeItem('isLoggedIn'); // Eliminar el indicador de sesión
      localStorage.removeItem('userData'); // Eliminar cualquier dato de usuario que hayas almacenado
      
      // Redirigir al usuario a la página de inicio de sesión
      this.$router.push('/login');
    },
  }
};
</script>

<style scoped>
/* Estilos para los registros de usuarios */
.registros {
  margin-top: 120px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.registros h1 {
  color: BLACK;
  padding: 20px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #6b5d5d;
}

th {
  background-color: #ccc;
}

tbody {
  background-color: #fff;
}

button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  justify-content: center
}

button:hover {
  background-color: red
}
.encabezado{
  color: black;
  font-size: 20px
}
.parametros{
  color: black;
  font-size: 15px
}
</style>
