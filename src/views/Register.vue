<template>
  <!-- Botón de Menú -->
  <div class="menu-btn" @click="toggleMenu">
    <i class="fas fa-bars fa-2x"></i>
  </div>

  <!-- Navegación -->
  <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
    <!-- Marca -->
    <router-link to="/" class="nav-brand">DANI<span class="logo-highlight">QUIZ</span></router-link>
    <!-- Navegación Izquierda -->
    <ul class="nav-menu" :class="{ 'show': menuOpen }">
      <li><router-link to="/register" class="open">Registrarse</router-link></li>
    </ul>
  </nav>
  <!-- Formulario de inicio de Sesión -->
  <div class="registro">
    <form class="formulario" @submit.prevent="handleSubmit">
      <h1>Registro de usuario</h1>
      <div class="contenedor" v-if="!recoverySetup">
        <!-- Campo de nombre -->
        <div class="input-contenedor">
          <i class="fas fa-user icon"></i>
          <input type="text" id="nombre" placeholder="Nombre completo" pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+"
            title="Por favor, introduce solo letras" v-model="nombre" required>
          <span class="error-message" v-if="errorNombre">{{ errorNombre }}</span>
        </div>
        <!-- Campo de correo electrónico -->

        <div class="input-contenedor">
          <i class="fas fa-envelope icon"></i>
          <input type="email" id="email" placeholder="Correo Electrónico" required v-model="email">
          <span class="error-message" v-if="errorEmail">{{ errorEmail }}</span>
        </div>
        <!-- Campo de contraseña-->

        <div class="input-contenedor">
          <i class="fas fa-key icon"></i>
          <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Contraseña" v-model="password"
            required>
          <span class="error-message" v-if="errorPassword">{{ errorPassword }}</span>
          <!-- boton para ocultar y mostrar contraseña-->

          <button v-if="password" type="button" class="toggle-register" @click="togglePasswordVisibility">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <!-- Campo de confirmar contraseña-->

        <div class="input-contenedor">
          <i class="fas fa-key icon"></i>
          <input :type="showPassword ? 'text' : 'password'" id="confirmPassword" placeholder="Repetir Contraseña"
            v-model="confirmPassword" required>
          <span class="error-message" v-if="errorConfirmPassword">{{ errorConfirmPassword }}</span>
          <button v-if="password" type="button" class="toggle-register" @click="togglePasswordVisibility">
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>

        <button type="button" @click="setupRecovery" :class="{ 'boton-active': true, 'boton-disabled': !isValidForm }">
          Continuar
        </button>
        <p>¿Ya tienes una cuenta? <router-link to="/login" class="link">Iniciar Sesión</router-link></p>
      </div>
      <!-- Campo de preguntas de recuperación-->

      <div class="contenedor" v-if="recoverySetup">
        <p>Configurar métodos de recuperación</p>
        <div class="input-contenedor">
          <i class="fas fa-question-circle icon"></i>
          <input type="text" placeholder="Respuesta de seguridad 1" v-model="respuesta1"
            pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+" title="Por favor, introduce solo letras" required>
          <span class="message">¿Cuál es tu comida favorita?</span>

          <span class="error-message" v-if="errorRespuesta1">{{ errorRespuesta1 }}</span>
        </div>
        <div class="input-contenedor">
          <i class="fas fa-question-circle icon"></i>
          <input type="text" placeholder="Respuesta de seguridad 2" v-model="respuesta2"
            pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+" title="Por favor, introduce solo letras" required>
          <span class="message">¿Cuál es el nombre de tu mascota?</span>

          <span class="error-message" v-if="errorRespuesta2">{{ errorRespuesta2 }}</span>
        </div>
        <div class="input-contenedor">
          <i class="fas fa-question-circle icon"></i>
          <input type="text" placeholder="Respuesta de seguridad 3" v-model="respuesta3"
            pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+" title="Por favor, introduce solo letras" required>
          <span class="message">¿En que ciudad naciste?</span>

          <span class="error-message" v-if="errorRespuesta3">{{ errorRespuesta3 }}</span>
        </div>
        <button type="submit" :class="{ 'boton-active': true, 'boton-disabled': !isValidRecoveryForm }">
          Registrar
        </button>
        <button type="button" @click="goBack" class="boton-volver">
          Volver
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'RegisterVue',
  data() {
    return {
      nombre: '',
      email: '',
      password: '',
      confirmPassword: '',
      respuesta1: '',
      respuesta2: '',
      respuesta3: '',
      errorNombre: '',
      errorEmail: '',
      errorPassword: '',
      errorConfirmPassword: '',
      errorRespuesta1: '',
      errorRespuesta2: '',
      errorRespuesta3: '',
      showPassword: false,
      menuOpen: false,
      recoverySetup: false,
      formSubmitted: false,
      idCounter: parseInt(localStorage.getItem('idCounter') || '0') + 1,

    };
  },
  computed: {
    isValidNombre() {
      return this.formSubmitted && this.validateNombre(this.nombre);
    },
    isValidEmail() {
      return this.formSubmitted && this.validateEmail(this.email);
    },
    isValidPassword() {
      return this.formSubmitted && this.validatePassword(this.password);
    },
    isValidConfirmPassword() {
      return this.formSubmitted && this.validateConfirmPassword(this.confirmPassword);
    },
    isValidRespuesta1() {
      return this.formSubmitted && this.respuesta1.length > 0;
    },
    isValidRespuesta2() {
      return this.formSubmitted && this.respuesta2.length > 0;
    },
    isValidRespuesta3() {
      return this.formSubmitted && this.respuesta3.length > 0;
    },
    isValidForm() {
      return (
        this.isValidNombre &&
        this.isValidEmail &&
        this.isValidPassword &&
        this.isValidConfirmPassword
      );
    },
    isValidRecoveryForm() {
      return (
        this.isValidRespuesta1 &&
        this.isValidRespuesta2 &&
        this.isValidRespuesta3
      );
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validateNombre(nombre) {
      const nombreRegex = /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{3,}$/;
      return nombreRegex.test(nombre);
    },
    validateEmail(email) {
      const re = /^[a-zA-Z0-9](?:[a-zA-Z0-9]*(?:[._-][a-zA-Z0-9]{1,})?)@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{1,})?$/;
      return re.test(String(email).toLowerCase());
    },
    validatePassword(password) {
      return password.length >= 8;
    },
    validateConfirmPassword(confirmPassword) {
      return confirmPassword === this.password;
    },

    setupRecovery() {
      this.formSubmitted = true;

      // Validar nombre
      this.errorNombre = this.validateNombre(this.nombre) ? '' : 'Por favor, introduce solo letras';

      // Validar email
      this.errorEmail = this.validateEmail(this.email) ? '' : 'El correo electrónico no es válido.';

      // Validar contraseña
      this.errorPassword = this.validatePassword(this.password) ? '' : 'La contraseña debe contener mínimo 8 caracteres.';

      // Validar confirmación de contraseña
      this.errorConfirmPassword = this.validateConfirmPassword(this.confirmPassword) ? '' : 'Las contraseñas no coinciden.';
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const emailExists = usuarios.some(user => user.email === this.email);

      if (emailExists) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo electrónico ya está registrado.'
        });
      } else {
        this.recoverySetup = true;
      }
      // Mostrar mensaje de error si algún campo no es válido
      if (!this.isValidForm) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos correctamente antes de continuar.'
        });
        return;
      }

      // Verificar si el correo ya está registrado

    },
    handleSubmit() {
      const newUser = {
        id: this.idCounter,
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        respuestas: [this.respuesta1, this.respuesta2, this.respuesta3]
      };

      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      usuarios.push(newUser);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // Incrementar el contador de ID
      localStorage.setItem('idCounter', this.idCounter.toString());

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Usuario registrado correctamente.'
      });

      this.$router.push('/login');
      this.resetForm();
    },


    resetForm() {
      this.nombre = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.respuesta1 = '';
      this.respuesta2 = '';
      this.respuesta3 = '';
      this.errorRespuesta1 = '';
      this.errorRespuesta2 = '';
      this.errorRespuesta3 = '';
      this.recoverySetup = false;
      this.formSubmitted = false;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    goBack() {
      this.recoverySetup = false;
      this.formSubmitted = false;
    }
  }
};
</script>

