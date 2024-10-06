<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            class="input"
            type="email"
            v-model="email"
            required
            placeholder="Enter your email"
            @blur="validateEmail"
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            required
            placeholder="Enter your password"
            @input="validatePassword"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="toggle-password"
          >
            {{ showPassword ? 'Hide' : 'Show' }}
          </button>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button
            class="button is-primary"
            type="submit"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loader"></span>
            <span v-else>Login</span>
          </button>
        </div>
      </div>
      <div v-if="message" class="notification" :class="messageType">
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      message: '',
      messageType: '',
      showPassword: false,
      isLoading: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.message = 'Please enter a valid email address.';
        this.messageType = 'is-danger';
      } else {
        this.message = '';
      }
    },
    validatePassword() {
      if (this.password.length < 6) {
        this.message = 'Password must be at least 6 characters long.';
        this.messageType = 'is-danger';
      } else {
        this.message = '';
      }
    },
    async loginUser() {
      if (!this.message) { // Only proceed if no validation errors
        this.isLoading = true;
        try {
          const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
          });

          const result = await response.json();
          console.log(result); // Debug backend response

          if (!response.ok) {
            this.message = result.error || 'Invalid email or password';
            this.messageType = 'is-danger';
            return;
          }

          // Save user details in sessionStorage
          sessionStorage.setItem('user_id', result.user_id);
          sessionStorage.setItem('email', result.email);
          sessionStorage.setItem('fullname', result.fullname); // Store full name

          // Redirect to chat after successful login
          console.log('Login successful. Redirecting to Chat...');
          this.$router.push({ name: 'Chat' });
        } catch (error) {
          this.message = 'An error occurred during login';
          this.messageType = 'is-danger';
          console.error(error);
        } finally {
          this.isLoading = false;  // Reset loading state
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
}

.toggle-password {
  margin-left: 10px;
  cursor: pointer;
}

.loader {
  border: 2px solid transparent;
  border-radius: 50%;
  border-top-color: #007bff; /* Adjust color to match your theme */
  width: 15px;
  height: 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
