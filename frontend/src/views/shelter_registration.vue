<template>
    <section class="bg-white">
        <div class="lg:grid lg:min-h-screen lg:grid-cols-12 lg:pr-10">
            <section
                class="bg-blue-50 left-[6%]  relative h-32 items-end lg:col-span-5 lg:h-full xl:col-span-6 hidden lg:block">
                <img alt="" :src="require('@/assets/images/home_animalshelter_slider_pic4.png')"
                    class="absolute inset-0 my-20 mx-10 h-[90%] w-[90%] object-contain " />

                <div class="hidden lg:relative lg:block lg:p-12">
                    <a class="block text-white" href="#">
                        <span class="sr-only">Home</span>
                    </a>

                </div>
            </section>

            <main
                class="mx-4 flex items-center justify-center min-h-screen px-8 sm:px-[2rem] lg:col-span-7 lg:px-8 xl:col-span-6">
                <div class="w-full md:w-2/3 mx-auto">
                    <div class="flex gap-x-2 items-center">
                        <RouterLink to="/">
                            <HomeIcon class="h-6 w-6 text-gray-800 hover:text-gray-700" />
                        </RouterLink>
                        <h1 class="text-2xl font-semibold text-gray-700">Sign up as a Shelter</h1>
                    </div>
                    <form action="#" class="mt-5 grid grid-cols-6 gap-6">
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Shelter Name</label>
                            <input type="text" id="sheltername" v-model="Sheltername" placeholder="Sheltername"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!Sheltername && submitted" class="text-red-500 text-[11px]">*Username is required
                            </p>
                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                            <input type="email" id="email" v-model="email" placeholder="Email"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!email && submitted" class="text-red-500 text-[11px]">*Email is required</p>
                        </div>
                        <div class="col-span-6">
                            <passwordunhide />
                            <p v-if="!password && submitted" class="text-red-500 text-[11px]">*Password is required</p>
                        </div>
                        <h2 class="col-span-6 text-xl font-semibold text-gray-700">Upload file</h2>
                        <!-- File Upload Area -->
                        <div class="col-span-6 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-3"
                            @drop.prevent="handleFileDrop" @dragover.prevent>
                            <img :src="require('@/assets/images/cloud-computing.png')" alt="Upload Icon"
                                class=" w-9 h-9">
                            <p class="text-gray-600">Drag and Drop file here or
                                <button class="text-blue-500 underline" @click="triggerFileInput">Choose file</button>
                            </p>
                            <p class="text-gray-400 text-sm mt-2 text-center">Supported formats: DOC, DOCX, XLS, XLSX,
                                PNG, JPG</p>
                            <p class="text-gray-400 text-sm">Maximum size: 25MB</p>
                            <input type="file" hidden accept=".doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" ref="fileInput"
                                @change="handleFileChange" multiple>
                        </div>

                        <!-- Uploaded File Info -->
                        <div v-if="files.length" class="col-span-6 border-2 rounded-lg overflow-y-auto"
                            style="max-height: 100px;">
                            <div v-for="(file, index) in files" :key="index"
                                class="flex items-center justify-between bg-white p-4 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <img :src="getFileIcon(file.type)" alt="File Icon" class="w-4 h-4">
                                    <div>
                                        <p class="text-gray-800 text-[12px]">{{ file.name }}</p>
                                        <p class="text-gray-400 text-[12px]">{{ (file.size / (1024 * 1024)).toFixed(2)
                                            }} MB</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <div class="text-blue-500">{{ uploadProgress[index] }}%</div>
                                    <button @click="removeFile(index)"
                                        class="text-red-500 hover:text-red-700">X</button>
                                </div>
                            </div>
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

<script>
import axios from 'axios'; // Ensure axios is imported
import passwordunhide from "../components/passwordHide.vue"; // Import password unhide component
import { HomeIcon } from '@heroicons/vue/20/solid'

