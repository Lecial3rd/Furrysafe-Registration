<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

// Nov12 to close press esc - Joey
onMounted(() => {
    const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
    window.addEventListener('keydown', closeModalOnEsc)
    onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})

// Nov12 to close press esc - Joey
onMounted(() => {
    const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
    window.addEventListener('keydown', closeModalOnEsc)
    onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})

const selectedProfile = ref()

const props = defineProps({
    selectedProfileDetails: {
        type: Object,
        required: true,
    },
});

// Nov12
const name = ref(null)
const nickname = ref(null)
const healthAndMedical = reactive([])
const allPhotos = ref([]);

onMounted(() => {
    // selectedPost.value = props.selectedPostDetails
    // Nov12
//     if (selectedProfile.value && selectedProfile.value.name_nickname) {
//         const [firstName, nickName] = selectedProfile.value.name_nickname.split('/');
//         name.value = firstName.charAt(0).toUpperCase() + firstName.slice(1);
//         nickname.value = nickName.charAt(0).toUpperCase() + nickName.slice(1);

//         healthAndMedical.length = 0;
//         healthAndMedical.push(
//             {
//                 label: 'Vaccinations Status',
//                 details: selectedProfile.value.vaccinename || "Not vaccinated"
//             },
//             {
//                 label: 'Spay / Neuter',
//                 status: selectedProfile.value.sterilization || "Unknown"
//             },
//             {
//                 label: 'Medical Conditions',
//                 status: selectedProfile.value.condition || "None known"
//             },
//             {
//                 label: 'Special Needs',
//                 status: selectedProfile.value.need || "None"
//             }
//         );

//         const { profileurl, post_photos } = selectedProfile.value;

//         // Ensure profile URL is added if it exists
//         allPhotos.value = profileurl ? [profileurl] : [];

//         // Add additional photos if they exist and aren't just "No additional photos"
//         if (Array.isArray(post_photos) && post_photos[0] !== 'No post photos') {
//             allPhotos.value = allPhotos.value.concat(post_photos);
//         }
//     }
// });
    const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
    window.addEventListener('keydown', closeModalOnEsc)
    onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))

    selectedProfile.value = props.selectedProfileDetails

    if (selectedProfile.value && selectedProfile.value.name_nickname) {
        const [firstName, nickName] = selectedProfile.value.name_nickname.split('/');
        name.value = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        nickname.value = nickName.charAt(0).toUpperCase() + nickName.slice(1);

        healthAndMedical.length = 0;
        healthAndMedical.push(
            {
                label: 'Vaccinations Status',
                details: selectedProfile.value.vaccinename || "Not vaccinated"
            },
            {
                label: 'Spay / Neuter',
                status: selectedProfile.value.sterilization || "Unknown"
            },
            {
                label: 'Medical Conditions',
                status: selectedProfile.value.condition || "None known"
            },
            {
                label: 'Special Needs',
                status: selectedProfile.value.need || "None"
            }
        );

        const { profileurl, post_photos } = selectedProfile.value;

        // Ensure profile URL is added if it exists
        allPhotos.value = profileurl ? [profileurl] : [];

        // Add additional photos if they exist and aren't just "No additional photos"
        if (Array.isArray(post_photos) && post_photos[0] !== 'No post photos') {
            allPhotos.value = allPhotos.value.concat(post_photos);
        }

        console.log("photos", allPhotos.value)
    }
});

const viewpostdetials = {
    imageUrls: [
        require("@/assets/images/homepage.png"),
        require("@/assets/images/charles.png"),
        require("@/assets/images/eric.png"),
        require("@/assets/images/bals.png"),
        require("@/assets/images/bert.png"),
    ],
};

import viewimagepreview from '@/components/Buddy/buddy_Profile_GridProfileImagePreview.vue';
// view image preview
const selectedViewImagePreviewId = ref(null);

const toggleModalViewImagePreview = (id) => {
    selectedViewImagePreviewId.value = selectedViewImagePreviewId.value === id ? null : id;
    console.log(id);
};

const hasUndisplayedImages = computed(() => viewpostdetials.imageUrls.length > 3) // check undisplayed images and add styling brightness to 50

// check the remaining undisplayed image and display pila mygad kapoyg english HAHAHHAHA
const remainingImagesText = computed(() => {
    const remainingCount = viewpostdetials.imageUrls.length - 3
    return remainingCount > 0 ? `${remainingCount}+ more` : ''
})

const emit = defineEmits(['close']) // for closing the modal

const open = ref(true)
</script>

