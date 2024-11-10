<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @click.self="$emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg mx-4 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">

              <div class="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                <div class="flex justify-end">
                  <button @click="$emit('close')" ref="cancelButtonRef">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <DialogTitle as="h3"
                  class="mb-[1.5rem] text-[1.3rem] font-semibold leading-6 text-gray-700 flex justify-center">
                  <!-- if edit "Edit report.." if create "create report..."- joey -->
                  {{ mode === 'edit' ? 'Edit Shelter Post' : 'Create New Post' }}
                </DialogTitle>
                <div>
                  <PetList @petSelected="handlePetSelected" />
                </div>
                <div class="text-sm mt-1.5">
                  <div class="flex flex-col">
                    <label for="petName" class="font-medium leading-6 text-gray-700">
                      Nickname</label>
                    <input v-model="nickname" type="text" name="petName" id="petName" placeholder="Nickname"
                      class="mt-1.5 border rounded-md p-1.5 px-6" readonly>
                  </div>
                  <div class="flex flex-col mt-1.5">
                    <label for="rehomed" class="font-medium leading-6 text-gray-700">
                      Date Re-homed</label>
                    <input v-model="daterehomed" type="text" name="rehomed" placeholder="Date Rehomed"
                      class="mt-1.5 border rounded-md p-1.5 px-6" readonly>
                  </div>
                  <div class="flex flex-col mt-1.5">
                    <label for="petBreed" class="font-medium leading-6 text-gray-700">
                      Breed / Mix</label>
                    <input v-model="breed" type="text" name="petName" id="petName" placeholder="Breed"
                      class="mt-1.5 border rounded-md p-1.5 px-6" readonly>
                  </div>
                </div>

                <div class="mt-2">
                  <textarea v-model="newpost" placeholder="Write a caption or description of this post..."
                    class="border rounded-lg py-[1rem] px-6 w-full h-[8rem]" />
                </div>

                <div v-if="imageUrls.length > 0" class="outline-dashed outline-2 outline-offset-3 outline-gray-200 rounded-lg p-2 my-2">
                  <div class="px-4 my-2 mx-2 sm:col-span-2 sm:px-0">
                    <ul role="list" class="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
                      <li v-for="(imageUrl, index) in imageUrls" :key="index" class="relative">
                        <div
                          class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                          <img :src="imageUrl" alt="" class="pointer-events-none w-full sm:h-52 lg:h-40 object-cover" />
                          <button @click.prevent="removeImage(index)"
                            class="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" stroke-width="2" class="w-4 h-4">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="px-[2rem] py-[1rem]">
                  <div class="flex justify-between mb-3">
                    <span class="text-gray-400 text-[14px]">Add to your post</span>
                    <label for="file-input" class="cursor-pointer flex gap-3 items-center">
                      <input type="file" multiple @change="handleFileChange" id="file-input" ref="fileInput"
                        @click="imageclicked" class="hidden" />
                      <img :src="images" alt="Images Icon" class="h-[2rem] w-[2rem]" />
                    </label>
                  </div>
                </div>
                <div class="flex justify-center">
                  <!-- Nov5 @click="handleSubmit replace to -->
                  <button type="button" :disabled="isLoading" @click="submitPost"
                    class="flex rounded-lg w-full bgteal justify-center py-2 text-sm font-semibold text-white shadow-sm hover:bg-lightteal">
                    <!-- {{ mode === 'edit' ? 'Save Changes' : 'Post' }} Nov5 orig code replace to salpocial's-->
                    {{ isLoading ? 'Posting...' : mode === 'edit' ? 'Save Changes' : 'Post' }}
                  </button>
                </div>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import axios from "axios"
import PetList from '@/components/Shelter/shelter_NewpostModal_SearchPetProfile.vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// joey added not use because of Salpocial's new code Nov5
// import { defineProps } from 'vue'; // for reusing the form defining mode receive either edit or create yeahhh - joey

// const props = defineProps({ // for reuse form defines mode if either edit or create - joey
//   mode: {
//     type: String,
//     required: true
//   }
// });

// Function to handle submission based on mode ( if edit button or create button) - joey
// const handleSubmit = () => {
//   if (props.mode === 'edit') {
//     // Logic for editing
//     console.log('Editing post...');
//   } else {
//     // Logic for creating
//     console.log('Creating post...');
//   }
// };
// end of reuse the modal


// Nov5 added 'post-created' - salpocial's code
// Emit events for modal control and post creation
const emit = defineEmits(['close', 'post-created']) // for closing the modal with close button - joey added

// to close press esc
onMounted(() => {
  const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
  window.addEventListener('keydown', closeModalOnEsc)
  onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})

// Reactive state
const open = ref(true);
const fileInput = ref(null);
const imageUrls = ref([]);
const images = 'https://img.icons8.com/fluency/48/stack-of-photos.png';

// Nov5 start 
const isLoading = ref(false)
const newpost = ref('')
const selectedPetInfo = ref([])
const nickname = ref('')
const breed = ref('')
const daterehomed = ref('')
const post = reactive({
  user_id: localStorage.getItem('u_id'),
  pet_id: null,
  content: '',
  latitude: null,
  longitude: null,
  photo_urls: []
})
// end

// Handle file change and load images
const handleFileChange = (event) => {
  console.log("file change")
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (event) => {
      imageUrls.value.push(event.target.result);
    };
    reader.readAsDataURL(file);
  }
  // fileInput.value.value = null; not in salpocial's code Nov5
}

function imageclicked() {
  console.log("clicked")
}

// Remove image from list
const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
}

