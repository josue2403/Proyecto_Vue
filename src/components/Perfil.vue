<template>
  <!-- Botón de Menú -->
  <div class="menu-btn" @click="toggleMenu">
    <i class="fas fa-bars fa-2x"></i>
  </div>

  <!-- Navegación -->
  <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
    <router-link to="/index" class="nav-brand">DANI<span class="logo-highlight">QUIZ</span></router-link>

    <!-- Navegación Izquierda -->
    <ul class="nav-menu" :class="{ 'show': menuOpen }">
      <li><router-link to="/index">Inicio</router-link></li>
      <li><router-link to="/disponible">Encuestas</router-link></li>
      <li><router-link to="/perfil" class="open">Perfil</router-link></li>
    </ul>
  </nav>
  <!-- Cargar datos del usuario , por defecto desabilitada -->
  <div class="perfil">
    <div v-if="!changingPassword">
      <div class="datos">
        <h1>Datos del Usuario</h1>
        <div class="user-icon">
          <i class="fas fa-user"></i>
        </div>
        <div class="input-contenedor">
          <label for="nombre">NOMBRE :</label>
          <div class="input-wrapper">
            <i class="fas fa-user icon"></i>
            <input type="text" id="nombre" required v-model="usuario.nombre" disabled>
          </div>
          <div class="error-message" v-if="nombreInvalido">{{ mensajeNombre }}</div>
        </div>
        <div class="input-contenedor">
          <label for="email">CORREO ELECTRÓNICO :</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope icon"></i>
            <input type="email" id="email" v-model="usuario.email" :disabled="!editing" :class="{ 'editing': editing }">
          </div>
          <div class="error-message" v-if="emailInvalido">{{ mensajeEmail }}</div>
        </div>
      </div>
      <div class="acciones">
        <div v-if="!editing" class="botones-no-editar">
          <!-- Habilita la edicion de perfil -->
          <button class="boton-accion" @click="editar">Editar</button>
          <button class="boton-accion" @click="iniciarCambioContrasena">Cambiar Contraseña</button>
        </div>
        <div v-if="editing" class="botones-editar">
          <button class="boton-password" @click="guardarCambios">Guardar</button>
          <button class="boton-password-cancel" @click="cancelar">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="changingPassword" class="perfil-password">
      <!-- Actualizar contraseña -->
      <div class="datos1">
        <h1>Actualizar contraseña</h1>
        <div class="input-contenedor">
          <label for="currentPasswordChange">CONTRASEÑA ACTUAL :</label>
          <div class="input-wrapper">
            <i class="fas fa-lock icon"></i>
            <input :type="showCurrentPassword ? 'text' : 'password'" id="currentPasswordChange"
              v-model="currentPassword" :class="{ 'editing': changingPassword }">
            <button type="button" class="toggle-password" @click="toggleCurrentPasswordVisibility">
              <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="input-contenedor">
          <label for="newPassword">NUEVA CONTRASEÑA :</label>
          <div class="input-wrapper">
            <i class="fas fa-lock icon"></i>
            <input :type="showNewPassword ? 'text' : 'password'" id="newPassword" v-model="newPassword"
              :class="{ 'editing': changingPassword }">
            <button type="button" class="toggle-password" @click="toggleNewPasswordVisibility">
              <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="input-contenedor">
          <label for="confirmNewPassword">CONFIRMAR NUEVA CONTRASEÑA :</label>
          <div class="input-wrapper">
            <i class="fas fa-lock icon"></i>
            <input :type="showConfirmNewPassword ? 'text' : 'password'" id="confirmNewPassword"
              v-model="confirmNewPassword" :class="{ 'editing': changingPassword }">
            <button type="button" class="toggle-password" @click="toggleConfirmNewPasswordVisibility">
              <i :class="showConfirmNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

      </div>
      <div class="botones-editar1">
        <button class="boton-password" @click="guardarNuevaContrasena">Guardar</button>
        <button class="boton-password-cancel" @click="cancelarCambioContrasena">Cancelar</button>
      </div>
    </div>
  </div>
</template>
<script>
import Swal from 'sweetalert2';

