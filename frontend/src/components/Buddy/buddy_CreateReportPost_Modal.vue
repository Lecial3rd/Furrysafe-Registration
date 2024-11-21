<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from "axios"

import Toast from '@/components/toast.vue';  // Ensure correct case for the file name
const toastRef = ref(null);  // Create a ref for the Toast component

import mapoverlay from '@/components/buddy_PinModal.vue'
const showMapModal = ref(false)
const options = ref([])

import PetList from '@/components/Shelter/shelter_NewpostModal_SearchPetProfile.vue' // Nov17 Import PetList

//flags
const photoflag = ref(true);
const locationflag = ref(true);

//for datas passing of data 
const data = ref([])
const id = localStorage.getItem('u_id')
const selectedPetId = ref(null);
const selectedCategory = ref('')
const lat = ref('');
const lng = ref('');
const selectedLocationAddress = ref('')
const selectedreportCategory = ref('')
const petcondition = ref('')
const reportDetails = ref('')
const reportPhoto = ref(['this is url'])
const other_selectedCategory = ref('')

const fileInput = ref(null);
const imageUrls = ref([]);
const images = 'https://img.icons8.com/fluency/48/stack-of-photos.png';
const category = ref([]);

const selectedPostDetailsValue = ref([])
const stringselectedreportCategory = ref('');
const stringselectedPetCategory = ref('');

import { defineProps } from 'vue'; // for reusing the form defining mode receive either edit or create yeahhh - joey
const props = defineProps({ // for reuse form defines mode if either edit or create - joey
  mode: {
    type: String,
    required: true
  },
  selectedPostDetails: {
    type: Object,
    required: false
  }
});


const clearAnimalTypeInput = () => {
  other_selectedCategory.value = '';
  selectedCategory.value = ''; // reset the selected animal type
};
function clearflags() {
  locationflag.value = true
  photoflag.value = true
}
const defaultOptionText = computed(() => {
  return options.value.length > 0 ? 'Select Missing Pet' : 'No Pet is Registered';
});
function getReportInput() { //used in both modes
  const formData = new FormData();
  data.value = []

  console.log(selectedreportCategory.value)

  photoflag.value = (imageUrls.value.length < 1) ? photoflag.value = false : photoflag.value = true
  locationflag.value = (selectedLocationAddress.value == '') ? locationflag.value = false : locationflag.value = true

  if (photoflag.value == true && locationflag.value == true) {
    data.value = [
      ['_user_id', id],
      ['_post_type', selectedreportCategory.value],
      ['_content', reportDetails.value],
      ['_lat', lat.value],
      ['_long', lng.value],
      ['_address', selectedLocationAddress.value],
      ['_pet_condition', petcondition.value],
      ['_pet_category', selectedCategory.value],
      ['_other_pet_category', other_selectedCategory.value],
      ['_pet_id', selectedPetId.value]
    ]

    data.value.forEach(([key, value]) => formData.append(key, value));
    imageUrls.value.forEach((file) => {
      formData.append(`photo_url`, file.file);
    })

    if (props.mode === 'edit') {
      console.log('Editing post...');
    } else {
      console.log('Creating post...');
      saveReport(formData)
    }
  }
}

// Handle file change and load images
const handleFileChange = (event) => {
  const files = event.target.files;
  console.log(files)
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const reader = new FileReader()
    reader.onload = (event) => {
      // files.value.push({ source: file.name, url: event.target.result })
      imageUrls.value.push({ file: file, url: event.target.result });
    }
    reader.readAsDataURL(file)
  }
}
function handleData(data) {
  console.log(data)
  selectedLocationAddress.value = data.address
  lat.value = data.lat
  lng.value = data.lng
}
async function getCategory() {
  try {
    const response = await axios.get("http://localhost:5000/load-category")
    category.value = response.data
  }
  catch (err) {
    console.log("error", err)
  }
  console.log(category.value)
}

