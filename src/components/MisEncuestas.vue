<template>
  <!-- Botón de Menú -->
  <div class="menu-btn" @click.stop="toggleMenu">
    <i class="fas fa-bars fa-2x"></i>
  </div>

  <!-- Navegación -->
  <nav v-if="!encuesta" class="nav-main" :class="{ 'nav-open': menuOpen }">
    <!-- Marca -->
    <router-link to="/index" class="nav-brand">DANI<span class="logo-highlight">QUIZ</span></router-link>
    <!-- Navegación Izquierda -->
    <ul class="nav-menu" :class="{ 'show': menuOpen }">
      <li><router-link to="/index">Inicio</router-link></li>
      <li><router-link to="/disponible" class="open">Encuestas</router-link></li>
      <li class="profile-menu">
        <router-link to="" @click.stop="toggleProfileMenu">Perfil</router-link>
        <ul v-if="profileMenuOpen" class="dropdown-menu" ref="profileMenu">
          <li><router-link to="/perfil">Ver Perfil</router-link></li>
          <li @click="cerrarSesion"><router-link to="">Cerrar Sesión</router-link></li>
        </ul>
      </li>
    </ul>
  </nav>
  <div class="boton-encuesta" v-if="!modoEdicion">
    <router-link to="/disponible" class="button-active">Mis Encuestas</router-link>
    <router-link to="/resolver" class="button">Disponibles</router-link>
  </div>
  <!-- Sección de la encuestas creadas por el usuario-->
  <div class="container available-surveys">
    <div v-if="encuestasUsuarioActual.length > 0 && !encuesta">
      <div class="survey-list">
        <div v-for="(encuesta, index) in encuestasUsuarioActual" :key="index" class="survey-card">
          <div class="img"></div>
          <h3 class="survey-title">{{ encuesta.titulo }}</h3>
          <p class="survey-description">{{ encuesta.creador }}</p>
          <div class="espacio-boton">
            <button @click="editarEncuesta(index)" class="boton btn-editar">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmarEliminarEncuesta(index)" class="boton btn-eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mostrar preguntas de la encuesta seleccionada para editar -->
    <div v-if="encuesta" class="encuesta-detalle">
      <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
        <div @click="volverALista" class="volver-flecha">
          <i class="fas fa-arrow-left"> Volver</i>
        </div>
        <!-- Marca -->
        <ul class="nav-menu" :class="{ 'show': menuOpen }">
          <li><router-link to="" class="open">Editar Encuesta</router-link></li>
        </ul>
      </nav>
      <!-- Datos cargado de la encuesta -->
      <div class="container">
        <div class="fondo">
          <h2>{{ encuesta.titulo }}</h2>
        </div>
        <div class="input-contenedor">
          <input type="text" class="encuesta-input" v-model="encuesta.titulo" placeholder="Título de la encuesta">
        </div>
        <div class="fecha">
          <h1>Fecha y hora límite:</h1>
          <input type="datetime-local" v-model="encuesta.fechaLimite" :min="fechaMinima" class="fecha-input" required />
        </div>
        <div class="respond">
          <h1>Contraseña :</h1>
          <div class="password-input-container">
            <input :type="showCurrentPassword ? 'text' : 'password'" id="currentPassword" class="pass"
              v-model="encuesta.password" placeholder="Contraseña para responder encuesta" />
            <button type="button" class="toggle-icon" @click="toggleCurrentPasswordVisibility">
              <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>
        <div class="respond">
          <h1>PREGUNTAS :</h1>
        </div>
        <div class="encuesta-container">
          <div class="preguntas-section">
            <div v-for="(pregunta, pIndex) in encuesta.preguntas" :key="pIndex" class="pregunta-container">
              <div class="container1">
                <div class="pregunta-item">
                  <div class="pregunta-header">
                    <span class="pregunta-numero">{{ pIndex + 1 }}. </span>
                    <input class="pregunta-input" type="text" v-model="pregunta.texto"
                      placeholder="Ingrese la pregunta" />
                    <select v-model="pregunta.tipo" class="pregunta-tipo">
                      <option value=""></option>
                      <option value="parrafo">Párrafo</option>
                      <option value="opcion-multiple">Opción Múltiple</option>
                    </select>
                  </div>
                  <div v-if="pregunta.tipo === 'opcion-multiple'" class="opciones-multiple">
                    <div class="opcion-items">
                      <label>Opciones:</label>
                      <div v-for="(opcion, oIndex) in pregunta.opciones" :key="oIndex" class="opcion-item">
                        <input type="text" v-model="pregunta.opciones[oIndex]" class="opcion-input"
                          placeholder="Opción" />
                        <button class="fas fa-trash-alt eliminar-opcion" type="button"
                          @click="eliminarOpcion(pIndex, oIndex)"></button>

                      </div>
                    </div>
                    <button type="button" class="agregar-pregunta" @click="agregarOpcion(pIndex)">
                      <i class="fas fa-plus-circle"></i> <!-- Icono de Font Awesome -->
                    </button>
                  </div>
                  <div v-else-if="pregunta.tipo === 'parrafo'" class="pregunta-respuesta">
                    <textarea class="respuesta-texto" placeholder="Escriba su respuesta" disabled></textarea>
                  </div>
                </div>
                <button class="fas fa-trash-alt eliminar-pregunta" type="button" @click="eliminarPregunta(pIndex)">
                </button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="agregar-pregunta" @click="agregarPregunta">
          <i class="fas fa-plus-circle"> Agregar Pregunta</i> <!-- Icono de Font Awesome -->
        </button>
        <button @click="guardarEncuesta" class="guardar">Guardar Cambios</button>
      </div>
    </div>


    <!-- Mensaje si no hay encuestas disponibles -->
    <div v-else-if="encuestasUsuarioActual.length === 0" class="no-encuesta">
      <p>No hay encuestas disponibles para gestionar.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'GestionarEncuestaVue',
  data() {
    return {
      encuestas: [],
      encuestasUsuarioActual: [],
      encuesta: null,
      usuarioActual: null,
      menuOpen: false,
      profileMenuOpen: false,
      modoEdicion: false, // Nueva variable para controlar el modo de edición
      modoResolucion: false, // Nueva variable para controlar el modo de resolución
      showCurrentPassword: false,

    };
  },

  created() {
    //Cargar datos del usaurio Actual
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
      this.usuarioActual = JSON.parse(usuarioActual);
    }
    this.obtenerEncuestasLocalStorage();
  },
  computed: {
    fechaMinima() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const hh = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    },
    esFechaLimiteValida() {
      const ahora = new Date();
      const fechaLimite = new Date(this.encuesta.fechaLimite);
      return fechaLimite > ahora || (fechaLimite.toDateString() === ahora.toDateString() && fechaLimite > ahora);
    }
  },
  methods: {
    //Obtener nombre del usuario Actual
    obtenerUsuarioActual() {
      const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
      if (usuarioActual) {
        this.usuarioActual = { nombre: usuarioActual.nombre };
      }
    },
    toggleCurrentPasswordVisibility() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleProfileMenu() {
      this.profileMenuOpen = !this.profileMenuOpen;
    },
    cerrarSesion() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      this.$router.push('/login');
    },
    //Cargar datos de la encuesta
    obtenerEncuestasLocalStorage() {
      const encuestas = JSON.parse(localStorage.getItem('encuestas')) || [];
      this.encuestas = encuestas.map(encuesta => {
        const creador = JSON.parse(encuesta.usuario);
        return {
          ...encuesta,
          creador: creador.nombre,
          vencida: new Date(encuesta.fechaLimite) < new Date()
        };
      });
      this.filtrarEncuestasUsuarioActual();
    },
    filtrarEncuestasUsuarioActual() {
      this.encuestasUsuarioActual = this.encuestas.filter(
        encuesta => encuesta.creador === this.usuarioActual.nombre
      );
    },
    editarEncuesta(index) {
      this.encuesta = this.encuestasUsuarioActual[index];
      this.modoEdicion = true; // Activar modo de edición
    },
    agregarOpcion(pIndex) {
      this.encuesta.preguntas[pIndex].opciones.push('');
    },
    eliminarOpcion(pIndex, oIndex) {
      this.encuesta.preguntas[pIndex].opciones.splice(oIndex, 1);
    },
    agregarPregunta() {
      this.encuesta.preguntas.push({
        texto: '',
        tipo: '',
        opciones: []
      });
    },
    eliminarPregunta(pIndex) {
      this.encuesta.preguntas.splice(pIndex, 1);
    },
    guardarEncuesta() {
      const index = this.encuestas.findIndex(enc => enc.titulo === this.encuesta.titulo);

      if (!this.encuesta.titulo || !this.encuesta.fechaLimite || !this.encuesta.password) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, complete todos los campos',
        });
        return false;
      }
      if (!this.esFechaLimiteValida) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Seleccione una fecha y hora posterior a la actual.',
        });
        return false;
      }
      for (const pregunta of this.encuesta.preguntas) {
        if (!pregunta.texto || !pregunta.tipo) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todas las preguntas deben tener un texto y un tipo.',
          });
          return false;
        }
      }

      if (index !== -1) {
        this.encuestas.splice(index, 1, this.encuesta);
        localStorage.setItem('encuestas', JSON.stringify(this.encuestas));
        Swal.fire({
          icon: 'success',
          title: 'Cambios guardados',
          text: 'La encuesta ha sido actualizada exitosamente.',
        });
        this.volverALista();
      }
    },
    confirmarEliminarEncuesta(index) {
      Swal.fire({
        title: 'Confirmar Eliminación',
        text: '¿Está seguro de que desea eliminar esta encuesta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminarEncuesta(index);
        }
      });
    },
    eliminarEncuesta(index) {
      const tituloEncuesta = this.encuestasUsuarioActual[index].titulo;
      const indexGeneral = this.encuestas.findIndex(encuesta => encuesta.titulo === tituloEncuesta);
      if (indexGeneral !== -1) {
        this.encuestas.splice(indexGeneral, 1);
        localStorage.setItem('encuestas', JSON.stringify(this.encuestas));
        this.filtrarEncuestasUsuarioActual();
        Swal.fire({
          icon: 'success',
          title: 'Encuesta Eliminada',
          text: 'La encuesta ha sido eliminada exitosamente.',
        });
      }
    },
    volverALista() {
      this.encuesta = null;
      this.modoEdicion = false; // Desactivar modo de edición
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  }
};
</script>


