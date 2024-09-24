<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <div v-if="message" :class="messageType">{{ message }}</div>
  </div>
</template>

<script>
import { supabase } from '../supabaseClient.js';

export default {
  data() {
    return {
      email: '',
      password: '',
      message: '',
      messageType: '',
    };
  },
  methods: {
    async loginUser() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      if (error) {
        this.message = error.message;
        this.messageType = 'is-danger';
      } else {
        console.log('Login data:', data); // Log data for debugging
        this.message = 'Login successful!';
        this.messageType = 'is-success';
        this.$router.push({ name: 'Chat', params: { userId: data.user.id, receiverId: 1 } }); // Modify receiverId as needed
      }
    },
  },
};
</script>
