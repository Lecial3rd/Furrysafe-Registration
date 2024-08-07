<template>
  <div>
    <form @submit.prevent="registerUser">
      <div class="field">
        <label class="label">Username</label>
        <div class="control">
          <input class="input" type="text" v-model="form.user_username" required>
        </div>
      </div>
      <div class="field">
        <label class="label">First Name</label>
        <div class="control">
          <input class="input" type="text" v-model="form.first_name" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Middle Initial</label>
        <div class="control">
          <input class="input" type="text" v-model="form.middle_initial">
        </div>
      </div>
      <div class="field">
        <label class="label">Last Name</label>
        <div class="control">
          <input class="input" type="text" v-model="form.last_name" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input class="input" type="email" v-model="form.user_email" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="password" v-model="form.user_password" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Date of Birth</label>
        <div class="control">
          <input class="input" type="date" v-model="form.date_of_birth" required>
        </div>
      </div>
      <div class="field">
        <label class="label">Gender</label>
        <div class="control">
          <div class="select">
            <select v-model="form.gender">
              <option value="">Prefer not to say</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">Register</button>
        </div>
      </div>
    </form>

    <div v-if="message" class="notification" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        user_username: '',
        first_name: '',
        middle_initial: '',
        last_name: '',
        user_email: '',
        user_password: '',
        date_of_birth: '',
        gender: ''
      },
      message: '',
      messageType: ''
    }
  },
  methods: {
    async registerUser() {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        })
        const data = await response.json()
        if (response.ok) {
          this.message = 'User created successfully!'
          this.messageType = 'is-success'
          this.form = {
            user_username: '',
            first_name: '',
            middle_initial: '',
            last_name: '',
            user_email: '',
            user_password: '',
            date_of_birth: '',
            gender: ''
          }
        } else {
          this.message = 'User creation failed: ' + (data.error || 'Unknown error')
          this.messageType = 'is-danger'
        }
      } catch (error) {
        this.message = 'An error occurred: ' + error.message
        this.messageType = 'is-danger'
      }
    }
  }
}
</script>

<style scoped>
.notification {
  margin-top: 1em;
}
.is-success {
  background-color: #48c774;
  color: white;
}
.is-danger {
  background-color: #f14668;
  color: white;
}
</style>
