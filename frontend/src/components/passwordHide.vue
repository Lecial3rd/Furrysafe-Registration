<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

// Define props for password (coming from the parent)
const props = defineProps({
  modelValue: String, // This is the equivalent of v-model in the child
  passwordError: Boolean
});

// Define the emit function for two-way binding
const emit = defineEmits(['update:modelValue']);

// Local state for password visibility
const passwordType = ref('password');

// Local state for the password input
const password = ref(props.modelValue); // Sync the password from parent

// Watch the modelValue prop to sync it with local password
watch(() => props.modelValue, (newPassword) => {
  password.value = newPassword; // Update local password when parent changes it
});

// Watch the local password and emit back to the parent
watch(password, (newPassword) => {
  emit('update:modelValue', newPassword); // Emit updated password value to parent
});

// Toggle password visibility
const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

// Icon URLs for eye toggle
const eye = 'https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/4D4D4D/external-eye-basic-ui-elements-flatart-icons-outline-flatarticons.png';
const eyeHide = 'https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/4D4D4D/external-eye-devices-flatart-icons-outline-flatarticons.png';
</script>

<template>
  <div>
    <div>
      <label class="text-gray-800 text-sm mb-2 block font-semibold" for="email">Password </label>
    </div>
    <div class="relative">
      <!-- <input :type="passwordType" id="password" placeholder="Password"
        class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
        v-model="password" /> -->
      <input :type="passwordType" id="password" v-model="password"
        :placeholder="passwordError ? 'Password is required' : 'Password'" :class="[
          'w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm',
          { 'border-red-500 placeholder-red-500': passwordError }
        ]" required />

      <span class="absolute top-1/2 right-5 transform -translate-y-1/2">
        <!-- to hide icon-->
        <img v-if="passwordType === 'password'" :src="eyeHide" alt="Unsee Eye Icon"
          class="sm:w-4 sm:h-4 lg:w-5 lg:h-5 cursor-pointer" @click="togglePasswordVisibility" />
        <!-- to see icon-->
        <img v-else :src="eye" alt="Eye Icon" class="sm:w-4 sm:h-4 lg:w-5 lg:h-5 cursor-pointer"
          @click="togglePasswordVisibility" />
      </span>
    </div>
  </div>
</template>