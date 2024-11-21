<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import passwordunhide from '../components/passwordHide.vue';
import { PhotoIcon } from '@heroicons/vue/20/solid';
import { DocumentIcon } from "@heroicons/vue/24/outline";

import { useRouter } from 'vue-router';
const router = useRouter();

const logo = require('@/assets/images/frrysfLOGO.png');

// Props
const dog = require('@/assets/images/home_animalshelter.png');

// Data
const showPassword = ref(false);
const files = ref([]);
const otherPhotos = ref(null);
const message = ref('');
const messageType = ref('');
const formData = ref(new FormData());
const userdetails = ref({
    sheltername: '',
    email: '',
    password: '',
});
const reg_type = ref('shelter');
const items = ref([]);

// Methods
// const handleMultipleFileChange = (event) => {
//     const fileArray = event.target.files;
//     files.value = [...files.value, ...fileArray];

//     Array.from(fileArray).forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             files.value.push({ file: file, url: event.target.result });
//         };
//         reader.readAsDataURL(file);
//     });
//     event.target.value = '';
// };

const handleMultipleFileChange = (event) => {
    const fileArray = event.target.files;

    Array.from(fileArray).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Push an object with file and its URL (data URL) along with the name of the file
            files.value.push({ file: file, url: event.target.result, name: file.name });
        };
        reader.readAsDataURL(file);
    });

    // event.target.value = ''; // Clear input value after reading
};

// Remove a file by its index
const removeFile = (index) => {
    files.value.splice(index, 1); // Remove the file from the array
};

const navigateTo = (path) => {
    // Navigate to a new path
    // useRouter().push(path);
    router.push(path);
};

// Nov21  Error tracking variables
const shelternameError = ref(false);
const emailError = ref(false);
const passwordError = ref(false);
const fileError = ref(false);
// Nov21 For password
const password = ref('');
const sheltername = ref('');
const email = ref('');
// // Nov21 Watch for changes in password value and set error state if empty
// watch(() => password.value, (newPassword) => {
//     passwordError.value = !newPassword; // Set error if password is empty
// });

const clearInput = () => {
    sheltername.value = ''
    email.value = ''
    password.value = '';
};

const handleSignup = async () => {
    try {
        // Nov21 Reset errors before validation
        shelternameError.value = false;
        emailError.value = false;
        passwordError.value = false;
        fileError.value = false;

        // Nov21 Validate the fields
        if (!sheltername.value) {
            shelternameError.value = true;
        }

        if (!email.value) {
            emailError.value = true;
        }

        if (!password.value) {
            passwordError.value = true;
        }

        if (!document.getElementById('sheltername').value || !document.getElementById('email').value ||
            !document.getElementById('password').value) {
            console.log("Some required fields are empty."); // Should have a user interface feedback
            formData.value = new FormData();
            return;
        }
        // Append user details
        formData.value.append('sheltername', document.getElementById('sheltername').value);
        formData.value.append('email', document.getElementById('email').value);
        formData.value.append('password', document.getElementById('password').value);
        formData.value.append('regtype', reg_type.value);

        console.log("Checking files...");
        if (!files.value || files.value.length === 0) {
            fileError.value = true; // Nov21 for styling
            formData.value = new FormData();
            console.log("No files to process or file array is empty.");
            return;
        }

        files.value.forEach((fileobj) => {
            formData.value.append('documents', fileobj.file);  // Add files with the key 'documents'
        });

        await setUser();
        clearInput()
    } catch (err) {
        console.log("Shelter registration error:", err);
    }
};

const setUser = async () => {
    console.log("Preparing to send request...");
    try {
        const response = await axios.post("http://localhost:5000/shelter-registration", formData.value, {
            'Content-Type': 'multipart/form-data'
        });

        items.value = response.data;
        if (response.data.success) {
            formData.value = new FormData();
            navigateTo('/shelterDashboard');
        } else {
            formData.value = new FormData();
            // Handle login failure
            console.log("ERRORRRRRRRRRRRRRRRRRRRRRR");
        }
        console.log("try and succesfull stage");
    } catch (err) {
        console.log("Error", err);
    } finally {
        // Optional: Clear files and user details
        files.value = [];
        userdetails.value = {
            sheltername: '',
            email: '',
            password: '',
        };
        console.log("finally stage");
    }
};

