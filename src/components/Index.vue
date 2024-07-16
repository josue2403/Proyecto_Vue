<template>
  <div>
    <!-- Botón de Menú -->
    <div class="menu-btn" @click.stop="toggleMenu">
      <i class="fas fa-bars fa-2x"></i>
    </div>

    <!-- Navegación -->
    <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
      <!-- Marca -->
      <router-link to="/index" class="nav-brand">DANI<span class="logo-highlight">QUIZ</span></router-link>
      <!-- Navegación Izquierda -->
      <ul class="nav-menu" :class="{ 'show': menuOpen }">
        <li><router-link to="/index" class="open">Inicio</router-link></li>
        <li><router-link to="/disponible">Encuestas </router-link></li>
        <li class="profile-menu">
          <router-link to="" @click.stop="toggleProfileMenu">Perfil</router-link>
          <ul v-if="profileMenuOpen" class="dropdown-menu" ref="profileMenu">
            <li><router-link to="/perfil">Ver Perfil</router-link></li>
            <li @click="cerrarSesion"><router-link to="">Cerrar Sesión</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- SECCIÓN PRINCIPAL -->
    <header class="showcase1">
      <p>Empieza a crear encuestas.</p>
      <router-link to="/create" class="btn">
        Crear Encuestas
      </router-link>
    </header>
    <!-- Redes Sociales -->
    <section class="social">
      <p>Síguenos en nuestras Redes sociales</p>
      <div class="links">
        <a href="https://facebook.com">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://www.linkedin.com/">
          <i class="fab fa-linkedin"></i>
        </a>
      </div>
    </section>
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 DANIQUIZ. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>


<script>
export default {
  name: 'index-vue',
  data() {
    return {
      menuOpen: false,
      profileMenuOpen: false,
    };
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
  },
  mounted() {
    document.addEventListener('click', this.closeProfileMenu);
    const currentUserData = localStorage.getItem('userData');
    if (currentUserData) {
      this.currentUser = JSON.parse(currentUserData);
      console.log('Usuario Actual:', this.currentUser);
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeProfileMenu);
  },
};
</script>

<style>
@import '../assets/estilos/home.css';
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css');

.profile-menu .dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 10px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px 0;
  margin: 0;
  min-width: 10px;
  margin-top: -15px;
  border-radius: 15px;

}

.profile-menu:hover .dropdown-menu {
  display: block;
}

.nav-menu .dropdown-menu li a {
  color: black;
  padding: 10px 20px;
  display: block;
  text-decoration: none;
}

.nav-menu .dropdown-menu li a:hover {
  background-color: black;
  padding-left: -5px;
}

.nav-open .dropdown-menu {
  display: block;
}
</style>
