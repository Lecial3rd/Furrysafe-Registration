<!-- <script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/vue/20/solid";

import CreatePostModal from '@/components/Shelter/shelter_NewPostModal.vue' // for edit modal reusing the create post modal
const openEditModal = ref(false) // for create report modal

// dropdown button (edit and delete)
const isOpen = ref(false);
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Reactive state
const currentIndex = ref(0);


// Computed properties
const currentImageUrl = computed(() => viewpostdetials.imageUrls[currentIndex.value]);
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < viewpostdetials.imageUrls.length - 1);

// Methods
const nextImage = () => {
    if (hasNext.value) {
        currentIndex.value++;
    }
};

const prevImage = () => {
    if (hasPrev.value) {
        currentIndex.value--;
    }
};

// pet details
const viewpostdetials = {
    id: 1,
    sheltername: 'Shelter Ni Eric',
    profile: require("@/assets/images/eric.png"),
    name: "Eric",
    nickname: "ric",
    rehomed: "10/22/2024",
    type: "Dog",
    breed: "Bulldog",
    gender: "Male",
    age: '2 yrs old',
    size: "50 pounds",
    coat: "Medium Fur",
    energylvl: "high",
    about: "jdsjdsjdsjd;l yehhhh dshd hdsahdo  idsoidh disj hsoi ihhs ihuh hsa gu hgp  ihdhasoh  ihuidgsa  ugui gdsugd ugug dus usgduia",
    vacstatus: "rabies",
    surgerystatus: "Chemical Sterilazation",
    medcondition: "none",
    needs: "Lambing ni Rhe...",
    postcaption: "caption here...",
    imageUrls: [
        require("@/assets/images/homepage.png"),
        require("@/assets/images/charles.png"),
        require("@/assets/images/eric.png"),
        require("@/assets/images/bals.png"),
    ],

};

const healthAndMedical = ref([
    {
        label: 'Vaccinations Status',
        status: "Up-to-date",
        details: "including rabies and FVRCP"
    },
    {
        label: 'Spay / Neuter',
        status: "Neuter"
    },
    {
        label: 'Medical Conditions',
        status: "None known",
        details: "but has a slight dental issue that requires regular cleaning"
    },
    {
        label: 'Special Needs',
        status: "None"
    }
]);

let selectedPostDetails = ref([])
const props = defineProps({ // for reuse form defines mode if either edit or create - joey
    selectedPostDetails: {
        type: Object,
        required: false
    }
})
const emit = defineEmits(['close']) // for closing the modal

const open = ref(true)

onMounted(async () => {
    selectedPostDetails.value = props.selectedPostDetails
    console.log("selected post in grid view", selectedPostDetails.value)
})

</script> -->

<script setup>
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount  } from 'vue'
import axios from "axios"
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/vue/20/solid";
// to close press esc
onMounted(() => {
  const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
  window.addEventListener('keydown', closeModalOnEsc)
  onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})

import CreatePostModal from '@/components/Shelter/shelter_NewPostModal.vue' // for edit modal reusing the create post modal
// dropdown button (edit and delete)
const isOpen = ref(false);
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Reactive state
const currentIndex = ref(0);

let selectedPostDetails = ref([])
const props = defineProps({ // for reuse form defines mode if either edit or create - joey
    selectedPostDetails: {
        type: Object,
        required: false
    },
    mode: {
        type: String,
        required: false,
    },
});

// Computed properties
const currentImageUrl = computed(() => details_photos.value[currentIndex.value]); // Get the current image URL based on the current index
const hasPrev = computed(() => currentIndex.value > 0); // Check if there is a previous image available
const hasNext = computed(() => currentIndex.value < details_photos.value.length - 1); // Check if there is a next image available
// Check if there are any images to display (either profile or imageUrls) if wla kay and span mo display
const hasImages = computed(() => details_photos.value.length > 0 || (details_photos.value !== null && (details_photos.value && details_photos.value.length > 0)));

// Methods
const nextImage = () => {
    if (hasNext.value) {
        currentIndex.value++; // Increment the current index to show the next image
    }
};
const prevImage = () => {
    if (hasPrev.value) {
        currentIndex.value--; // Decrement the current index to show the previous image
    }
};

