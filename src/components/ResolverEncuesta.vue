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
      <li><router-link v-if="!encuesta" to="/resolver" class="open">Encuestas Disponibles</router-link></li>
      <li class="profile-menu">
        <router-link to="" @click.stop="toggleProfileMenu">Perfil</router-link>
        <ul v-if="profileMenuOpen" class="dropdown-menu" ref="profileMenu">
          <li><router-link to="/perfil">Ver Perfil</router-link></li>
          <li @click="cerrarSesion"><router-link to="">Cerrar Sesión</router-link></li>
        </ul>
      </li>
    </ul>
  </nav>

  <!-- Botones de encuestas -->
  <div v-if="!encuesta" class="boton-encuesta">
    <router-link to="/disponible" class="button">Mis Encuestas</router-link>
    <router-link to="/resolver" class="button-active">Disponibles</router-link>
  </div>

  <!-- Contenedor principal -->
  <div class="container available-surveys">
    <div v-if="encuestas.length > 0 && !encuesta">
      <div class="survey-list">
        <div v-for="(encuesta, index) in encuestas" :key="index" class="survey-card">
          <div class="img"></div>
          <h3 class="survey-title">{{ encuesta.titulo }}</h3>
          <p class="survey-description">Creado por: {{ encuesta.creador }}</p>
          <button @click="mostrarPreguntas(index)" class="btn btn-resolver">
            <i class="fas fa-chart-line"> Resolver</i>
          </button>
          <p v-if="encuesta.vencida" class="encuesta-vencida">Encuesta vencida</p>
        </div>
      </div>
    </div>
  <!-- Contenedor para resolver pregunta -->
    <div v-if="encuesta">
      <nav class="nav-main" :class="{ 'nav-open': menuOpen }">
        <div @click="volverALista" class="volver-flecha">
          <i class="fas fa-arrow-left"> Volver</i>
        </div>
        <ul class="nav-menu" :class="{ 'show': menuOpen }">
          <li><router-link to="" class="open">Resolver Encuesta</router-link></li>
        </ul>
      </nav>
      <div class="jod">
        <div class="vista-previa">
          <div class="fondo">
            <h2>{{ encuesta.titulo }}</h2>
          </div>
          <p>Hola, {{ usuarioActual.nombre }}. Cuando envíe este formulario, el propietario verá su nombre y dirección de correo electrónico.</p>
          <div v-for="(pregunta, pIndex) in encuesta.preguntas" :key="pIndex">
            <div class="preg">
              <p class="pregunta-numero">{{ pIndex + 1 }}. {{ pregunta.texto }}</p>
              <div v-if="pregunta.tipo === 'opcion-multiple'" class="opciones-multiples-container">
                <div v-for="(opcion, oIndex) in pregunta.opciones" :key="oIndex" class="opcion-item">
                  <input type="radio" :name="'pregunta' + pIndex" :value="opcion" v-model="respuestas[pIndex]" class="opcion-input" />
                  <label class="opcion-label">{{ opcion }}</label>
                </div>
              </div>
              <div v-else-if="pregunta.tipo === 'parrafo'">
                <textarea v-model="respuestas[pIndex]" class="parrafo" placeholder="Escriba su respuesta aquí"></textarea>
              </div>
            </div>
          </div>
          <button @click="submitRespuestas" class="enviar-respuestas">Enviar Respuestas</button>
        </div>
      </div>
    </div>
    <!-- Mensaje si no hay encuestas disponibles -->
    <div v-else-if="encuestas.length === 0">
      <p>No hay encuestas disponibles para responder.</p>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'ResponderEncuestaVue',
  data() {
    return {
      encuestas: [],
      encuesta: null,
      respuestas: [],
      usuarioActual: null,
      menuOpen: false,
      profileMenuOpen: false,
      encuestaRespondida: false,
    };
  },
  created() {
    this.obtenerUsuarioActual();
    this.obtenerEncuestasLocalStorage();
  },
  methods: {
    obtenerUsuarioActual() {
      const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
      if (usuarioActual) {
        this.usuarioActual = { nombre: usuarioActual.nombre, email: usuarioActual.email };
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleProfileMenu() {
      this.profileMenuOpen = !this.profileMenuOpen;
    },
    cerrarSesion() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      this.$router.push('/login');
    },
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
    },
    //Mostrar preguntas
    mostrarPreguntas(index) {
      const encuesta = this.encuestas[index];

      if (encuesta.vencida) {
        Swal.fire({
          icon: 'warning',
          title: 'Encuesta vencida',
          text: 'Esta encuesta ha vencido. No se puede responder.'
        });
        return;
      }

      if (this.encuestaRespondida) {
        Swal.fire({
          icon: 'info',
          title: 'Encuesta ya respondida',
          text: 'Usted ya ha respondido esta encuesta anteriormente.'
        });
        return;
      }

      Swal.fire({
        title: 'Contraseña para Resolver',
        html: `
          <div class="input-contenedor">
            <div class="input-wrapper">
              <i class="fas fa-key icon icon"></i>
              <input id="swal-input-password" type="password" placeholder="Ingresa tu contraseña">
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
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
          if (password === encuesta.password) {
            this.encuesta = encuesta;
            this.respuestas = this.encuesta.preguntas.map(() => '');
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Contraseña incorrecta',
            });
          }
        }
      }).catch((error) => {
        console.log('ERROR', error);
      });
    },
    //Enviar respuestas si se cumplen las validaciones
    submitRespuestas() {
      if (this.respuestas.some(respuesta => respuesta === '')) {
        Swal.fire({
          icon: 'error',
          title: 'Respuestas incompletas',
          text: 'Debe responder todas las preguntas antes de enviar.',
        });
        return;
      }

      if (this.encuesta && !this.encuestaRespondida) {
        const respuestasData = {
          encuestaId: this.encuesta.id_encuesta,
          encuestaTitulo: this.encuesta.titulo,
          creador: this.encuesta.creador, // Añadir el creador de la encuesta

          preguntas: this.encuesta.preguntas.map((pregunta, index) => ({
            texto: pregunta.texto,
            respuesta: this.respuestas[index]
          })),
          usuario: {
            nombre: this.usuarioActual.nombre,
            email: this.usuarioActual.email
          }
        };

        // Guardar respuestas en localStorage
        let respuestas = JSON.parse(localStorage.getItem('respuestas')) || [];
        respuestas.push(respuestasData);
        localStorage.setItem('respuestas', JSON.stringify(respuestas));

        // Marcar la encuesta como respondida por este usuario
        this.encuestaRespondida = true;

        Swal.fire({
          icon: 'success',
          title: '¡Respuestas enviadas!',
          text: 'Sus respuestas han sido enviadas correctamente.',
        }).then(() => {
          this.encuesta = null; // Volver a la lista de encuestas después de enviar
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Encuesta ya respondida',
          text: 'Usted ya ha respondido esta encuesta anteriormente.',
        });
      }
    },
    volverALista() {
      this.encuesta = null;
    }
  }
};
</script>

<style scoped>
.jod {
  margin-top: 170px;
  padding-bottom: 40px;
}

.vista-previa {
  border-radius: 10px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: white;
  justify-content: center;
  width: 800px;
  margin: 0 auto;
  padding-bottom: 40px;
  box-shadow: 0 0 10px rgba(3, 3, 3, 7);

}

.vista-previa h2 {
  color: white;
  text-align: left;
  padding: 25px;
}

.vista-previa p {
  color: #000000;
  padding-top: 20px;
  padding-bottom: 40px;

  font-size: 25px;
  padding-left: 40px;
  padding-right: 40px;

  text-align: left;
}

.preg p {
  color: #000000;
  padding-top: 20px;
  padding-bottom: 40px;

  font-size: 20px;
  padding-left: 50px;
  text-align: left;
}

.pregunta-numero {
  color: black;
  padding-left: 40px;
  text-align: left;
  justify-content: left;
  margin-right: 40px;
}


/* Contenedor principal para las opciones múltiples */
.opciones-multiples-container {
  justify-content: left;
  text-align: left;
  margin-left: -630px;
  margin-top: -30px
}

/* Estilo para cada item de opción (input y label) */
.opcion-item {
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  text-align: left;

}

/* Estilo específico para el input de tipo radio */
.opcion-input {
  margin-left: auto;
  padding-left: 2px
}

/* Estilo para la etiqueta que muestra el texto de la opción */
 .opcion-label {
  font-size: 16px;
  color: #333;
  flex: 1;  
  margin-left: -670px


}
.fondo {
  background-color: #0c9191;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 20px;
}

.encuesta-vencida {
  color: red;
}

.encuesta-detalle p,
h2 {
  color: black
}

.preg .parrafo {
  width: 700px;
  margin-top: -18px
}

.preg .parrafo:focus {
  outline: none;
  border-color: #329977;
  box-shadow: 0 0 5px #329977;
}

.volver-flecha {
  padding-left: 20px;
  cursor: pointer;
}

.volver-flecha:hover {
  color: aqua;
}

/* Estilos para las encuestas disponibles */
.img {
  background-color: #0c9191;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 65px;
  background-image: url('/src/assets/imagen2.png');
  width: 350px;
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
  width: 300px;
  box-shadow: 0 0 10px rgba(3, 3, 3, 7);
  transition: transform 0.3s ease;
  padding-bottom: 20px;
  margin-right: 20px;
  width: 350px;
}

.survey-card:hover {
  transform: translateY(-5px);
}

.survey-title {
  font-size: 24px;
  margin-bottom: 15px;
  margin-top: 15px;
  color: black;
  text-align: left;
}

.survey-description {
  font-size: 16px;
  margin-bottom: 20px;
  color: black;
  text-align: left;
}

.survey-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.survey-actions .btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: white;
  width: 80%;
  justify-content: center;
  /* Centrar icono horizontalmente */
}

.btn-edit {
  background-color: #007bff;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-resolver {
  background-color: #007bff;
  justify-content: center;
}

.btn-resolver:hover {
  background-color: #0056b3;
}

.boton-encuesta {
  margin-top: 150px;
  justify-content: center;
  text-align: center;

}

.boton-encuesta .button {
  justify-content: center;
  margin-right: 10px;

  margin-left: 5px;
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

.pregunta-numero {
  color: black;
}

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
</style>
