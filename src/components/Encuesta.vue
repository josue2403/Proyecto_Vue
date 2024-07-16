<template>
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
      <li><router-link to="/index">Inicio</router-link></li>

      <li><router-link to="" class="open">Crear Encuesta</router-link></li>
    </ul>
  </nav>
  <div class="container">
    <h1 class="titulo" id="tituloPrincipal">SISTEMA DE ENCUESTAS</h1>
    <!-- Formulario de Encuesta -->
    <div class="input-contenedor">
      <input type="text" class="encuesta-input" v-model="tituloEncuesta" placeholder="Título de la encuesta" required>
    </div>

    <!-- Fecha Limite -->
    <div class="fecha">
      <h1>Fecha y hora límite:</h1>
      <input type="datetime-local" id="fechaHoraLimite" name="fechaHoraLimite" v-model="fechaLimite" :min="fechaMinima"
        class="fecha-input" required>
    </div>

    <!-- Contraseña para responder encuesta-->
    <div class="respond">
      <h1>Contraseña :</h1>
      <label for="password"></label>
      <div class="password-input-container">
        <input :type="showCurrentPassword ? 'text' : 'password'" id="password" class="pass" v-model="password"
          placeholder="Coloca una contraseña para responder la encuesta" required />
        <button type="button" class="toggle-icon" @click="toggleCurrentPasswordVisibility">
          <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <!-- Creación de encuestas-->
    <div class="respond">
      <h1>PREGUNTAS :</h1>
    </div>
    <div class="encuesta-container">
      <div class="preguntas-section">
        <!-- Colocar numero de pregunta, actualizar seccion de pregunta-->
        <div v-for="(pregunta, pIndex) in preguntas" :key="pIndex" class="pregunta-container" :draggable="true"
          @dragstart="dragStart(pIndex)" @dragover.prevent @drop="dropItem(pIndex)">
          <div class="container1">
            <div class="pregunta-item">
              <div class="pregunta-header">
                <span class="pregunta-numero">{{ pIndex + 1 }}.</span>
                <!-- Contador de pregunta-->
                <input v-model="pregunta.texto" type="text" class="pregunta-input" placeholder="Ingrese la pregunta">
                <!-- Elegir tipo de pregunta-->
                <select v-model="pregunta.tipo" class="pregunta-tipo">
                  <option value=""></option>
                  <option value="parrafo">Párrafo</option>
                  <option value="opcion-multiple">Opción Múltiple</option>
                </select>
              </div>
              <div v-if="pregunta.tipo === 'opcion-multiple'" class="opciones-multiple">
                <div class="opcion-items">
                  <label for="">Opciones:</label>
                  <div v-for="(opcion, oIndex) in pregunta.opciones" :key="oIndex" class="opcion-item">
                    <input :value="opcion" @input="updateOpcion(pregunta, oIndex, $event)" type="text"
                      class="opcion-input" placeholder="Opción">
                    <button class="fas fa-trash-alt eliminar-opcion" type="button"
                      @click="eliminarOpcion(pregunta, oIndex)"></button>
                  </div>
                </div>
                <button type="button" class="agregar-pregunta" @click="agregarOpcion(pregunta)">
                  <i class="fas fa-plus-circle"></i> <!-- Icono de Font Awesome -->
                </button>
              </div>
              <div v-if="pregunta.tipo === 'parrafo'" class="pregunta-respuesta">
                <textarea v-model="pregunta.respuesta" class="respuesta-texto" placeholder="Escriba su respuesta"
                  disabled></textarea>
              </div>
            </div>
            <button class="fas fa-trash-alt eliminar-pregunta" type="button" @click="eliminarPregunta(pIndex)">
            </button>
          </div>
        </div>
      </div>
      <button type="button" class="agregar-pregunta" @click="agregarPregunta">
        <i class="fas fa-plus-circle"> Agregar Pregunta</i> <!-- Icono de Font Awesome -->
      </button>
    </div>
    <button class="crear-encuesta" type="button" @click="submitEncuesta">Crear Encuesta</button>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'EncuestaVue',
  data() {
    return {
      tituloEncuesta: '',
      fechaLimite: '',
      preguntas: [],
      dragIndex: null,
      menuOpen: false,
      profileMenuOpen: false,
      password: '',
      usuarioActual: null,
      showCurrentPassword: false,
      idCounterEncuesta: parseInt(localStorage.getItem('idCounterEncuesta') || '0') + 1,


    };
  },
  computed: {
    //Formato de fecha minima
    fechaMinima() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const hh = String(today.getHours()).padStart(2, '0');
      const min = String(today.getMinutes()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    },
    //Ajuste de formato de fecha
    fechaLimiteFormato() {
      if (!this.fechaLimite) return '';
      const fechaHora = new Date(this.fechaLimite);
      const dd = String(fechaHora.getDate()).padStart(2, '0');
      const mm = String(fechaHora.getMonth() + 1).padStart(2, '0');
      const yyyy = fechaHora.getFullYear();
      const hh = String(fechaHora.getHours()).padStart(2, '0');
      const min = String(fechaHora.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    },
    //Validaciónde fecha
    esFechaLimiteValida() {
      const ahora = new Date();
      const fechaLimite = new Date(this.encuesta.fechaLimite);
      return fechaLimite > ahora || (fechaLimite.toDateString() === ahora.toDateString() && fechaLimite > ahora);
    }
  },
  created() {
    // Intenta recuperar el usuario actual desde localStorage al cargar el componente
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (usuarioActual) {
      this.usuarioActual = usuarioActual;
    } else {
      // Manejo si no se encuentra un usuario actual en localStorage (opcional)
      // Redireccionar o manejar como corresponda si no hay un usuario logueado
    }
  },
  methods: {
    //Ocultar y mostrar contraseña
    toggleCurrentPasswordVisibility() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    //Agregar pregunta
    agregarPregunta() {
      this.preguntas.push({
        texto: '',
        tipo: '',
        opciones: []
      });
    },
    //Eliminar pregunta
    eliminarPregunta(index) {
      this.preguntas.splice(index, 1);
    },
    //Agregar opción
    agregarOpcion(pregunta) {
      if (!pregunta.opciones) {
        this.$set(pregunta, 'opciones', []);
      }
      pregunta.opciones.push('');
    },
    //Eliminar opción
    eliminarOpcion(pregunta, index) {
      pregunta.opciones.splice(index, 1);
    },
    //Actualizar opción
    updateOpcion(pregunta, index, event) {
      pregunta.opciones[index] = event.target.value;
    },
    //Mover secciones de preguntas
    dragStart(index) {
      this.dragIndex = index;
    },
    dropItem(index) {
      const pregunta = this.preguntas[this.dragIndex];
      this.preguntas.splice(this.dragIndex, 1);
      this.preguntas.splice(index, 0, pregunta);
      this.dragIndex = null;
    },
    //Menú desplegable
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleProfileMenu() {
      this.profileMenuOpen = !this.profileMenuOpen;
    },
    cerrarSesion() {
      // Limpiar localStorage y redirigir al usuario a la página de inicio de sesión
      localStorage.removeItem('usuarioActual');
      this.$router.push('/login');
    },
    validarDatosEncuesta() {
      if (!this.tituloEncuesta || !this.fechaLimite || !this.password) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, complete todos los campos',
        });
        return false;
      }

      if (new Date(this.fechaLimite) < new Date()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Seleccione una fecha y hora posterior a la actual.',
        });
        return false;
      }

      for (const pregunta of this.preguntas) {
        if (!pregunta.texto || !pregunta.tipo) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Todas las preguntas deben tener un texto y un tipo.',
          });
          return false;
        }

        if (pregunta.tipo === 'opcion-multiple' && pregunta.opciones.length === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las preguntas de opción múltiple deben tener al menos una opción.',
          });
          return false;
        }
      }

      return true;
    },
    submitEncuesta() {
      // Validar datos de la encuesta
      if (!this.validarDatosEncuesta()) {
        return;
      }
      // Construir objeto de encuesta
      const encuestaData = {
        id_encuesta: this.idCounterEncuesta,
        titulo: this.tituloEncuesta,
        fechaLimite: this.fechaLimite,
        preguntas: this.preguntas,
        password: this.password,
        usuario: this.usuarioActual,
      };

      // Guardar encuesta en localStorage (o en tu API)
      let encuestas = JSON.parse(localStorage.getItem('encuestas')) || [];
      encuestas.push(encuestaData);
      localStorage.setItem('encuestas', JSON.stringify(encuestas));
      localStorage.setItem('idCounterEncuesta', this.idCounterEncuesta.toString());

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Encuesta creada con éxito',
        text: 'Tu encuesta ha sido creada satisfactoriamente.',
        confirmButtonText: 'Aceptar'
      });

      // Redirigir al usuario
      this.$router.push('/index');
    }
  }
};
</script>

<style scoped>
@import '../assets/estilos/encuesta.css';

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

.container {
  margin-top: 150px;
  background-color: white;
  border-radius: 20px;
  width: 60%;
  padding-bottom: 50px;
  box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.3);
  /* Sombras */

}

.input-contenedor {
  justify-content: center;
}

.titulo {
  color: #009292;
  /* Color del texto */
  padding-top: 40px;
  padding-bottom: 20px
}

.espacio {
  margin-top: 100px;
}

.pregunta-header {
  display: flex;
  align-items: center;
}

.pregunta-numero {
  margin-right: 10px;
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
</style>