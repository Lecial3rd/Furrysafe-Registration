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
          <input class="input" type="text" v-model="form.middle_initial" maxlength="1">
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
import { supabase } from '../supabaseClient.js'

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
        // Insert into tbl_user
        const { data: userData, error: userError } = await supabase
          .from('tbl_user')
          .insert([{ user_email: this.form.user_email, user_password: this.form.user_password }])
          .select()

        if (userError) throw userError

        const user_id = userData[0].user_id

        // Insert into tbl_user_details
        const { error: detailsError } = await supabase
          .from('tbl_user_details')
          .insert([{
            user_id,
            user_username: this.form.user_username,
            firstname: this.form.first_name,
            mi: this.form.middle_initial,
            lastname: this.form.last_name,
            date_of_birth: this.form.date_of_birth,
            gender: this.form.gender
          }])

        if (detailsError) throw detailsError

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

      } catch (error) {
        this.message = 'User creation failed: ' + error.message
        this.messageType = 'is-danger'
      }
    }
  }
}
</script>