export default {
  name: 'PerfilVue',
  data() {
    return {
      usuario: {
        nombre: '',
        email: '',
        password: '',
      },
      showCurrentPassword: false,
      currentPassword: '',
      editing: false,
      isModified: false,
      showNewPassword: false,
      showConfirmNewPassword: false,
      newPassword: '',
      confirmNewPassword: '',
      changingPassword: false,
      originalUsuario: {},
      nombreInvalido: false,
      mensajeNombre: '',
      emailInvalido: false,
      mensajeEmail: '',
      menuOpen: false // Agregar variable para controlar el estado del menú
    };
  },
  created() {
    this.cargarDatosUsuario();
  },
  methods: {
    cargarDatosUsuario() {
      // Carga de datos desde localStorage
      const storedUsuario = JSON.parse(localStorage.getItem('usuarioActual'));
      if (storedUsuario) {
        this.usuario = { ...storedUsuario };
        this.originalUsuario = { ...storedUsuario };
      }
    },
    editar() {
      this.editing = true;
    },
    iniciarCambioContrasena() {
      this.changingPassword = true;
      this.editing = false;
    },
    //Validaciones para la edición
    validarNombre() {
      const pattern = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,}$/;
      if (!pattern.test(this.usuario.nombre)) {
        this.nombreInvalido = true;
        this.mensajeNombre = 'El nombre solo puede contener letras, y mínimo 3 caracteres.';
        return false;
      } else {
        this.nombreInvalido = false;
        this.mensajeNombre = '';
        return true;
      }
    },
    validarEmail() {
      const pattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9]*(?:[._-][a-zA-Z0-9]{1,})?)@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{1,})?$/;
      if (!pattern.test(this.usuario.email)) {
        this.emailInvalido = true;
        this.mensajeEmail = 'Por favor ingresa un correo electrónico válido.';
        return false;
      } else {
        this.emailInvalido = false;
        this.mensajeEmail = '';
        return true;
      }
    },
    //realizar cambios si se cumple las validaciones
    guardarCambios() {
      const nombreValido = this.validarNombre();
      const emailValido = this.validarEmail();

      if (!this.hasChanges()) {
        Swal.fire({
          icon: 'info',
          title: 'Sin Cambios',
          text: 'No has realizado cambios en tu perfil.'
        });
        return;
      }
      if (!nombreValido) {
        Swal.fire({
          icon: 'error',
          title: 'Nombre Inválido',
          text: 'El nombre solo puede contener letras y  mínimo 3 digitos'
        });
        return;
      } else if (!emailValido) {
        Swal.fire({
          icon: 'error',
          title: 'Correo Electrónico Inválido',
          text: 'Por favor ingresa un correo electrónico válido.'
        });
        return;
      }

      Swal.fire({
        title: 'Guardar Cambios',
        html: `
        <div class="input-contenedor">
          <div class="input-wrapper">
            <i class="fas fa-envelope icon"></i>
        <input id="swal-input-password" type="password"  placeholder="Ingresa tu contraseña">
          </div>
        </div>

      `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'custom-confirm-button',
          cancelButton: 'custom-cancel-button'
        },
        preConfirm: () => {
          const password = document.getElementById('swal-input-password').value;
          return password;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const password = result.value;
          // Verificar contraseña actual 
          const storedPassword = this.usuario.password; // Obtener la contraseña actual del usuario
          if (storedPassword !== password) {
            Swal.fire({
              icon: 'error',
              title: 'Contraseña Incorrecta',
              text: 'La contraseña ingresada es incorrecta. Por favor verifica e intenta nuevamente.'
            });
            return;
          }

          if (nombreValido && emailValido) {
            localStorage.setItem('usuarioActual', JSON.stringify(this.usuario));

            // Actualizar usuarios en localStorage
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const index = usuarios.findIndex(user => user.id === this.usuario.id_usuario);
            if (index !== -1) {
              usuarios[index] = { ...this.usuario };
              localStorage.setItem('usuarios', JSON.stringify(usuarios));

            }

            this.originalUsuario = { ...this.usuario };
            this.editing = false;
            this.isModified = false;
            Swal.fire({
              icon: 'success',
              title: 'Cambios Guardados',
              text: 'Los cambios en tu perfil han sido guardados exitosamente.'
            });
          }
        }
      });
    },

    hasChanges() {
      return JSON.stringify(this.usuario) !== JSON.stringify(this.originalUsuario);
    },
    cancelar() {
      this.usuario = { ...this.originalUsuario };
      this.editing = false;
    },
    guardarNuevaContrasena() {
      if (!this.currentPassword || !this.newPassword || !this.confirmNewPassword) {
        Swal.fire({
          icon: 'info',
          title: 'Todos los Campos Requeridos',
          text: 'Por favor ingresa todos los campos para actualizar tu contraseña.'
        });
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseñas no Coinciden',
          text: 'Las contraseñas nuevas no coinciden. Por favor verifica e intenta nuevamente.'
        });
        return;
      }

      // Verificar contraseña actual 
      const storedPassword = this.usuario.password;
      if (storedPassword !== this.currentPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Contraseña Incorrecta',
          text: 'La contraseña actual ingresada es incorrecta. Por favor verifica e intenta nuevamente.'
        });
        return;
      }
      this.usuario.password = this.newPassword;
      localStorage.setItem('usuarioActual', JSON.stringify(this.usuario));
      // Actualizar usuarios en localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios',)) || [];
      const index = usuarios.findIndex(user => user.id === this.usuario.id);

      if (index !== -1) {
        usuarios[index] = { ...this.usuario };
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

      }
      this.originalUsuario = { ...this.usuario };
      this.editing = false;
      this.isModified = false;
      Swal.fire({
        icon: 'success',
        title: 'Cambios Guardados',
        text: 'Los cambios en tu perfil han sido guardados exitosamente.'
      });
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.changingPassword = false;
    },

    cancelarCambioContrasena() {
      this.changingPassword = false;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
    },
    toggleCurrentPasswordVisibility() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleNewPasswordVisibility() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleConfirmNewPasswordVisibility() {
      this.showConfirmNewPassword = !this.showConfirmNewPassword;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    }
  }
};
</script>