<style scoped>
.volver-flecha {
  padding-left: 20px;
  cursor: pointer;
}

.volver-flecha:hover {
  color: aqua;
}

.fondo {
  background-color: #0c9191;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  padding: 20px;
  padding-bottom: 20px;
  color: white;
  margin-bottom: 40px
}

.fondo h2 {
  padding: 20px;
  font-size: 40px;
  color: white;
}

.password-input-container {
  position: relative;
  display: inline-block;
  width: 100%;

}

.pass {
  padding-right: 30px;
  /* Ajusta el espacio a la derecha del input para el botón */
}

.toggle-icon {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  position: absolute;
  top: 35%;
  right: 55px;
  /* Ajusta la posición del botón según sea necesario */
  transform: translateY(-50%);
}

.toggle-icon i {
  color: #333;
  /* Color del icono */
  font-size: 18px;
  /* Tamaño del icono */
}

.toggle-icon:hover i {
  color: #009292;
  /* Color del icono al pasar el mouse */
}

.encuesta-detalle {
  margin-top: 150px;
  border-radius: 20px;
  padding-bottom: 50px;
  justify-content: center;
}

.encuesta-detalle .container {
  margin-top: 150px;
  background-color: white;
  border-radius: 20px;
  padding-bottom: 50px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.3);
  /* Sombras */
  justify-content: center;
  width: 70%;
}

