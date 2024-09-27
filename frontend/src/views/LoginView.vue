<template>
    <div>
      <h1>Login</h1>
      <Login />
    </div>
  </template>
  
  <script>
  import Login from '../components/Login.vue'
  
  export default {
    components: {
      Login,
    },
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  </style>
  