//functions 
let post_details = ref([])
let details_photos = ref([])
let vaccination_status = ref([])
async function getPetPostDetails() {
    let _user_id = selectedPostDetails.value.user_id
    let _pet_id = selectedPostDetails.value.pet_id
    let _post_id = selectedPostDetails.value.post_id

    try {
        const response = await axios.post("http://localhost:5000/profile", {
            _userid: _user_id,
            _petid: _pet_id,
            _post_id: _post_id
        });

        console.log("response", response.data)
        if (response.data.length > 0) {
            post_details.value = response.data[0]

            // Extract photos
            const profilePhoto = response.data[0].profileurl ? [response.data[0].profileurl] : [];
            const additionalPhotos = response.data[0].additionalphotos != 'No additional photos' ? response.data[0].additionalphotos.split(', ') : [];
            const postPhotos = response.data[0].post_photos || [];

            // Combine all photos into details_photos
            details_photos.value = [...postPhotos, ...profilePhoto, ...additionalPhotos];
        }
    }
    catch (err) {
        console.log("an error occured while retrieving profile", err)
    }
}

const separatedName = ref({ name: "", nickname: "" });
watch(
    () => post_details.value.name_nickname,
    (newNameNickname) => {
        // Check if newNameNickname is defined before accessing it
        if (newNameNickname) {
            const [name, nickname] = newNameNickname.includes("/")
                ? newNameNickname.split("/")
                : [newNameNickname, ""]; // If no "/", nickname is an empty string
            separatedName.value = { name: name.trim(), nickname: nickname.trim() };
        }
    },
    { immediate: true } // Run immediately on initial value
);


onMounted(async () => {
    selectedPostDetails.value = props.selectedPostDetails
    await getPetPostDetails()
    console.log("What Mode:", props.mode) // for pov
})

const emit = defineEmits(['close']) // for closing the modal
const open = ref(true)
</script>