.encuesta-detalle .input-contenedor {
  justify-content: center;
  border-color: aqua;
}

.titulo {
  color: #009292;
  /* Color del texto */
  padding-top: 40px;
  padding-bottom: 20px;
}

.espacio {
  margin-top: 100px;
}

.pregunta-header {
  display: flex;
  align-items: center;
}

.pregunta-numero {
  display: inline-block;
  width: 30px;
  /* Ajusta el ancho según sea necesario */
  text-align: center;
  font-size: 1em;
  /* Tamaño de fuente */
  color: #009292;
  /* Color del número de pregunta */
  margin-right: 10px;
  /* Margen derecho para separación */
  margin-top: -20px;
  font-weight: bold;
}

.draggable {
  cursor: move;
  user-select: none;
}

input[type="text"]:focus,
input[type="password"]:focus,

input[type="datetime-local"]:focus {
  border-color: #329977;
  /* Cambia el color del borde al enfocar el campo */
  outline: none;
  /* Elimina el contorno predeterminado al enfocar */
  box-shadow: 0 0 20px #329977;
  /* Agrega una sombra alrededor del campo al enfocar */
}

.encuesta-vencida {
  color: red;
}

.encuesta-detalle p,
h2,
h3 {
  color: black;
  text-align: center;

}

/* Estilos para las encuestas disponibles */
.img {
  background-color: #0c9191;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 65px;
  background-image: url('/src/assets/1.png');
  width: 320px;
  transition: transform 0.3s ease;
  margin-left: -20px;
  margin-top: -22px;
}