<style>
/*Libreris y estilos importados */
@import '../assets/estilos/formulario.css';
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css');

.custom-confirm-button,
.custom-cancel-button {
  display: flex;
  justify-content: center;
  width: 42%;
  color: #fff;
  border: none;
  text-align: center;
  font-size: 18px;
  border-radius: 20px;
  font-family: 'Oswald', sans-serif;
  font-weight: bold;
  margin-top: -10px;
}

.custom-confirm-button {
  background-color: #009292;
  border: 2px solid #3b3a3a;
  display: inline-block;
  margin-right: 10px;
  justify-content: center;
}

.custom-confirm-button:hover {
  background-color: aqua;
  border: 2px solid black;
  color: black;
  font-weight: bold;
}

.custom-cancel-button {
  background-color: rgb(230, 72, 72);
  border: 2px solid #3b3a3a;
  display: inline-block;
  margin-right: 10px;
}

.custom-cancel-button:hover {
  background-color: red;
  border: 2px solid black;
  color: black;
  display: inline-block;
  margin-right: 10px;
}

.perfil .datos .user-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid blue;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 38%
}

.user-icon i {
  font-size: 50px;
  color: blue;
}

.perfil {
  width: 100%;
  max-width: 500px;
  height: 480px;
  margin: 100px auto 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  padding-bottom: 45px;
  color: #fff;
  margin-top: 150px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.3);
  /* Sombras */
  margin-bottom: 0;
}

.datos {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  margin: 0;
  padding: 0;
  padding: 40px;
  max-width: 1200px;
  border-radius: 10px;
  padding-bottom: 20px;
  width: 100%;
}

.datos h1 {
  text-align: center;
  /* Alineación central */
  color: #009292;
  /* Color del texto */
  font-size: 27px;
  margin-bottom: 30px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  border-radius: 20px;
  margin-top: 10px;
  color: #262626;
}

/* Establece estilos para los iconos dentro de los contenedores de entrada */
.input-wrapper i {
  position: absolute;
  /* Posición absoluta para colocar el icono dentro del campo */
  top: 35%;
  /* Alinea el icono verticalmente */
  left: 0px;
  /* Ajusta la posición horizontal del icono */
  transform: translateY(-50%);
  /* Centra verticalmente el icono */
  color: #009292;
  /* Color del icono */
  font-size: 1rem;
  /* Tamaño del icono */
}

.toggle-icon {
  position: absolute;
  /* Posición absoluta para colocar el icono dentro del campo */
  top: 35%;
  /* Alinea el icono verticalmente */
  right: 30px;
  /* Ajusta la posición horizontal del icono */
  transform: translateY(-50%);
  /* Centra verticalmente el icono */

  font-size: 1rem;
  /* Tamaño del icono */
}

.input-wrapper {
  position: relative;
  /* Asegura que los elementos hijos se posicionen en relación a este contenedor */
  display: flex;
  align-items: center;
}

.input-wrapper .icon {
  position: absolute;
  /* Posición absoluta para colocar el icono dentro del campo */
  top: 35%;
  /* Alinea el icono verticalmente */
  left: 15px;
  /* Ajusta la posición horizontal del icono */
  transform: translateY(-50%);
  /* Centra verticalmente el icono */
  color: #009292;
  /* Color del icono */
  font-size: 1rem;
  /* Tamaño del icono */
}

.perfil .boton-password,
.perfil .boton-password-cancel {
  margin-top: 0;
}

.perfil .input-contenedor {
  display: flex;
  flex-direction: column;
  width: 450px;
}

label {
  color: black;
  font-weight: bold;
  font-size: 13px;
}

.perfil-password {
  width: 80%;
  max-width: 900px;
  margin: 100px auto 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  padding-bottom: 45px;
  color: #fff;
  margin-top: 15px;
}

