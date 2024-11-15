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
                                        class="w-7 h-7 text-gray-100 hover:text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- context start -->
                            <div class="flex flex-col bg-white sm:rounded-2xl md:rounded-none">
                                <div class="flex sm:flex-col md:flex-row">
                                    <!-- display sheltername on small screen -->
                                    <div
                                        class="flex items-center justify-between text-gray-700 md:hidden gap-x-2 border-b px-[2rem] py-4">
                                        <div>
                                            <h3 class="text-base font-semibold leading-7 text-gray-900">
                                                Event's Information</h3>
                                        </div>

                                        <!-- dropdown buttons -->
                                        <div class="relative inline-block text-left">
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

                                                    <CreateEventModal v-if="openEditModal" mode="edit"
                                                        @close="openEditModal = false" />

                                                    <button @click="deletePost"
                                                        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-lg"
                                                        role="menuitem">Delete Post</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div
                                        class="relative bg-black flex justify-center items-center sm:w-full md:w-[60%] xl:w-[70%]">
                                        <div
                                            class="absolute left-4 z-10 bg-white bg-opacity-40 rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                            <button v-if="hasPrev" @click="prevImage">
                                                <ChevronLeftIcon
                                                    class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-700 sm:hover:text-white" />
                                            </button>
                                        </div>
                                        <div class="flex">
                                            <img :src="currentImageUrl" alt="Image post"
                                                class="flex-shrink-0 aspect-auto sm:w-full xl:w-[80rem] xl:h-[50rem] object-contain" />
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
                                        class="text-gray-700 sm:w-full md:w-[40%] xl:w-[30%] sm:py-[1rem] rounded-r-2xl flex flex-col text-sm sm:border-t lg:border-l ">
                                        <!-- display details in large screen -->
                                        <div
                                            class="flex items-center justify-between sm:hidden md:flex gap-x-2 border-b px-[2rem] pb-4">
                                            <div>
                                                <h3 class="text-base font-semibold leading-7 text-gray-900">
                                                    Event's Information</h3>
                                            </div>

                                            <!-- dropdown buttons -->
                                            <div class="relative inline-block text-left">
                                                <button @click="toggleDropdown" class="focus:outline-none">
                                                    <EllipsisHorizontalIcon class="h-6 w-6 text-gray-500" />
                                                </button>

                                                <div v-if="isOpen"
                                                    class="absolute right-0 w-[10rem] text-base font-medium border rounded-lg shadow-lg bg-white z-10">
                                                    <div role="menu" aria-orientation="vertical"
                                                        aria-labelledby="options-menu">

                                                        <button @click="openEditModal = true; currentModalMode = 'edit'"
                                                            class="block w-full py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-t-lg"
                                                            role="menuitem">Edit Post</button>


                                                        <button @click="deletePost"
                                                            class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-b-lg"
                                                            role="menuitem">Delete Post</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="flex flex-col text-left mx-8 my-4 md:my-auto xl:my-8 sm:text-sm md:text-base">
                                            <div>
                                                <dl class="divide-y divide-gray-100">
                                                    <div
                                                        class="bg-gray-50 px-4 py-6 sm:grid xl:grid-cols-3 sm:gap-y-2 gap-x-4 sm:px-3">
                                                        <dt class="text-sm font-medium leading-6 text-gray-900">
                                                            Title
                                                        </dt>
                                                        <dd
                                                            class="mt-1 text-sm leading-6 text-gray-700 xl:col-span-2 sm:mt-0">
                                                            {{ selectedPetDetails.event_name }}</dd>
                                                    </div>
                                                    <div
                                                        class="bg-white px-4 py-6 sm:grid xl:grid-cols-3 sm:gap-y-2 gap-x-4 sm:px-3">
                                                        <dt class="text-sm font-medium leading-6 text-gray-900">
                                                            Time</dt>
                                                        <dd
                                                            class="mt-1 text-sm leading-6 text-gray-700 xl:col-span-2 sm:mt-0">
                                                            {{ date }}</dd>
                                                    </div>
                                                    <div
                                                        class="bg-white px-4 py-6 sm:grid xl:grid-cols-3 sm:gap-y-2 gap-x-4 sm:px-3">
                                                        <dt class="text-sm font-medium leading-6 text-gray-900">
                                                            Location</dt>
                                                        <dd
                                                            class="mt-1 text-sm leading-6 text-gray-700 xl:col-span-2 sm:mt-0">
                                                            location placeholder =)</dd>
                                                    </div>
                                                    <div
                                                        class="bg-gray-50 px-4 py-6 sm:grid xl:grid-cols-3 gap-y-1 gap-x-4 sm:px-3">
                                                        <dt class="text-sm font-medium leading-6 text-gray-900">
                                                            Details</dt>
                                                        <dd class="mt-1 text-sm leading-6 xl:col-span-2 text-gray-700">
                                                            {{ selectedPetDetails.caption }}</dd>
                                                    </div>
                                                </dl>

                                            </div>
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
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'

import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/vue/20/solid";

import CreateEventModal from '@/components/Shelter/shelter_EventPostModal.vue' // for edit modal
const openEditModal = ref(false) // for create Event modal

// dropdown button (edit and delete)
const isOpen = ref(false);
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Nov12
let date = ref(null)
onMounted(async () => {
    selectedPetDetails.value = props.selectedPetDetails

    date.value = formatDateRange(selectedPetDetails.value.date_time_start, selectedPetDetails.value.date_time_end)
    console.log("=)", selectedPetDetails.value)
})

let selectedPetDetails = ref([])
const props = defineProps({ // for reuse form defines mode if either edit or create - joey
    selectedPetDetails: {
        type: Object,
        required: false
    }
})

function formatDateRange(start, end) {
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric'
    };

    const startDate = new Date(start).toLocaleString('en-US', options);
    const endDate = new Date(end).toLocaleString('en-US', options);

    return `${startDate} to ${endDate}`;
}
// Nov12 end of new added line 

// Reactive state
const currentIndex = ref(0);

// Computed properties
const currentImageUrl = computed(() => selectedPetDetails.value.photo_urls[currentIndex.value]); // Nov12
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < selectedPetDetails.value.photo_urls.length - 1); // Nov12

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

const emit = defineEmits(['close']) // for closing the modal

// Nov12 to close press esc
onMounted(() => {
    const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
    window.addEventListener('keydown', closeModalOnEsc)
    onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})

const open = ref(true)
</script>