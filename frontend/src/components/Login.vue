<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input class="input" type="email" v-model="email" required placeholder="Enter your email" />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="password" v-model="password" required placeholder="Enter your password" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">Login</button>
        </div>
      </div>
      <div v-if="message" class="notification" :class="messageType">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfcvjlhlhbpvzhqodkny.supabase.co'; // Replace with your Supabase URL
// Replace with your Supabase service key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY3ZqbGhsaGJwdnpocW9ka255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDE2MTE2NCwiZXhwIjoyMDM5NzM3MTY0fQ.yFh1fTfgGKn_hNYBvrp8WbfiMIfxK1uhVta81cwq6v0';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      try {
        // Perform login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password,
        });

        // Handle response
        if (error) {
          this.message = error.message;
          this.messageType = 'is-danger';
          return; // Exit if there's an error
        }

        // Check if user object is returned
        if (data && data.user) {
          console.log('Login successful:', data); // Log the user data for debugging
          this.message = 'Login successful! Redirecting...';
          this.messageType = 'is-success';

          // Store user ID in local storage
          localStorage.setItem('user_id', data.user.id);
          
          // Redirect to chat view
          this.$router.push({ name: 'Chat', params: { userId: data.user.id } }); // Modify receiverId as needed
        } else {
          this.message = 'Login failed: User object is undefined.';
          this.messageType = 'is-danger';
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        this.message = `Unexpected error: ${error.message}`;
        this.messageType = 'is-danger';
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
}
</style>
