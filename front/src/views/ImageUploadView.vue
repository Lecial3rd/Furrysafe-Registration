<template>
  <div>
    <h1>Upload Image</h1>
    <form @submit.prevent="uploadImage">
      <div class="field">
        <label class="label">Select Image</label>
        <div class="control">
          <input class="input" type="file" @change="handleFileUpload" accept="image/*" required>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">Upload</button>
        </div>
      </div>
    </form>

    <div v-if="message" class="notification" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabaseClient'

export default {
  data() {
    return {
      file: null,
      message: '',
      messageType: ''
    }
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async uploadImage() {
      if (!this.file) return;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(`public/${this.file.name}`, this.file);

      if (error) {
        this.message = 'Image upload failed: ' + error.message;
        this.messageType = 'is-danger';
      } else {
        this.message = 'Image uploaded successfully!';
        this.messageType = 'is-success';
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