const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
async function retrieveProfile() {
  try {
    const response = await axios.post("http://localhost:5000/profile", {
      _userid: id,
    });
    if (response.data && response.data.length > 0) {
      response.data.forEach(profile => {
        const _name_nickname = profile.name_nickname;
        const [name, nickname] = _name_nickname.split('/');

        options.value.push(
          {
            id: profile.id,
            name: capitalizeWords(name.trim()),
            nickname: capitalizeWords(nickname.trim()),
            petBreed: profile.breed,
            petCategory: profile.pet_category, // Nov17 Salpocials changes
            rehomed: profile.date_rehomed,
            profile: profile.profileurl
          }
        )
        console.log("options", options.value)

      })
    }
  }
  catch (err) {
    console.log("an error occured while retrieving profile", err)
  }
}
async function saveReport(formData) { //create function
  try {
    const response = await axios.post("http://localhost:5000/insertbuddyreport",
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' } // Correct header placement
      }
    );
    console.log("response: ", response)

    if (response.data.success) {
      if (toastRef.value && typeof toastRef.value.showToast === 'function') {
        toastRef.value.showToast('success', 'Post Successful');

        await new Promise(resolve => setTimeout(resolve, 800));  // Adjust delay as needed
        emit('close');
        // // Wait briefly for the form to close fully
      }
    } else {
      console.error('Failed to post:', response.data.message);
    }
  }
  catch (err) {
    console.log("error", err)
  }
}

const reportcategory = ref([]);
async function getReportCategory() {
  try {
    const response = await axios.get("http://localhost:5000/getreportcategory")
    const filteredCategories = response.data.filter(item => item.post_name !== 'Adoption');
    reportcategory.value = filteredCategories;
  }
  catch (err) {
    console.log("error", err)
  }
}

const reportidvalue = computed(() => {
  const selectedItem = reportcategory.value.find(item => {
    return item.post_name == stringselectedreportCategory.value;
  });
  return selectedItem ? selectedItem.type_id : null;
});
const petidvalue = computed(() => {
  const selectedItem = category.value.find(item => {
    return item.pet_category == stringselectedPetCategory.value;
  });
  return selectedItem ? selectedItem.id : null;
});
const fullname = computed(() => user_avatar.value.firstname + ' ' + user_avatar.value.lastname);
const profileUrl = computed(() => user_avatar.value.user_profile_url);

watch(reportidvalue, (newValue) => {
  if (selectedreportCategory.value !== newValue) {
    selectedreportCategory.value = newValue;
  }
});
watch(petidvalue, (newValue) => {
  if (selectedCategory.value !== newValue) {
    selectedCategory.value = newValue;
  }
});

// Nov17 New Added Code - Salpocial
const isOpen = ref(false);

const selectPet = (item) => {
  selectedPetId.value = item.id; // Set the selected pet ID
  isOpen.value = false; // Close the dropdown
};

async function fetchPetCategory(petId) {
  try {
    const response = await axios.post("http://localhost:5000/profile", {
      _userid: id,
      _pet_id: petId,
      _post_id: null,
    });

    console.log('API Response:', response.data); // Log the entire response

    // Find the specific pet data based on the petId
    const petData = response.data.find(pet => pet.id === petId);

    if (petData) {
      console.log('Pet Category Data:', petData); // Log the specific pet data

      // Check if pet_category_id exists in the response
      if (petData.pet_category_id) {
        selectedCategory.value = petData.pet_category_id; // Set to the ID of the pet category
        console.log('Fetched Pet Category ID:', petData.pet_category_id); // Log the ID
      } else {
        console.error('pet_category_id is missing in the response data');
      }
    } else {
      console.log('No data found for the selected pet.');
    }
  } catch (error) {
    console.error('Error fetching pet category:', error);
  }
}

watch(selectedCategory, (newValue) => {
  console.log('Selected Category Updated:', newValue);
});

watch(selectedPetId, (newValue) => {
  console.log('selectedPetId:', newValue);
  if (newValue) {
    fetchPetCategory(newValue); // Call the function with the selected pet ID
  } else {
    selectedCategory.value = '';
  }
});
// End of the Added Code - Salpocial

