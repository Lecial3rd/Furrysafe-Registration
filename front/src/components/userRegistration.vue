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
      // Use Supabase Auth for sign-up
      const { user, error: authError } = await supabase.auth.signUp({
        email: this.form.user_email,
        password: this.form.user_password
      });

      if (authError) throw new Error(`Auth Error: ${authError.message}`);

      // Notify the user to check their email for verification
      this.message = 'Registration successful! Please check your email to verify your account.';
      this.messageType = 'is-success';

      // Insert into tbl_user
      const { data: userData, error: userError } = await supabase
        .from('tbl_user')
        .insert([{ user_email: this.form.user_email, user_password: this.form.user_password, date_created: new Date() }])
        .select();

      if (userError) throw new Error(`User Insertion Error: ${userError.message}`);

      const user_id = userData[0].user_id;

      // Prepare user details with checks for empty values
      const userDetails = {
        user_id,
        user_username: this.form.user_username || null,
        firstname: this.form.first_name || null,
        mi: this.form.middle_initial || null,
        lastname: this.form.last_name || null,
        date_of_birth: this.form.date_of_birth ? new Date(this.form.date_of_birth).toISOString().split('T')[0] : null,
        gender: this.form.gender || null
      };

      console.log("User Details to Insert:", userDetails);  // Log user details

      // Insert into tbl_user_details
      const { error: detailsError } = await supabase
        .from('tbl_user_details')
        .insert([userDetails]);

      if (detailsError) throw new Error(`Details Insertion Error: ${detailsError.message}`);

    } catch (error) {
      this.message = `Registration failed: ${error.message}`;
      this.messageType = 'is-danger';
    }
  }
}
}
</script>