export default {
    name: 'LoginShelter',
    components: { passwordunhide, HomeIcon }, // Register the password unhide component
    data() {
        return {
            Sheltername: '',
            email: '',
            password: '',
            address: '',
            isStepTwo: false,
            isStepThree: false,
            activeStep: 1,
            files: [], // Added for file upload
            uploadProgress: [], // Added for upload progress
            dog: require('@/assets/images/animalshelterdog.png'), // icons or images
            passwordError: false,
            showPassword: false,
            otherPhotos: null,
            message: '',
            messageType: '',
            formData: new FormData(),
            userdetails: {
                sheltername: '',
                email: '',
                password: '',
            },
            reg_type: 'shelter',
            items: [],
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'login' }); // Navigate to login.vue
        },
        handleLoginSubmit() {
            this.submitted = true; // Set submitted to true on form submission
            // Handle form submission logic here
            if (this.username && this.email && this.password) {
                // Proceed with form submission
                console.log('Form submitted successfully!');
            }
        },
        handleRegisterSubmit() {
            this.isStepTwo = true;
            this.activeStep = 2;
        },
        goToStepThree() {
            this.isStepThree = true;
            this.activeStep = 3;
        },
        range(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
        // File upload methods
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        handleFileChange(event) {
            const selectedFiles = event.target.files;
            if (selectedFiles.length > 0) {
                this.files = Array.from(selectedFiles); // Convert FileList to Array
                this.uploadFiles(this.files);
            }
        },
        handleFileDrop(event) {
            const droppedFiles = event.dataTransfer.files;
            if (droppedFiles.length > 0) {
                this.files = Array.from(droppedFiles); // Convert FileList to Array
                this.uploadFiles(this.files);
            }
        },
        handleCancel() {
            this.files = [];
            this.uploadProgress = [];
        },
        getFileIcon(fileType) {
            if (fileType.includes("word")) {
                return "https://via.placeholder.com/24?text=DOC";
            } else if (fileType.includes("excel")) {
                return "https://via.placeholder.com/24?text=XLS";
            } else if (fileType.includes("image")) {
                return "https://via.placeholder.com/24?text=IMG";
            }
            return "https://via.placeholder.com/24";
        },
        uploadFiles(files) {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`file${index + 1}`, file);
            });

            axios.post('/upload', formData, {
                onUploadProgress: progressEvent => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    this.uploadProgress.push(progress);
                }
            })
                .then(response => {
                    console.log('Files uploaded successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error uploading files:', error);
                });
        },
        removeFile(index) {
            this.files.splice(index, 1); // Remove the file from the array
            this.uploadProgress.splice(index, 1); // Remove the corresponding progress
        },
        // New methods for handling multiple file uploads
        handleMultipleFileChange(event) {
            const fileArray = event.target.files;
            Array.from(fileArray).forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.files.push({ file: file, url: event.target.result });
                };
                reader.readAsDataURL(file);
            });
            event.target.value = '';
        },
        removeImage(index) {
            this.files = this.files.filter((_, i) => i !== index); // Deletion of a single upload
        },
        navigateTo(path) {
            this.$router.push(path);
        },
        // Registration method
        async handleSignup() {
            try {
                // ... existing signup logic ...
                await this.setUser();
            } catch (err) {
                console.log("shelter registration error:", err);
            }
        },
        // Create user to user table
        async setUser() {
            console.log("Preparing to send request...");
            try {
                const response = await axios.post("http://localhost:5000/shelter-registration", this.formData, {
                    'Content-Type': 'multipart/form-data'
                });
                this.items = response.data;
                if (response.data.success) {
                    this.formData = new FormData();
                    this.navigateTo('/shelterDashboard');
                } else {
                    this.formData = new FormData();
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRR");
                }
            } catch (err) {
                console.log("error", err);
            } finally {
                this.files = [];
                this.userdetails = {
                    sheltername: '',
                    email: '',
                    password: '',
                };
            }
        },
    }

}
</script>