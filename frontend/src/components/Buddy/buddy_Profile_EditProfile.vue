<script setup>
import axios from "axios";
import { ref, onMounted } from 'vue';
import { PhotoIcon, MapIcon, MapPinIcon, firstnameIcon, EnvelopeIcon, LinkIcon } from '@heroicons/vue/24/solid';
import prompt from '@/components/prompt_savechange.vue';
import { useRouter, useRoute } from 'vue-router';

import Toast from '@/components/toast.vue';  // Ensure correct case for the file name

const route = useRoute();
const router = useRouter();
const toastRef = ref(null);  // Create a ref for the Toast component
const isModalpromptOpen = ref(false);

const id = localStorage.getItem('c_id');
const user_id = localStorage.getItem('u_id');
const username = ref('');
const bio = ref('');
const dob = ref('');
const selectedGender = ref('')
const firstname = ref('');
const lastname = ref('');
const url = ref('');

const fileInput = ref(null);
const selectedImage = ref(null);
let fileToUpload = null;

const retrievedProfile = ref(null)
// Navigation function
function navigateTo(path) {
    router.push(path);
}

// Toggle modal visibility
function showPrompt() {
    isModalpromptOpen.value = true;
}

function handleSaveClick() { //click ni sa prompt
    console.log('Save button clicked!');
    // Perform actions when the Save button is clicked
}

function handleFileChange(event) {
    const file = event.target.files[0];
    fileToUpload = file;

    const reader = new FileReader();
    reader.onload = (event) => {
        selectedImage.value = event.target.result;
    };
    reader.readAsDataURL(file);
}

function clearImage() {
    selectedImage.value = null;
    fileToUpload = null;

    if (fileInput.value) {
        fileInput.value.value = '';
    }
}

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
            populateForm(response.data.data)
        }
    }
    catch (err) {
        console.log("error", err)
    }
}
async function populateForm(data) { // // Populate the interface with the retrieved data

    firstname.value = data[0].firstname
    lastname.value = data[0].lastname
    username.value = data[0].user_name
    dob.value = data[0].dob
    selectedGender.value = data[0].gender
    bio.value = data[0].bio
    selectedImage.value = (data[0].user_profile_url == null) ? null : data[0].user_profile_url
    retrievedProfile.value = (data[0].user_profile_url == null) ? null : data[0].user_profile_url
}
async function saveProfile() {
    console.log("save profile function")

    const isImageChanged = retrievedProfile.value !== selectedImage.value;

    if (!isImageChanged && selectedImage.value !== null) {
        console.log("Profile image hasn't changed, no update needed.");
        fileToUpload = retrievedProfile.value

        console.log(fileToUpload)
    }


    // setbuddydetails
    const formData = new FormData();

    //retrieve input
    let dataInput = []

    firstname.value = firstname.value.charAt(0).toUpperCase() + firstname.value.slice(1).toLowerCase();
    lastname.value = lastname.value.charAt(0).toUpperCase() + lastname.value.slice(1).toLowerCase();
    dataInput = [
        ['_buddy_id', id],
        ['_user_name', username.value],
        ['_firstname', firstname.value],
        ['_lastname', lastname.value],
        ['_dob', dob.value],
        ['_gender', selectedGender.value],
        ['_bio', bio.value],
    ]

    // Handle the profile image update logic
    if (selectedImage.value === null) {
        // If image was removed, set profile URL to null
        formData.append('_profile_url', null);
        formData.append('_oldProfile', retrievedProfile.value);

        console.log("Image removed, setting profile URL to null in DB.");
    } else if (isImageChanged) {
        // If image has changed, include the new file
        formData.append('_profile_url', fileToUpload);
        formData.append('_oldProfile', retrievedProfile.value);
        console.log("Image changed, updating profile URL in DB.");
    }
    else {
        formData.append('_profile_url', fileToUpload);
    }

    dataInput.forEach(([key, value]) => formData.append(key, value));

    for (let [key, value] of formData.entries()) {
        console.log(`Key: ${key}, Value:`, value);
    }

    try {
        console.log("in try")
        const response = await axios.post("http://localhost:5000/setbuddydetails",
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' } // Correct header placement
            }
        );
        console.log("response: ", response)

        if (response.data.success) {
            console.log("hepi")
            navigateTo({
                path: "/buddy_profile",
                query: { showToast: true, message: 'Saved Successfully', status: 'success' }
            });
        } else {
            console.error('Failed to post:', response.data.message);
        }
    }
    catch (err) {
        console.log("error", err)
    }
}