<style>
/* Librerias y estilos importados */

@import '../assets/estilos/formulario.css';
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css');

.boton-volver {
  color: blue;
  display: block;
  margin: 0 auto;
  /* Centra horizontalmente el botón */
  width: fit-content;
  /* Ajusta el ancho del botón al contenido */
  background-color: white;
  border-color: white;
  margin-top: 10px;
}

.boton-active {
  width: 50%;
  /* Ancho completo */
  padding: 10px;
  background-color: rgb(29, 214, 100);
  color: #ffff;
  border: none;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  cursor: pointer;
  border-radius: 17px;
  border: 2px solid #3b3a3a;
  font-family: 'Oswald', sans-serif;
  /* Agregar la fuente Oswald */
  font-weight: bold;
}

.boton-active:hover {
  background-color: rgb(63, 156, 99);
}

.boton-disabled {
  background-color: #e48080;
  color: #000;
  cursor: not-allowed;
  border: 2px solid #3b3a3a;
  border-radius: 17px;
  font-size: 15px;
  font-weight: normal;
}

.boton-disabled:hover {
  background-color: #e25959;
  color: #000;
  cursor: not-allowed;
  border: 2px solid #3b3a3a;
  border-radius: 17px;
}


/* Estilos para el contenedor del input */
.input-contenedor {
  position: relative;
  display: flex;
  align-items: center;
}

/* Estilos para el botón de ver/ocultar contraseña */
.toggle-password {
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.input-contenedor .toggle-password i {
  color: white;
  padding: 10px;
  padding-bottom: 25px;
}
</style>