// Jeneh's code replace by salpocial's code Nov5 replace code below
// const selectedPetInfo = ref([]);
// const name = ref('');
// const nickname = ref('');
// const breed = ref('');
// const daterehomed = ref('');

// Handle the event from the child component
// function handlePetSelected(info) {
//   console.log("selection change")
//   imageUrls.value = []
//   console.log(imageUrls.value)

//   selectedPetInfo.value = info;
//   name.value = selectedPetInfo.value[0].name
//   nickname.value = selectedPetInfo.value[0].nickname
//   breed.value = selectedPetInfo.value[0].breed
//   daterehomed.value = selectedPetInfo.value[0].rehomed
//   imageUrls.value.push(
//     selectedPetInfo.value[0].profile
//   )
// }

// Nov5 Salpocial's replacement
// Handle pet selection from the PetList component
// function handlePetSelected(info) {
//   console.log("Selected Pet Info:", info); // Debugging line
//   selectedPetInfo.value = info

//   if (selectedPetInfo.value.length > 0) {
//     imageUrls.value = []
//     const selectedPet = selectedPetInfo.value[0]
//     post.pet_id = selectedPet.id
//     nickname.value = selectedPet.nickname
//     breed.value = selectedPet.breed
//     daterehomed.value = selectedPet.rehomed
//     imageUrls.value.push(selectedPet.profile)
//     console.log("Pet ID set to:", post.pet_id); // Debugging line
//   } else {
//     post.pet_id = null
//   }
// }



// new added line in newpostmodal, changes because of the search combobox
function handlePetSelected(info) {
  console.log("Selected Pet Info:", info); // Debugging line

  // Ensure selectedPet is defined and reactive
  if (info) {
    selectedPetInfo.value = info; // Set the reactive selectedPet value

    const selected = selectedPetInfo.value; // Access the value of selectedPet

    if (selected && selected.id) {
      // Proceed with logic for a valid selected pet
      imageUrls.value = [];  // Clear previous images
      post.pet_id = selected.id;  // Set pet id
      nickname.value = selected.nickname;  // Set nickname
      breed.value = selected.breed;  // Set breed
      daterehomed.value = selected.rehomed;  // Set rehomed date

      // Check if a valid profile image exists - joey added
      if (selected.profile) {
        imageUrls.value.push(selected.profile);  // Add profile image URL
      } else {
        console.warn("No profile image found for the selected pet.");
        alert('No profile image found for the selected pet.');
      }

      console.log("Pet ID set to:", post.pet_id); // Debugging line
    } else {
      console.error("Invalid selected pet:", selected);  // Handle invalid selection
    }
  } else {
    console.error("No pet info received:", info);  // Handle case where info is invalid
  }
}
// end of new line added in Nov8 - joey


// Submit Post
// async function submitPost() {
//   console.log("User ID:", post.user_id);
//   console.log("Pet ID:", post.pet_id);
//   console.log("Content:", newpost.value);

//   if (isLoading.value) return

//   // Check for required fields
//   if (!post.user_id || !post.pet_id || !newpost.value) {
//     alert("Please complete all required fields.")
//     return
//   }

//   try {
//     isLoading.value = true

//     const formData = new FormData()
//     formData.append('user_id', post.user_id.toString())
//     formData.append('pet_id', post.pet_id)
//     formData.append('content', newpost.value)
//     formData.append('photo_urls', JSON.stringify(imageUrls.value))

//     const fileInput = document.getElementById('file-input')

//     if (fileInput && fileInput.files) {
//       Array.from(fileInput.files).forEach((file) => {
//         formData.append('photos', file)
//       })
//     }

//     const response = await axios.post('http://localhost:5000/insertshelterpost', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     })

//     if (response.data.success) {
//       emit('post-created')
//       emit('close')
//     } else {
//       throw new Error(response.data.message || 'Failed to create post')
//     }
//   } catch (error) {
//     console.error('Error submitting post:', error)
//     alert('Error submitting post: ' + error.message)
//   } finally {
//     isLoading.value = false
//   }
// }
async function submitPost() {
  console.log("User ID:", post.user_id);
  console.log("Pet ID:", post.pet_id);
  console.log("Content:", newpost.value);

  // Check if loading
  if (isLoading.value) return;

  // Check for required fields
  if (!post.user_id || !post.pet_id || !newpost.value) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    // Set loading state to true
    isLoading.value = true;

    // Create FormData object
    const formData = new FormData();
    formData.append('user_id', post.user_id.toString());
    formData.append('pet_id', post.pet_id.toString()); // Ensure pet_id is a string if required
    formData.append('content', newpost.value);

    // Add photo URLs (if any) to the FormData
    if (imageUrls.value && imageUrls.value.length > 0) {
      formData.append('photo_urls', JSON.stringify(imageUrls.value));
    }

    // Handle file input and append to FormData
    const fileInput = document.getElementById('file-input');
    if (fileInput && fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach((file) => {
        formData.append('photos', file); // Ensure this field name matches server expectations
      });
    }

    // Log the FormData contents for debugging
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    // Send the request
    const response = await axios.post('http://localhost:5000/insertshelterpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    // Check response
    if (response.data.success) {
      emit('post-created');
      emit('close');
    } else {
      throw new Error(response.data.message || 'Failed to create post');
    }

  } catch (error) {
    console.error('Error submitting post:', error);

    // Improved error handling to include more server-side details
    if (error.response && error.response.data) {
      console.error('Server responded with:', error.response.data);
      alert('Error submitting post: ' + (error.response.data.message || error.message));
    } else {
      alert('Error submitting post: ' + error.message);
    }

  } finally {
    // Reset loading state
    isLoading.value = false;
  }
}

</script>