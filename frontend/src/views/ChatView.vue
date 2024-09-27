<template>
    <div>
      <h1>Chat Room</h1>
      <Chat />
    </div>
  </template>
  
  <script>
  import Chat from '../components/Chat.vue'
  
  export default {
    components: {
      Chat,
    },
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
  }
  </style>
  