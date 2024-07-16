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
      <li><router-link to="/resultado" class="open">Resultado</router-link></li>

      <li @click="cerrarSesion"><router-link to="">Salir de Administrador</router-link></li>
    </ul>
  </nav>
  <div class="encuestas">
    <h2>Respuestas de Encuestas</h2>

    <!-- Tabla principal de encuestas -->
    <div v-if="!detallesVisible">
      <table class="encuestas-table">
        <thead>
          <tr>
            <th>Id Encuesta</th>
            <th>Encuesta</th>
            <th>Creador de Encuestas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(encuesta, index) in encuestas" :key="index">
            <td>{{ encuesta.encuestaId }}</td>
            <td>{{ encuesta.encuestaTitulo }}</td>
            <td>{{ encuesta.creador }}</td>
            <td>
              <button class="btn-ver-detalles" @click="verDetalles(encuesta)">Ver detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detalles de la encuesta seleccionada -->
    <div v-if="detallesVisible" class="detalles-respuesta">
      <h3>Detalles de la Encuesta: {{ encuestaSeleccionada.encuestaTitulo }}</h3>
      <table class="detalles-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Usuario encuestado</th>
            <th>Email encuestado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(respuesta, respuestaIndex) in encuestaSeleccionada.respuestas" :key="respuestaIndex">
            <td>{{ respuestaIndex + 1 }}</td>
            <td>{{ respuesta.usuario.nombre }}</td>
            <td>{{ respuesta.usuario.email }}</td>
            <td>
              <button class="btn-ver-mas" @click="verRespuestasDetalle(respuesta)">Ver más detalles</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Botón para regresar a la lista de encuestas -->
      <button class="btn-regresar" @click="regresar">Regresar</button>

      <!-- Respuestas detalladas de la respuesta seleccionada -->
      <div v-if="respuestasDetalleVisible" class="detalles-respuesta">
        <h4>Respuestas Detalladas de {{ respuestaSeleccionada.usuario.nombre }}</h4>
        <table class="detalles-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pregunta</th>
              <th>Respuesta</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pregunta, preguntaIndex) in respuestaSeleccionada.preguntas" :key="preguntaIndex">
              <td>{{ preguntaIndex + 1 }}</td>
              <td>{{ pregunta.texto }}</td>
              <td>{{ pregunta.respuesta }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Botón para regresar a la lista de respuestas -->
        <button class="btn-regresar" @click="regresar">Regresar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      encuestas: [],
      detallesVisible: false,
      encuestaSeleccionada: null,
      respuestasDetalleVisible: false,
      respuestaSeleccionada: null,
      respuestaIndex: null, // para almacenar el índice de la respuesta seleccionada
      menuOpen: false,
      profileMenuOpen: false,
    };
  },
  mounted() {
    this.cargarEncuestas();
  },
  methods: {
    cargarEncuestas() {
      const respuestas = localStorage.getItem('respuestas');
      if (respuestas) {
        const respuestasParsed = JSON.parse(respuestas);
        const encuestasMap = new Map();
        respuestasParsed.forEach(respuesta => {
          if (!encuestasMap.has(respuesta.encuestaId)) {
            encuestasMap.set(respuesta.encuestaId, {
              encuestaId: respuesta.encuestaId,
              encuestaTitulo: respuesta.encuestaTitulo,
              creador: respuesta.creador,
              respuestas: [],
            });
          }
          encuestasMap.get(respuesta.encuestaId).respuestas.push({
            usuario: {
              nombre: respuesta.usuario.nombre,
              email: respuesta.usuario.email,
            },
            preguntas: respuesta.preguntas, // Asumiendo que cada respuesta tiene un arreglo de preguntas y respuestas
          });
        });
        this.encuestas = Array.from(encuestasMap.values());
      }
    },
    verDetalles(encuesta) {
      this.encuestaSeleccionada = encuesta;
      this.detallesVisible = true;
    },
    verRespuestasDetalle(respuesta) {
      this.respuestaSeleccionada = respuesta;
      this.respuestasDetalleVisible = true;
      this.respuestaIndex = this.encuestaSeleccionada.respuestas.indexOf(respuesta); // Guarda el índice de la respuesta seleccionada
    },
    regresar() {
      this.detallesVisible = false;
      this.respuestasDetalleVisible = false;
      this.respuestaSeleccionada = null;
      this.respuestaIndex = null;
    },
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
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css');

.encuestas {
  font-family: "Oswald", sans-serif;
  /* Fuente principal */
  max-width: 90%;
  margin: 0 auto;
  padding: 20px;
  margin-top: 100px
}

.encuestas h2 {
  font-size: 34px;
  margin-bottom: 20px;
  text-align: center;
  color: black;
}

.encuestas-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  /* Fondo blanco */
}

.encuestas-table th,
.encuestas-table td {
  border: 1px solid #6b5d5d;
  padding: 10px;
  text-align: left;
  color: #000000;
  /* Letras negras */
}

.encuestas-table th {
  background-color: #cccccc;
  font-weight: bold;
}

.btn-ver-detalles {
  padding: 8px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 30%;
}

.btn-ver-detalles:hover {
  background-color: green;
}

.btn-ver-mas {
  padding: 8px 12px;
  background-color: #2196F3;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 30%;
}

.btn-ver-mas:hover {
  background-color: blue;
}

.btn-regresar {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.btn-regresar:hover {
  background-color: red;
}

.detalles-respuesta {
  margin-top: 30px;
  color: #000000;
  /* Letras negras */
}

.detalles-table {
  width: 100%;
  border-collapse: collapse;
}

.detalles-table th,
.detalles-table td {
  border: 1px solid #6b5d5d;
  padding: 10px;
  text-align: left;
  background-color: #ffffff;
  /* Fondo blanco */
  color: #000000;
  /* Letras negras */
}

.detalles-table th {
  background-color: #cccccc;
  font-weight: bold;
}
</style>