<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-50" @click.self="$emit('close')">
            diri?
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-70 transition-opacity" />
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
                                class="absolute z-10 sm:right-1 sm:top-1 md:right-3.5 md:top-3 rounded-full flex items-center p-1 group">
                                <button @click="$emit('close')" ref="cancelButtonRef">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2"
                                        class="sm:w-5 sm:h-5 md:w-7 md:h-7 text-gray-200 hover:text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- content start -->
                            <div
                                class="overflow-hidden bg-white shadow sm:rounded-lg text-start sm:px-[1rem] md:px-[2rem] pt-8 xl:px-[5rem] sm:w-fit xl:w-[70rem]">
                                <!-- image preview -->
                                <div class="flex mt-8 sm:mt-0 justify-center">

                                    <div v-if="hasImages"
                                        class="relative container md:rounded-l-2xl flex justify-center items-center">
                                        <div
                                            class="absolute sm:-left-7 lg:-left-11 z-10 bg-gray-300 bg-opacity-40 w-fit rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                            <button v-if="hasPrev" @click="prevImage">
                                                <ChevronLeftIcon
                                                    class="sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-gray-500 sm:hover:text-gray-700" />
                                            </button>
                                        </div>
                                        <div class="flex justify-center sm:h-[20rem] md:h-[35rem] w-full">
                                            <img v-if="currentImageUrl" :src="currentImageUrl" alt="Image post"
                                                class="flex-shrink-0 object-contain" />
                                        </div>
                                        <div
                                            class="absolute sm:-right-7 lg:-right-11 z-10 bg-gray-300 bg-opacity-40 w-fit rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                            <button v-if="hasNext" @click="nextImage">
                                                <ChevronRightIcon
                                                    class="sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-gray-500 sm:hover:text-gray-700" />
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else class="sm:text-sm md:text-base font-semibold text-gray-600">
                                        <span>No images to preview</span>
                                    </div>
                                </div>
                                <div class="px-4 py-6 sm:px-6 flex justify-between">
                                    <!-- ADD DROP DOWN EDIT -->
                                    <div>
                                        <h3 class="text-base font-semibold leading-7 text-gray-900">Shelter's Name
                                        </h3>
                                        <p class=" max-w-2xl text-sm leading-6 text-gray-500">
                                            {{ post_details.owner }}</p>
                                    </div>
                                    <div v-show="!mode" class="relative inline-block">
                                        <button @click="toggleDropdown" class="focus:outline-none">
                                            <EllipsisHorizontalIcon class="h-6 w-6 text-gray-500" />
                                        </button>

                                        <div v-if="isOpen"
                                            class="absolute right-0 w-[10rem] text-sm font-medium border rounded-lg shadow-lg bg-white z-10">
                                            <div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                <button @click="openEditModal = true; currentModalMode = 'edit'"
                                                    class="block w-full py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-lg"
                                                    role="menuitem">Edit Post</button>

                                                <CreatePostModal v-if="openEditModal" mode="edit"
                                                    @close="openEditModal = false" />
                                                <button @click="deletePost"
                                                    class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-lg"
                                                    role="menuitem">Delete Post</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="border rounded-xl border-gray-100 sm:mx-4 mb-8">
                                    <dl class="divide-y divide-gray-100">
                                        <div
                                            class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-t-xl bg-gray-100">
                                            <span class="text-base font-semibold leading-6 text-gray-900 sm:col-span-3">
                                                Pet Information</span>
                                        </div>
                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Status</dt> <!-- HERE JO-->
                                            <dd v-if="post_details.status != ''"
                                                class=" text-sm leading-6 text-gray-700 w-fit px-3 rounded-full" :class="{
                                                    'bg-green-50 text-green-600 border-green-100': post_details.status === 'Available',
                                                    'bg-gray-50 text-gray-600 border-gray-100': post_details.status === 'Adopted',
                                                    'bg-teal-50 text-teal-600 border-teal-100': post_details.status === 'In Foster Care',
                                                    'bg-amber-50 text-amber-600 border-amber-100': post_details.status === 'Own'
                                                }">
                                                {{ post_details.status }}</dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Date Re-homed</dt>
                                            <dd v-if="post_details.date_rehomed != ''"
                                                class=" text-sm leading-6 text-gray-700">
                                                {{ post_details.date_rehomed }}</dd>
                                            <dd v-else class=" text-sm italic leading-6 text-gray-700">
                                                To Be Confirmed</dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Given-Name</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2">
                                                {{ separatedName.name.charAt(0).toUpperCase() +
                                                    separatedName.name.slice(1) }}, "{{
                                                    separatedName.nickname.charAt(0).toUpperCase() +
                                                    separatedName.nickname.slice(1) }}" </dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Pet Type</dt>
                                            <dd class="text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.pet_category }}</dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Breed / Mix</dt>
                                            <dd class="text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.breed }}</dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Age / Gender</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                <span v-if="post_details.age < 1"
                                                    class=" text-sm italic leading-6 text-gray-700">
                                                    To Be Confirmed
                                                </span>
                                                <span v-else>
                                                    {{ post_details.age }} years old
                                                </span> ,
                                                <span v-if="post_details.gender == 'm'">
                                                    Male
                                                </span>
                                                <span v-else-if="post_details.gender == 'f'">
                                                    Female
                                                </span>
                                                <span v-else class=" text-sm italic leading-6 text-gray-700">
                                                    To Be Confirmed
                                                </span>
                                            </dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Size</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.size }}</dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Coat / Fur</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                <span v-if="post_details.coat == ''"
                                                    class=" text-sm italic leading-6 text-gray-700">
                                                    To Be Confirmed
                                                </span>
                                                <span>
                                                    {{ post_details.coat }}
                                                </span>
                                            </dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">Energy Level</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.energylevel }}</dd>
                                        </div>

                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-900">About</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.about }}</dd>
                                        </div>
                                        <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-100">
                                            <span class="text-base font-semibold leading-6 text-gray-900 sm:col-span-3">
                                                Health And Medical</span>
                                        </div>
                                        <!-- <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6"
                                            v-for="(item, index) in healthAndMedical" :key="index">
                                            <dt class="text-sm font-medium leading-6 text-gray-900 mr-[2rem]">{{
                                                item.label }}</dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ item.status }} {{ item.details ? `(${item.details})` : '' }}</dd>
                                        </div> -->
                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium leading-6 text-gray-900 mr-[2rem]">
                                                Vaccinations
                                            </dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.vaccinename }}
                                            </dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium leading-6 text-gray-900 mr-[2rem]">
                                                Sterilazation
                                            </dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                {{ post_details.sterilization }}
                                            </dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium leading-6 text-gray-900 mr-[2rem]">
                                                Special Needs
                                            </dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                <span v-if="post_details.need == ''">
                                                    None
                                                </span>
                                                <span>
                                                    {{ post_details.need }}
                                                </span>
                                            </dd>
                                        </div>
                                        <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                            <dt class="text-sm font-medium leading-6 text-gray-900 mr-[2rem]">
                                                Medical Condition
                                            </dt>
                                            <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                <span v-if="post_details.condition == ''">
                                                    None
                                                </span>
                                                <span>
                                                    {{ post_details.condition }}
                                                </span>
                                            </dd>
                                        </div>
                                    </dl>
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