<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-50" @click.self="$emit('close')">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
            </TransitionChild>
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden p-10 lg:px-10 xl:px-20 transition-all sm:my-8 sm:w-full sm:max-w-fit">
                            <div
                                class="absolute z-10 sm:right-1 sm:top-1 md:right-3.5 rounded-full flex items-center p-1 group">
                                <button @click="$emit('close')" ref="cancelButtonRef">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2"
                                        class="w-6 h-6 text-gray-100 hover:text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- context start -->
                            <div class="bg-white sm:p-4 md:p-8 rounded-2xl">

                                <!-- display image styling -->
                                <!-- if one image -->
                                <div v-if="allPhotos.length === 1"
                                    class="flex my-4 h-[30rem] rounded-2xl bg-black">
                                    <img :src="allPhotos[0]" alt="first image"
                                        class="w-full object-contain rounded-l-2xl" />
                                </div>
                                <div v-else-if="allPhotos.length === 2"
                                    class="grid grid-flow-col gap-2 my-4 h-[35rem]">
                                    <img :src="allPhotos[0]" alt="first image"
                                        class="col-span-3 w-full h-full object-cover rounded-l-2xl bg-black" />
                                    <img :src="allPhotos[1]" alt="second image"
                                        class="col-span-3 object-cover w-full h-full rounded-tr-2xl bg-black" />
                                </div>
                                <div v-else-if="allPhotos.length >= 3"
                                    @click="toggleModalViewImagePreview(selectedProfile.id)"
                                    class="grid grid-rows-6 grid-flow-col gap-2 my-4 aspect-auto sm:h-[20rem] md:h-[30rem] lg:h-[50rem]">
                                    <img :src="allPhotos[0]" alt="first image"
                                        class="sm:col-span-3 lg:col-span-3 row-span-6 w-full h-full object-cover rounded-l-2xl bg-black cursor-pointer" />
                                    <img :src="allPhotos[1]" alt="second image"
                                        class="row-span-3 sm:col-span-2 lg:col-span-3 object-cover w-full h-full rounded-tr-2xl bg-black cursor-pointer" />

                                    <div class="relative row-span-3 sm:col-span-2 lg:col-span-3 w-full h-full">
                                        <img :src="allPhotos[2]" alt="third image"
                                            :class="['w-full h-full object-cover rounded-br-2xl bg-black', { 'brightness-50': hasUndisplayedImages }]" />

                                        <button v-if="hasUndisplayedImages"
                                            class="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg">
                                            {{ remainingImagesText }}
                                        </button>
                                    </div>
                                    <viewimagepreview v-if="selectedViewImagePreviewId === selectedProfile.id"
                                        @close="toggleModalViewImagePreview(selectedProfile.id)" />
                                </div>

                                <!-- buttons with edit and archive-->
                                <div
                                    class="flex justify-between mb-4 mx-4 items-center sm:text-sm md:text-base font-bold mt-4 text-gray-700">
                                    <span class="sm:text-base lg:text-lg">{{ name }}'s Information</span>

                                    <div class="flex sm:gap-x-2 md:gap-x-4">
                                        <RouterLink :to="{ path: '/create_newanimalprofile', query: { mode: 'edit' } }"
                                            class="bg-gray-800 py-1 sm:px-4 md:px-8 rounded-lg text-white hover:bg-gray-700">
                                            Edit Profile</RouterLink>
                                        <!-- <button
                                            class="border bg-gray-200 py-1 sm:px-4 md:px-8 rounded-lg hover:bg-gray-100">Archive</button> -->
                                    </div>
                                </div>

                                <!-- info -->
                                <div class="flex sm:flex-col lg:flex-row sm:gap-y-4 gap-x-4">

                                    <div
                                        class="border rounded-xl border-gray-100 text-start sm:w-full lg:w-[45%] sm:text-sm md:text-base">
                                        <dl class="divide-y divide-gray-100">
                                            <!-- Nov12 -->
                                            <div
                                                class="bg-gray-50 rounded-t-xl px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                                <dt class="font-medium text-gray-900">Date Re-homed</dt>
                                                <dd class="leading-6 text-gray-700">
                                                    {{ selectedProfile.date_rehomed }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Given-Name</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2">
                                                    {{ name }}, "{{ nickname }}"</dd>
                                            </div>
                                            <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Pet Type</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ selectedProfile.pet_category }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Breed / Mix</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ selectedProfile.breed }}</dd>
                                            </div>
                                            <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Age / Gender</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ selectedProfile.age }}
                                                    <span v-if="selectedProfile.age > 1">
                                                        years old
                                                    </span>
                                                    <span v-if="selectedProfile.age == 1">
                                                        year old
                                                    </span>
                                                    <span class="i" v-else>
                                                        To be Confirmed
                                                    </span>
                                                    <span v-if="selectedProfile.gender == 'f'">Female</span>
                                                    <span v-else>Male</span>
                                                </dd>
                                                 
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Size</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ selectedProfile.size }}</dd>
                                            </div>
                                            <div class="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Coat / Fur</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ selectedProfile.coat }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="font-medium text-gray-900">Energy Level</dt>
                                                <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ selectedProfile.energylevel }}</dd>
                                            </div>
                                            <!-- Nov12 end line changes -->
                                        </dl>
                                    </div>

                                    <div class="sm:w-full lg:w-[55%] flex flex-col gap-y-4">
                                        <div class="border rounded-xl text-start">
                                            <div
                                                class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-100 rounded-t-xl">
                                                <!-- Nov12 name -->
                                                <span
                                                    class="text-lg font-semibold leading-6 text-gray-900 sm:col-span-3">
                                                    About {{ name }}</span>
                                            </div>
                                            <div class="px-4 py-4 sm:gap-y-2 sm:px-6">
                                                <!-- Nov12 selectedProfile.about -->
                                                <dd class="leading-6 text-gray-700">
                                                    {{ selectedProfile.about }}"</dd>
                                            </div>
                                        </div>

                                        <div
                                            class="border rounded-xl border-gray-100 mb-8 text-start sm:text-sm md:text-base">
                                            <dl class="divide-y divide-gray-100">
                                                <div
                                                    class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-100 rounded-t-xl">
                                                    <span
                                                        class="text-lg font-semibold leading-6 text-gray-900 sm:col-span-3">
                                                        Health And Medical</span>
                                                </div>
                                                <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6"
                                                    v-for="(item, index) in healthAndMedical" :key="index">
                                                    <dt class="font-medium leading-6 text-gray-900 mr-[2rem]">{{
                                                        item.label }}</dt>
                                                    <dd class="leading-6 text-gray-700 sm:col-span-2 ">
                                                        {{ item.status }} {{ item.details ? `${item.details}` : '' }}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- content end -->

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>