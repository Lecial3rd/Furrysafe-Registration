<template>
    <div>
      <h1>Register User</h1>
      <user-registration @user-registered="handleUserRegistered" />
    </div>
  </template>
  
  <script>
  import UserRegistration from '../components/userRegistration.vue'
  
  export default {
    components: {
      UserRegistration
    },
    methods: {
      handleUserRegistered(user) {
        console.log('User registered:', user)
        
      }
    }
  }
  </script>
  
  <style>
  
  </style>
  