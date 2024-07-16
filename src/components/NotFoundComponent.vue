<template>
    <div class="not-found">
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no está disponible.</p>
      <button @click="goBack" class="btn-go-back">Volver a la página anterior</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundComponent',
    methods: {
      goBack() {
        this.$router.go(-1); // Vue Router method to go back one step in history
      }
    }
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 20vh;
  }
  
  .not-found h1 {
    font-size: 6rem;
    color: #333;
  }
  
  .not-found h2 {
    font-size: 2.5rem;
    color: #555;
  }
  
  .not-found p {
    font-size: 1.2rem;
    color: #777;
    margin-bottom: 20px;
  }
  
  .btn-go-back {
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .btn-go-back:hover {
    background-color: #0056b3;
  }
  </style>
  