async function loadPostDetails() { //used in edit for retrieval of post details
  stringselectedreportCategory.value = selectedPostDetailsValue.value.post_type

  // date: "10-31-2024 06:52:06"
  // pet_id: null

  selectedLocationAddress.value = selectedPostDetailsValue.value.report_address_location
  lat.value = selectedPostDetailsValue.value.latitude
  lng.value = selectedPostDetailsValue.value.longitude
  petcondition.value = selectedPostDetailsValue.value.pet_condition
  reportDetails.value = selectedPostDetailsValue.value.content
  other_selectedCategory.value = selectedPostDetailsValue.value.pet_category
  stringselectedPetCategory.value = selectedPostDetailsValue.value.pet_category
  imageUrls.value.push(...selectedPostDetailsValue.value.photos);
}

import default_avatar from '@/assets/images/buddy_default.jpg'
const user_avatar = ref({})
async function getUserDetails() {
  try {
    const _id = localStorage.getItem('u_id')
    const response = await axios.post("http://localhost:5000/getbuddydetails",
      {
        _id: _id
      }
    )
    if (response.data.success) {
      console.log("response", response.data.data)
      user_avatar.value = response.data.data[0]
      console.log("user avatar", user_avatar.value.user_name) // Check to confirm values are set
    }
  }
  catch (err) {
    console.log("error", err)
  }
}

// Remove image from list
const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
}
const emit = defineEmits(['close']) // for closing the modal
const open = ref(true)

onMounted(async () => {
  selectedPostDetailsValue.value = props.selectedPostDetails;

  await getUserDetails()
  await getCategory();
  await retrieveProfile();
  await getReportCategory();

  if (props.mode === 'edit') {
    loadPostDetails();
  }

  console.log("props", selectedPostDetailsValue.value);
});

// to close press esc
onMounted(() => {
  const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
  window.addEventListener('keydown', closeModalOnEsc)
  onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})