.perfil-password .boton-password,
.perfil-password .boton-password-cancel {
  margin-top: 30px;
}

.datos1 {
  padding: 40px;
  max-width: 500px;
  border-radius: 10px;
  padding-bottom: 10px;
  width: 100%;
}

.datos1 h1 {
  text-align: center;
  color: #009292;
  font-size: 27px;
}

.botones-editar1 {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;
}


.botones-editar1 button {
  width: 60%;
}

.boton-password,
.boton-password-cancel {
  display: flex;
  justify-content: space-between;
  width: 50%;
  padding: 10px;
  color: #fff;
  border: none;
  text-align: center;
  font-size: 18px;
  border-radius: 20px;
  font-family: 'Oswald', sans-serif;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 20px
}

.boton-password {
  background-color: #009292;
  border: 2px solid #3b3a3a;
  display: inline-block;
  margin-right: 10px;
}

.boton-password:hover {
  background-color: aqua;
  border: 2px solid black;
  color: black;
  font-weight: bold;
}

.boton-password-cancel {
  background-color: rgb(230, 72, 72);
  border: 2px solid #3b3a3a;
  display: inline-block;
  margin-right: 10px;
}

.boton-password-cancel:hover {
  background-color: red;
  border: 2px solid black;
  color: black;
  display: inline-block;
  margin-right: 10px;
}

.datos1 label {
  color: #262626;
  font-weight: bold;
  font-size: 13px;
}

.datos1 .input-contenedor {
  right: 62px;
}

.datos1 .input-wrapper {
  position: relative;
  width: 100%;
  border-radius: 20px;
  margin-top: 10px;
  color: #262626;
}

/* Establece estilos para los iconos dentro de los contenedores de entrada */
.datos1 .input-wrapper i {
  position: absolute;
  /* Posición absoluta para colocar el icono dentro del campo */
  top: 35%;
  /* Alinea el icono verticalmente */
  left: 15px;
  /* Ajusta la posición horizontal del icono */
  transform: translateY(-50%);
  /* Centra verticalmente el icono */
  color: #009292;
  /* Color del icono */
  font-size: 1rem;
  /* Tamaño del icono */
}

.datos1 .input-wrapper .toggle-password {
  position: absolute;
  /* Posición absoluta para colocar el icono dentro del campo */
  top: 45%;
  /* Alinea el icono verticalmente */
  right: 55px;
  /* Ajusta la posición horizontal del icono */
  transform: translateY(-50%);
  /* Centra verticalmente el icono */
  color: #009292;
  font-size: 1rem;
  /* Tamaño del icono */
}

.datos1 .input-wrapper {
  position: relative;
  /* Asegura que los elementos hijos se posicionen en relación a este contenedor */
  display: flex;
  align-items: center;
}

.datos1 .input-wrapper .icon {
  position: absolute;
  /* Posición absoluta para colocar el icono dentro del campo */
  top: 35%;
  /* Alinea el icono verticalmente */
  left: 15px;
  /* Ajusta la posición horizontal del icono */
  transform: translateY(-50%);
  /* Centra verticalmente el icono */
  color: blue;
  /* Color del icono */
  font-size: 1rem;
  /* Tamaño del icono */
}

.perfil input {
  padding: 15px 40px;
  /* Espaciado de relleno con espacio para el icono */
  border: 1px solid #463e3e;
  border-radius: 10px;
  width: 100%;
  color: #463e3e
}

input.editing {
  color: black;
  border-color: blue;
  font-weight: bold;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
  /* Sombras */
}

input:disabled {
  background-color: #f0f0f0;
}

.boton-accion {
  width: 500px;
  padding: 10px;
  color: #fff;
  border: none;
  text-align: ce;
  font-size: 18px;
  border-radius: 20px;
  font-family: 'Oswald', sans-serif;
  font-weight: bold;
  margin-top: 10px;
}

.boton-accion {
  background: #009292;
  /* Color de fondo */
  border: 2px solid #3b3a3a;
  color: white;
}

.boton-accion:hover {
  background-color: aqua;
  border: 2px solid black;
  color: black;
  font-weight: bold;
}

.acciones {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  padding-bottom: 40px;

}

.botones-no-editar {
  display: flex;
  justify-content: space-between;
  width: 80%;
  margin: 0 auto;
}

.botones-editar {
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin: 0 auto;
}

.botones-no-editar button,
.botones-editar button {
  width: 48%;
}

.re h1 {
  color: black;
  font-size: 30px;
  margin-top: 200px
}

.swal2-input {
  width: calc(50%);
  padding: 15px 40px;
  font-size: 15px;
  border: 1px solid #009292;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>