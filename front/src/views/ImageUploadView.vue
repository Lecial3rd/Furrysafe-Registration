<template>
  <div>
    <h1>Image Upload</h1>
    <image-upload @image-uploaded="handleImageUploaded" />
  </div>
</template>

<script>
import ImageUpload from '../components/ImageUpload.vue'

export default {
  components: {
    ImageUpload
  },
  methods: {
    handleImageUploaded(data) {
      console.log('Image uploaded:', data)

    }
  }
}
</script>

<style scoped>
</style>