onMounted(() => {
    getUserDetails()
});
</script>


<template>
    <form>
        <div class="bg-white rounded-2xl p-10 sm:mx-0 md:mx-[2rem] lg:mx-[5rem] xl:mx-[10rem] my-[2.5rem]">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Buddy's Profile</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">This information will be displayed publicly so be
                    careful what you share.</p>
                <div class="mt-10 border-t pt-[2rem] grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-full md:col-span-3">
                        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">
                            Username</label>
                        <div class="mt-2">
                            <input type="text" v-model="username" name="username" id="username"
                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div class="sm:col-span-full md:col-span-3">
                        <label for="profile-photo" class="block text-sm font-medium leading-6 text-gray-900">Profile
                            photo</label>
                        <div :class="{ 'py-5': !selectedImage, 'py-2': selectedImage }"
                            class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25">
                            <div class="text-center" v-if="!selectedImage">
                                <PhotoIcon class="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                    <label for="file-upload"
                                        class="relative cursor-pointer rounded-md font-semibold text-teal-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" ref="fileInput" name="file-upload" type="file"
                                            class="sr-only" @change="handleFileChange" />
                                    </label>
                                </div>
                                <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <div v-else class="flex justify-center items-center h-full w-full relative">
                                <img :src="selectedImage" class="max-w-[15rem] max-h-[15rem]" />
                                <button @click="clearImage"
                                    class="absolute top-2 sm:right-[1rem] lg:right-[8.1rem] text-gray-600 hover:text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-[1rem] grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-full md:col-span-3">
                        <label for="firstname" class="block text-sm font-medium leading-6 text-gray-900">
                            Firstname
                        </label>
                        <div class="mt-2 flex gap-x-3 items-center">
                            <input type="text" v-model="firstname" name="firstname" id="firstname"
                                autocomplete="firstname" placeholder="Contact Number"
                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    <div class="sm:col-span-full md:col-span-3">
                        <label for="lastname" class="block text-sm font-medium leading-6 text-gray-900">
                            Lastname
                        </label>
                        <div class="mt-2 flex gap-x-3 items-center">
                            <input type="text" v-model="lastname" name="lastname" id="lastname" autocomplete="lastname"
                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>


                    <div class="sm:col-span-full md:col-span-3">
                        <label for="dob" class="block text-sm font-medium leading-6 text-gray-900">
                            Date of Birth
                        </label>
                        <div class="mt-2 flex gap-x-3 items-center">
                            <input v-model="dob" type="date" name="dob" id="dob"
                                class="border p-1 rounded-lg px-[1rem] w-full">
                        </div>
                    </div>

                    <div class="md:col-span-3 sm:col-span-full">
                        <label for="gender" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
                        <div class="mt-2 w-full">
                            <select v-model="selectedGender" id="gender" name="gender"
                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                <option value="" selected disabled hidden>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-span-full">
                        <label for="bio" class="block text-sm font-medium leading-6 text-gray-900">
                            Bio</label>
                        <div class="mt-2">
                            <textarea v-model="bio" id="bio" name="bio" rows="3"
                                placeholder="Describe yourself, interest and dislike..."
                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6">
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 flex items-center justify-end gap-x-6">
                <router-link to="/buddy_profile"
                    class="text-sm font-semibold leading-6 text-gray-900">Cancel</router-link>
                <!-- @click="showPrompt" //gitanggal nko ang prompt -->
                <button type="button" @click.prevent="saveProfile()"
                    class="rounded-md bgteal px-[2rem] py-2 text-sm font-semibold text-white shadow-sm hover:bg-lightteal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                    Save Changes</button>
            </div>
            <!-- <prompt v-model:isOpen="isModalpromptOpen" @save-clicked="handleSaveClick" /> -->

            <!-- <Toast ref="toastRef" @closed="refreshRoute($router)" /> -->
            <!-- @closed="refreshRoute($router); navigateAfterToast() -->
        </div>
    </form>
</template>