</script>
<template>
    <section class="bg-white">
        <div class="lg:grid lg:min-h-screen lg:grid-cols-12 lg:pr-10">
            <section
                class="bg-blue-50 left-[6%]  relative h-32 items-end lg:col-span-5 lg:h-full xl:col-span-6 hidden lg:block">
                <img alt="" :src="dog" class="absolute inset-0 my-20 mx-10 h-[90%] w-[90%] object-contain " />

                <!-- <div class="hidden lg:relative lg:block lg:p-12">
                    <RouterLink class="block text-white" to="/">
                        <span class="sr-only">Home</span>
                    </RouterLink>

                </div> -->
            </section>

            <main
                class="mx-4 flex items-center justify-center min-h-screen px-8 sm:px-[2rem] lg:col-span-7 lg:px-8 xl:col-span-6">
                <div class="w-full md:w-2/3 mx-auto">
                    <div class="flex gap-x-2 items-center">
                        <RouterLink to="/">
                            <!-- <logo class="h-6 w-6 text-gray-800 hover:text-gray-700" /> -->
                            <img alt="FrrySfLogo" title="Home" :src="logo" class="h-10 w-10" />
                        </RouterLink>
                        <h1 class="text-2xl font-semibold text-gray-700">Sign up as a Shelter</h1>
                    </div>
                    <form action="#" class="mt-5 grid grid-cols-6 gap-6">
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Shelter Name</label>
                            <input type="text" id="sheltername" v-model="sheltername"
                                :placeholder="shelternameError ? 'Shelter name is required' : 'Sheltername'"
                                :class="['w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm', { 'border-red-500 placeholder-red-500': shelternameError }]"
                                required />

                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                            <input type="email" id="email" v-model="email"
                                :placeholder="emailError ? 'Email Address is required' : 'Email'"
                                :class="['w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm', { 'border-red-500 placeholder-red-500': emailError }]"
                                required />

                        </div>
                        <div class="col-span-6">
                            <!-- <passwordunhide /> -->
                            <!-- Nov21  -->
                            <passwordunhide v-model="password" :passwordError="passwordError" />
                            <button @click="clearInput">Clear Password</button> 
                        </div>

                        <div class="col-span-6">
                            <!-- File input to accept multiple files (image and document files) -->
                            <div :class="{
                                'mt-3 outline-dashed outline-2 outline-offset-3 outline-gray-200 rounded-lg p-2 my-2': true,
                                'outline-red-500': fileError
                            }">
                                <label for="otherPhotos" class="cursor-pointer flex flex-col items-center gap-x-2">
                                    <input type="file" @change="handleMultipleFileChange"
                                        accept="image/*,application/pdf,.doc,.docx,.txt" multiple id="otherPhotos"
                                        ref="otherPhotos" class="hidden" />
                                    <PhotoIcon class="h-10 w-10 text-gray-200" />
                                    <span
                                        class="font-medium text-gray-400 sm:text-[10px] md:text-[12px] lg:text-[15px]">Choose
                                        file</span>
                                    <p class="text-gray-400 text-sm mt-2 text-center">Supported formats: DOC, DOCX,
                                        XLS, XLSX,
                                        PNG, JPG</p>
                                    <p class="text-gray-400 text-sm">Maximum size: 25MB</p>
                                </label>
                            </div>
                            <!-- Display names and types of selected files with a remove button -->
                            <div v-if="files.length > 0" class="container">
                                <ul>
                                    <li v-for="(file, index) in files" :key="index">
                                        <div class="flex gap-x-2 p-2 border gap-y-1 rounded-lg w-fit">
                                            <DocumentIcon class="h-6 w-6 text-gray-500" />
                                            <p class="flex truncate">{{ file.name }}</p>
                                            <button @click="removeFile(index)" class="remove-btn hover:text-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" class="w-4 h-4">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <p v-if="fileError" class="text-red-500 text-xs flex justify-center">
                                A shelter must provide documentation for verification.</p>
                        </div>

                        <div class="sm:mx-4 lg:mx-0 col-span-6 text-center">
                            <p class="text-sm text-gray-500">
                                By creating an account, you agree to our
                                <a href="#" class="text-gray-700 underline">terms and conditions</a>
                                and
                                <a href="#" class="text-gray-700 underline">privacy policy</a>.
                            </p>
                        </div>
                        <div class="col-span-6 flex flex-col sm:items-center sm:gap-4">
                            <button @click.prevent="handleSignup()"
                                class="w-[50%] bg-gray-800 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                                Create an account
                            </button>

                            <p class="mt-10 text-sm text-gray-500 sm:mt-0">
                                Already have an account?
                                <a href="#" @click="goBack" class="text-gray-700 underline">Log in</a>.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </section>
</template>