<!-- <template>
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

                            
                            <div class="flex flex-col bg-white sm:rounded-2xl">

                                <div class="flex p-3" />

                                
                                <div class="relative bg-black flex justify-center items-center">
                                    <div
                                        class="absolute left-4 z-10 bg-white bg-opacity-40 rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                        <button v-if="hasPrev" @click="prevImage">
                                            <ChevronLeftIcon
                                                class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-700 sm:hover:text-white" />
                                        </button>
                                    </div>
                                    <div class="flex">
                                        <img :src="currentImageUrl" alt="Image post"
                                            class="flex-shrink-0 aspect-auto sm:w-full xl:w-[80rem] xl:h-[40rem] object-contain" />
                                    </div>
                                    <div
                                        class="absolute right-4 z-10 bg-white bg-opacity-40 rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                        <button v-if="hasNext" @click="nextImage">
                                            <ChevronRightIcon
                                                class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-700 sm:hover:text-white" />
                                        </button>
                                    </div>
                                </div>

                                
                                <div
                                    class="overflow-hidden bg-white shadow sm:rounded-lg text-start sm:px-[1rem] xl:px-[5rem]">
                                    <div class="mt-4 mx-6 flex justify-between items-center">
                                        <div>
                                            <h3 class="text-base font-bold leading-7 text-gray-700">
                                                {{post_details}}
                                            </h3>
                                        </div>

                                        
                                        <div class="relative inline-block">
                                            <button @click="toggleDropdown" class="focus:outline-none">
                                                <EllipsisHorizontalIcon class="h-6 w-6 text-gray-500" />
                                            </button>

                                            <div v-if="isOpen"
                                                class="absolute right-0 w-[10rem] text-sm font-medium border rounded-lg shadow-lg bg-white z-10">
                                                <div role="menu" aria-orientation="vertical"
                                                    aria-labelledby="options-menu">
                                                    <button @click="openEditModal = true; currentModalMode = 'edit'"
                                                        class="block w-full py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-lg"
                                                        role="menuitem">Edit Post</button>

                                                    <CreatePostModal v-if="openEditModal" mode="edit"
                                                        @close="openEditModal = false" />
                                                    <button @click="deletePost"
                                                        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-lg"
                                                        role="menuitem">Delete Post</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mx-6 mb-4">
                                        <p class="w-full text-sm leading-6 font-medium text-gray-500">
                                            post</p>
                                    </div>

                                    
                                    <div class="border rounded-xl border-gray-100 sm:mx-4 mb-8">
                                        <dl class="divide-y divide-gray-100">
                                            <div
                                                class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-t-xl bg-gray-100 sm:place-items-center md:place-items-start">
                                                <span
                                                    class="text-base font-semibold leading-6 text-gray-900 sm:col-span-3">
                                                    Pet Information</span>
                                            </div>
                                            <div
                                                class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6 sm:place-items-center md:place-items-start">
                                                <dt class="text-sm font-medium text-gray-900">Date Re-homed</dt>
                                                <dd class=" text-sm leading-6 text-gray-700">
                                                    {{ viewpostdetials.rehomed }}"</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Given-Name</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2">
                                                    {{ viewpostdetials.name }}, "{{ viewpostdetials.nickname }}"
                                                </dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Pet Type</dt>
                                                <dd class="text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.type }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Breed / Mix</dt>
                                                <dd class="text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.breed }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Age / Gender</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.age }}, {{ viewpostdetials.gender }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Size</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.size }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Coat / Fur</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.coat }}</dd>
                                            </div>
                                            <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">Energy Level</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.energylvl }}</dd>
                                            </div>

                                            <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6">
                                                <dt class="text-sm font-medium text-gray-900">About</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ viewpostdetials.about }}</dd>
                                            </div>
                                            <div class="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-100">
                                                <span
                                                    class="text-base font-semibold leading-6 text-gray-900 sm:col-span-3">
                                                    Health And Medical</span>
                                            </div>
                                            <div class="px-4 py-4 sm:grid md:grid-cols-3 sm:gap-y-2 sm:px-6"
                                                v-for="(item, index) in healthAndMedical" :key="index">
                                                <dt class="text-sm font-medium leading-6 text-gray-900 mr-[2rem]">
                                                    {{
                                                        item.label }}</dt>
                                                <dd class=" text-sm leading-6 text-gray-700 sm:col-span-2 ">
                                                    {{ item.status }} {{ item.details ? `(${item.details})` : ''
                                                    }}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template> -->