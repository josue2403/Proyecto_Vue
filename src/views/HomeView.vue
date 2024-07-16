<template>
  <div>
    <!-- Botón de Menú -->
    <div class="menu-btn" @click="toggleMenu">
      <i class="fas fa-bars fa-2x"></i>
    </div>

    <!-- Navegación -->
    <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
      <!-- Marca -->
      <div class="nav-brand">DANI<span class="logo-highlight">QUIZ</span></div>
      <!-- Navegación Izquierda -->
      <ul class="nav-menu" :class="{ 'show': menuOpen }" >
        <li><router-link to="/login">Iniciar sesión</router-link></li>
        <li><router-link to="/register">Registarse</router-link></li>

      </ul>
    </nav>
    <div class="eslogan">
      <h1>¡Bienvenido a DaniQuiz!.</h1>
      <h2>Encuestas inteligentes para decisiones más acertadas. ¡Crea, recopila y actúa!</h2>
    </div>
    <!-- SECCIÓN PRINCIPAL -->
      <!-- SECCIÓN PRINCIPAL -->
      <header class="showcase"></header>
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
  <!-- Pie de página -->
  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 DANIQUIZ. Todos los derechos reservados.</p>
    </div>
  </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      const status=!this.menuOpen;
      this.menuOpen = status
    }
  }
}
</script>


<style>
@import '../assets/estilos/home.css';
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css');

/* Agrega aquí tu CSS personalizado */
</style>