.available-surveys {
  margin-top: 70px;
  text-align: center;
}

.survey-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 50px;
}

.survey-card {
  background: white;
  /* Color de fondo*/
  padding: 20px;
  border-radius: 10px;
  width: 320px;
  box-shadow: 0 0 10px rgba(3, 3, 3, 5);
  transition: transform 0.3s ease;
  padding-bottom: 20px;
  margin-right: 20px;
}

.survey-card:hover {
  transform: translateY(-5px);
}

.survey-title {
  font-size: 24px;
  margin-bottom: 15px;
  margin-top: 15px;
  color: black;
  text-align: center
}

.survey-description {
  font-size: 16px;
  margin-bottom: 20px;
  color: black;
  text-align: center;
}

.survey-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.boton-encuesta {
  margin-top: 150px;
  justify-content: center;
  text-align: center;

}

.boton-encuesta .button {
  justify-content: center;
  margin-right: 50px;
  padding: 15px;

  border-radius: 20px;
  font-size: 20px;
  font-weight: bold;
  background: white;
  color: black;
  border: 2px solid #3b3a3a;
}

.boton-encuesta .button:hover {
  background: #ccc;
  color: black;
  border: 2px solid black;
}

.boton-encuesta .button-active {
  justify-content: center;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 30px;
  width: 290px;
  padding: 15px;
  border-radius: 20px;
  font-weight: bold;
  background: #76e698;
  color: black;
  border: 2px solid #3b3a3a;
}

.boton-encuesta .button-active:hover {

  background: aqua;
  color: black;
  border: 2px solid black;
}


.boton-activo {
  background-color: #38bb49;
}

.boton {
  transition: background-color 0.3s ease;
  justify-content: center;
  padding: 10px 30px;
  /* Ajusta el padding según sea necesario */
  margin-right: 5px;
  margin-left: 5px;
  border-radius: 5px;
  color: white;
  font-size: 18px;
}

.boton:hover {
  background-color: #1a252f;
}

.btn-editar {
  background-color: #007bff;
}

.btn-editar:hover {
  background-color: blue;
}

.btn-eliminar {
  background-color: #dc3545;
}

.btn-eliminar:hover {
  background-color: red;
}

.no-encuesta {
  font-size: 30px;
}
</style>