<template>
    <div class="bg-white p-6">
        <div class="flex justify-between items-center mb-4">
            <div class="flex space-x-4">
                <button class=" shadow-gray-60 rounded-full p-2">❮</button>
                <h2 class="text-3xl font-bold">Dolens</h2>
            </div>
            <div>
                <button @click="toggleEdit"
                    class="bg-white hover:bg-gray-300 text-gray-800 rounded-xl border font-bold py-2 px-4 mr-2">
                    Edit
                </button>
                <button @click="confirmDelete"
                    class="bg-white hover:bg-gray-300 text-gray-800 rounded-xl border font-bold py-2 px-4 mr-2">
                    Delete
                </button>
                <button class="bg-red-700 hover:bg-red-600 text-white rounded-xl font-bold py-2 px-4 rounded-r-md">
                    View as Public
                </button>
            </div>
        </div>
        <div class=" w-full grid grid-cols-2 gap-2 content-start bg-white rounded-lg">
            <img v-for="(image, index) in pet.imageGallery.slice(0, 3)" :key="index" :src="image" alt="Pet Image"
                class="w-full h-full object-cover cursor-pointer" @click="openPreview(index)" />
            <div class="relative overflow-hidden">
                <img v-for="(image, index) in pet.imageGallery.slice(0, 1)" :key="index" :src="image" alt="Pet Image"
                    class="w-full h-full object-cover" />
                <div v-if="pet.imageGallery.length > 4"
                    class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <span class="text-white text-xl font-bold">+{{ pet.imageGallery.length - 4 }}</span>
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row space-x-0 md:space-x-3 mt-4">
            <div class="flex w-full ">
                <div class="rounded-3xl border w-full p-5">
                    <p class="text-gray-700 text-sm md:text-base">Female | Senior</p>
                    <p class="mt-2 text-gray-800 text-sm md:text-base">
                        Hi there, I'm Dolens! A mature and loyal mixed-breed dog. Just to let you know, I am
                        unfortunately in poor health, so you should be ready for associated costs.
                    </p>
                </div>
            </div>

            <!-- Pet Owner and Other Details -->
            <div class="mt-1 rounded-3xl border w-full p-5">
                <p class="text-sm md:text-base"><strong>Owner Name:</strong> Eric</p>
                <p class="text-sm md:text-base"><strong>Age:</strong> {{ pet.age }}</p>
                <p class="text-sm md:text-base"><strong>Size:</strong> Medium</p>
                <p class="text-sm md:text-base"><strong>Energy Level:</strong> Low</p>
                <p class="text-sm md:text-base"><strong>Date Re-homed:</strong> {{ pet.dateReHommed }}</p>
                <p class="text-sm md:text-base"><strong>Pet Type:</strong> Dog</p>
                <p class="text-sm md:text-base"><strong>Breed/Mix:</strong> {{ pet.breed }}</p>
                <p class="text-sm md:text-base"><strong>Coat/Fur:</strong> Short</p>
            </div>
        </div>

        <!-- Health and Medical Information -->
        <div class="flex w-full mt-4">
            <div class="rounded-3xl border w-full p-5">
                <h3 class="text-lg font-bold mb-2">Health and Medical</h3>
                <div class="mb-2 text-sm md:text-base">
                    <strong>Vaccinations Status:</strong> Rabies, Feline Viral Rhinotracheitis (Fvr), Feline Calicivirus
                    (Fcv), Rabies 2
                </div>
                <div class="mb-2 text-sm md:text-base">
                    <strong>Spay / Neuter:</strong> Neuter
                </div>
                <div class="mb-2 text-sm md:text-base">
                    <strong>Medical Conditions:</strong> None known
                </div>
                <div class="mb-2 text-sm md:text-base">
                    <strong>Special Needs:</strong> None
                </div>
            </div>
        </div>

        <!-- Editing Mode Modal -->
        <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-lg max-w-lg w-full h-[80vh] overflow-y-auto hide-scrollbar relative">
                <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
                    &times; <!-- Close button (X) -->
                </button>
                <h3 class="text-lg font-bold text-center pb-3">Edit Pet Info</h3>

                <!-- Image Carousel (Visible only in Step 1) -->
                <div v-if="currentStep === 1" class="relative mb-4">
                    <img :src="pet.imageGallery[currentImageIndex]" alt="Pet Image"
                        class="w-full h-64 object-cover rounded-lg" />
                    <button @click="prevImage"
                        class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">❮</button>
                    <button @click="nextImage"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">❯</button>
                    <button @click="deleteImage(currentImageIndex)"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-[50%] w-8 h-8 p-1 opacity-50 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">✖</button>

                    <!-- Add Photo Button -->
                    <button @click="triggerFileInput"
                        class="absolute bottom-2 left-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded ">
                        Add a Photo
                    </button>
                    <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" multiple
                        class="hidden" />
                </div>

                <!-- Step 1: Pet Details Form -->
                <div v-if="currentStep === 1" class="mb-4">
                    <label>Name</label>
                    <input v-model="pet.name" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Nickname</label>
                    <input v-model="pet.nickname" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Date Re-homed</label>
                    <input v-model="pet.dateReHommed" type="date" class="border p-2 rounded w-full mb-2" />

                    <label>Pet Type</label>
                    <select v-model="pet.type" class="border p-2 rounded w-full mb-2">
                        <option value="Cat">Cat</option>
                        <option value="Dog">Dog</option>
                        <!-- Add more pet types as needed -->
                    </select>

                    <label>Breed / Mix</label>
                    <input v-model="pet.breed" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Gender</label>
                    <select v-model="pet.gender" class="border p-2 rounded w-full mb-2">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <label>Coat / Fur</label>
                    <input v-model="pet.coat" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Age</label>
                    <input v-model="pet.age" type="number" class="border p-2 rounded w-full mb-2" />

                    <label>Size & Weight</label>
                    <input v-model="pet.sizeWeight" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Energy Level</label>
                    <select v-model="pet.energyLevel" class="border p-2 rounded w-full mb-2">
                        <option value="">Select Energy Level Status</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <label>Status</label>
                    <select v-model="pet.status" class="border p-2 rounded w-full mb-2">
                        <option value="Adopted">Adopted</option>
                        <option value="Available">Available</option>
                        <!-- Add more statuses as needed -->
                    </select>

                    <div class="mb-4">
                        <button v-if="currentStep === 1" @click="goToStep(2)"
                            class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Next</button>
                    </div>
                </div>

                <!-- Step 2: Health and Medical Information -->
                <div v-if="currentStep === 2" class="mb-4">
                    <h4 class="text-lg font-bold">Health and Medical</h4>

                    <label>Vaccinations Status</label>
                    <div>
                        <input type="checkbox" v-model="pet.vaccinations.rabies" /> Rabies
                        <input type="checkbox" v-model="pet.vaccinations.fvr" /> Feline Viral Rhinotracheitis (Fvr)
                        <input type="checkbox" v-model="pet.vaccinations.fcv" /> Feline Calicivirus (Fcv)
                    </div>

                    <label>Other Vaccines</label>
                    <input v-model="pet.otherVaccines" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Medical Conditions</label>
                    <input v-model="pet.medicalConditions" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Special Needs</label>
                    <input v-model="pet.specialNeeds" type="text" class="border p-2 rounded w-full mb-2" />

                    <label>Has this animal been sterilized?</label>
                    <div>
                        <input type="radio" v-model="pet.sterilization" value="non-surgical" /> Non-surgical
                        <input type="radio" v-model="pet.sterilization" value="surgical" /> Surgical
                        <input type="radio" v-model="pet.sterilization" value="unknown" /> Unknown
                    </div>

                    <label>Other Information</label>
                    <textarea v-model="pet.otherInfo" class="border p-2 rounded w-full mb-2"
                        placeholder="Tell me more about this furry animal"></textarea>
                </div>

                <!-- Navigation Buttons -->
                <div class="mt-4">
                    <button v-if="currentStep === 2" @click="goToStep(1)"
                        class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded text-sm md:text-base">Back</button>
                    <button v-if="currentStep === 2" @click="saveChanges"
                        class="bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm md:text-base">Done</button>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white p-6 rounded-lg">
                <h3 class="text-lg font-bold">Are you sure you want to delete this?</h3>
                <div class="mt-4">
                    <button @click="deletePet"
                        class="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2">Yes</button>
                    <button @click="showModal = false"
                        class="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">No</button>
                </div>
            </div>
        </div>

        <!-- Image Preview Modal -->
        <div v-if="isPreviewing" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="p-4 sm:p-6 rounded-lg max-w-lg w-full h-auto">
                <button @click="closePreview"
                    class="font-bold absolute top-2 right-2 text-gray-600 hover:text-gray-900 p-2 sm:p-4 text-2xl sm:text-4xl">
                    &times; <!-- Close button (X) -->
                </button>

                <div class="mt-4 sm:mt-6 w-full flex justify-center">
                    <div class="flex justify-center">
                        <div class="relative flex justify-center items-center">
                            <div
                                class="absolute sm:-left-7 lg:-left-11 z-10 bg-white bg-opacity-40 w-fit rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                <button @click="prevImage" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 hover:text-white"
                                    :disabled="currentImageIndex === 0">❮</button>
                            </div>
                            <!-- Centering the div on the screen -->
                            <div class="flex h-auto sm:h-fit xl:h-[50rem] w-full justify-center">
                                <img :src="pet.imageGallery[currentImageIndex]" alt="Preview"
                                    class="flex-shrink-0 object-contain max-h-[80vh] w-auto" />
                            </div>
                            <div
                                class="absolute sm:-right-7 lg:-right-11 z-10 bg-white bg-opacity-40 w-fit rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                <button @click="nextImage" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 hover:text-white"
                                    :disabled="currentImageIndex === pet.imageGallery.length - 1">❯</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PetProfilePage',
    data() {
        return {
            isEditing: false, // Track if in edit mode
            currentImageIndex: 0,
            currentStep: 1, // Track the current step
            pet: {
                name: 'Dolens',
                description: "Hi there, I'm Dolens! A mature and loyal mixed-breed dog...",
                imageMain: '', // Main image for the pet
                imageGallery: [
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/homepage.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/homepage.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/homepage.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/eric.png'),
                    require('/src/assets/images/homepage.png'),

                ],
                age: 'Senior',
                dateReHommed: '2022-10-10',
                gender: 'Female',
                breed: 'Mixed Breed Dog',
                vaccinations: {
                    rabies: false,
                    fvr: false,
                    fcv: false,
                },
                otherVaccines: '',
                medicalConditions: '',
                specialNeeds: '',
                sterilization: '',
                otherInfo: '',
            },
            showModal: false, // Track if the modal is visible
            payment: {
                name: '',
                expiryMonth: '',
                expiryYear: '',
                cvv: '',
                cardNumber: '',
                email: '',
                streetAddress: '',
                city: '',
                state: '',
                country: 'Estonia',
            },
            isPreviewing: false, // Track if the preview modal is visible
        };
    },
    methods: {
        toggleEdit() {
            this.isEditing = !this.isEditing;
        },
        saveChanges() {
            this.isEditing = false;
            // Logic to save changes, e.g., update API or local state
        },
        onFileChange(event) {
            const files = event.target.files;
            if (files.length) {
                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.pet.imageGallery.push(e.target.result); // Add the uploaded image to the image gallery
                    };
                    reader.readAsDataURL(file);
                });
            }
        },
        confirmDelete() {
            this.showModal = true; // Show the confirmation modal
        },
        deletePet() {
            // Logic to delete the pet, e.g., API call
            this.showModal = false; // Hide the modal after deletion
        },
        nextImage() {
            if (this.currentImageIndex < this.pet.imageGallery.length - 1) {
                this.currentImageIndex++;
            } else {
                this.currentImageIndex = 0; // Loop back to the first image
            }
        },
        prevImage() {
            if (this.currentImageIndex > 0) {
                this.currentImageIndex--;
            } else {
                this.currentImageIndex = this.pet.imageGallery.length - 1; // Loop back to the last image
            }
        },
        goToStep(step) {
            this.currentStep = step; // Change the current step
            if (step === 1) {
                document.body.classList.remove('overflow-hidden'); // Enable body scroll
            } else {
                document.body.classList.add('overflow-hidden'); // Disable body scroll
            }
        },
        closeModal() {
            this.isEditing = false; // Close the modal
            document.body.classList.remove('overflow-hidden'); // Enable body scroll when modal is closed
        },
        openPreview(index) {
            this.currentImageIndex = index; // Set the current image index
            this.isPreviewing = true; // Show the preview modal
        },
        closePreview() {
            this.isPreviewing = false; // Hide the preview modal
        },
        deleteImage(index) {
            this.pet.imageGallery.splice(index, 1); // Remove the image at the specified index
            if (this.currentImageIndex >= this.pet.imageGallery.length) {
                this.currentImageIndex = this.pet.imageGallery.length - 1; // Adjust current index if needed
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click(); // Use this.$refs to access the file input
        },
    },
    watch: {
        isEditing(newValue) {
            if (newValue) {
                document.body.classList.add('overflow-hidden'); // Disable body scroll when modal is opened
            } else {
                document.body.classList.remove('overflow-hidden'); // Enable body scroll when modal is closed
            }
        },
    },
};
</script>

<style scoped>
@media (max-width: 640px) {
    .grid {
        grid-template-columns: 1fr;
        /* Stack images on small screens */
    }

    .flex {
        flex-direction: column;
        /* Stack flex items vertically on small screens */
    }

    .rounded-3xl {
        margin-bottom: 1rem;
        /* Add margin between stacked items */
    }
}

.hide-scrollbar {
    overflow-y: scroll;
    /* Allow scrolling */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Hide scrollbar for Chrome, Safari, and Opera */
}

.hide-scrollbar {
    -ms-overflow-style: none;
    /* Hide scrollbar for Internet Explorer and Edge */
    scrollbar-width: none;
    /* Hide scrollbar for Firefox */
}
</style>