</Script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @click.self="$emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-30 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-left sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white shadow-lg transition-all sm:max-w-[50rem] sm:mx-4 sm:w-full p-6">
              <div class="flex justify-between items-center">
                <DialogTitle as="h3" class="text-2xl font-semibold leading-6 text-gray-900">
                  <!-- if edit "Edit report.." if create "create report..."- joey -->
                  {{ mode === 'edit' ? 'Edit Report' : 'Create Report' }}
                </DialogTitle>
                <button @click="$emit('close')" ref="cancelButtonRef" class="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" class="w-7 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div class="mt-4 overflow-hidden text-gray-700 flex flex-col gap-y-4">
                <div class="flex items-center gap-x-3">
                  <img class="h-16 w-16 border border-gray-500 rounded-full object-cover" :src="profileUrl"
                    alt="profile image" />
                  <div class="flex flex-col gap-y-1">
                    <span class="text-lg font-medium"> {{ fullname }}</span>
                    <select v-model="selectedreportCategory"
                      class="border text-gray-700 bg-slate-50 font-medium rounded-lg text-sm px-5 py-2.5  inline-flex text-left  ">
                      <option value="" selected disabled hidden>Report Type</option>
                      <option v-for="(item, index) in reportcategory" :key="index" :value="item.type_id">
                        {{ item.post_name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="text-sm">
                  <!-- HERE JO  -->
                  <!-- Nov17 comment changes in because of Salpocials code
                  <div v-if="selectedreportCategory == 2" class="py-2 flex flex-col gap-y-2">
                    <label for="petcategory" class="font-medium">Pet</label>
                    <select v-model="selectedPetId" id="petcategory"
                      class="text-gray-700 bg-slate-50 block w-full p-2.5 border rounded-lg">
                      <option v-if="options.length == 0" value="null" selected>{{ defaultOptionText }}</option>
                      <option v-for="(item, index) in options" :key="index" :value="item.id">
                        {{ item.name }}
                      </option>
                    </select>
                  </div> -->
                  <!-- Nov17 Starting Changes -->
                  <div v-if="selectedreportCategory == 2" class="py-2 flex flex-col gap-y-2">
                    <PetList @petSelected="selectPet" />
                  </div>
                  <!-- End Changes -->
                  <!-- /* HERE JO */ -->
                  <div class="py-2 flex flex-col gap-y-2 mt-2">
                    <label for="petcategory" class="text-base font-medium">Pet Category</label>
                    <select v-if="selectedCategory !== 'other'" v-model="selectedCategory" id="petcategory"
                      class="text-gray-700 bg-slate-50 block w-full p-2.5 border rounded-lg ">
                      <option value="" selected disabled hidden>Select Pet Category</option>
                      <option v-for="(item, index) in category" :key="index" :value="item.id">{{ item.pet_category }}
                      </option>
                      <option value="other"> Other
                      </option>
                    </select>
                    <div v-else>
                      <input placeholder="Other Pet Category" id="location" v-model="other_selectedCategory"
                        class="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2">
                      <button @click="clearAnimalTypeInput" class="w-4 h-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="py-2 flex flex-col gap-y-2">
                    <div class="flex item-center gap-x-2">
                      <label for="location" class="text-base font-medium">Location</label>
                      <span class="text-red-400 text-[12px] italic" v-if="locationflag == false">
                        *Please add a location!</span>
                    </div>
                    <div class="flex gap-x-2">
                      <input id="location" placeholder="Enter your Location" v-model="selectedLocationAddress"
                        class="w-full bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2" />
                      <button @click.prevent="showMapModal = true, clearflags()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="25" height="25">
                          <path fill="#f03d3d"
                            d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="py-2 flex flex-col gap-y-2">
                    <label for="petcondition" class="font-medium">Pet Condition</label>
                    <textarea v-model="petcondition" name="petcondition" id="petcondition" placeholder="Animal Status"
                      class="border rounded-lg py-2 px-4"></textarea>
                  </div>
                  <label for="reportdetails" class="font-medium">Report Details</label>
                  <div class="flex flex-col gap-y-2 border rounded-lg mt-2">
                    <textarea v-model="reportDetails" name="reportdetails" id="reportdetails"
                      placeholder="Write a caption or a description about the pet situation"
                      class="py-2 px-4 rounded-lg"></textarea>
                    <!-- Display images -->

                  </div>
                  <!-- <div v-if="imageUrls.length > 0" class="grid grid-cols-1 place-items-center gap-1 border-t">
                    <div v-for="(imageUrl, index) in imageUrls" :key="index.source" class="relative mx-1">
                      <img :src="imageUrl.url || imageUrl" alt="Uploaded Image"
                        class="max-w-full max-h-[300px] object-contain border" />
                      <button @click="removeImage(index)"
                        class="absolute top-0 right-0 p-1 text-red-500 hover:text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div> -->
                  <!-- Nov17-->
                  <div v-if="imageUrls.length > 0"
                    class="outline-dashed outline-2 mx-1 outline-offset-3 outline-gray-200 rounded-lg p-2 my-2">
                    <div class="px-4 my-2 mx-2 sm:col-span-2 sm:px-0">
                      <ul role="list" class="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
                        <li v-for="(imageUrl, index) in imageUrls" :key="index" class="relative">
                          <div
                            class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                            <img :src="imageUrl.url || imageUrl" alt="Uploaded Image"
                              class="pointer-events-none w-full sm:h-52 lg:h-40 object-cover" />
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
                  <div v-if="photoflag == false" class="flex justify-between my-3 mx-[1.5rem]">
                    <div class="text-red-400 text-[12px] italic">
                      <span>Please upload at least one photo</span>
                    </div>
                  </div>
                  <div class="flex justify-between my-3 mx-[1.5rem]">
                    <div>
                      <span class="text-gray-400 text-[12px]">Add to your post</span>
                    </div>
                    <div class="flex gap-4 items-center">
                      <div>
                        <label for="file-input" class="cursor-pointer flex gap-3 items-center">
                          <input @click="clearflags()" type="file" multiple @change="handleFileChange" id="file-input"
                            ref="fileInput" class="hidden" />
                          <img :src="images" alt="Images Icon" class="h-[2rem] w-[2rem]" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-end w-full mt-4">
                <button @click="getReportInput"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  {{ mode === 'edit' ? 'Save Changes' : 'Report' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
      <mapoverlay @dataSent="handleData" v-if="showMapModal" @close="showMapModal = false" />
      <Toast ref="toastRef" @closed="refreshRoute($router)" />
      <!--  :shelterlatitude="lat" :shelterlongitude="lng"  -->
    </Dialog>
  </TransitionRoot>
</template>