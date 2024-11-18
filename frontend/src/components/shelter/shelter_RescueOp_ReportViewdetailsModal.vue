<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/vue/20/solid";
import statusbuttons from '@/components/Shelter/shelter_RescueOp_ReportCard_ReportStatusButtons.vue';
import axios from "axios"

import CreateReportModal from '@/components/Buddy/buddy_CreateReportPost_Modal.vue' // for edit modal
const openEditModal = ref(false) // for create report modal

// dropdown button (edit and delete)
const isOpen = ref(false);
const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

// Reactive state
const currentIndex = ref(0);
const postImageUrl = computed(() => selectedReportDetails.value.photos[currentIndex.value]);

const selectedReportDetails = ref([])

const props = defineProps({ // for reuse form defines mode if either edit or create - joey
    selectedPostDetails: {
        type: Object,
        required: false
    }
});
// Computed properties
const currentImageUrl = computed(() => selectedReportDetails.value.photos[currentIndex.value]);
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < selectedReportDetails.value.photos.length - 1);
const formattedDate = computed(() => {
    if (selectedReportDetails.value.date) {
        const date = new Date(selectedReportDetails.value.date);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }
    return "Invalid date";
});

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

//functions 
let _user_id = ref(null)
let userdetails = ref([])
async function getUserDetailsOnHover() {
    console.log("on hover")
    try {
        const response = await axios.post("http://localhost:5000/getusedetails", {
            _id: _user_id.value
        });

        if (response.data.success && response.data.data.length > 0) {
            userdetails.value = response.data.data;

            console.log("value", userdetails.value[0].profile_url)
        }
    }
    catch (err) {
        console.log("error in retrieve reports", err)
    }

}
onMounted(async () => {
    selectedReportDetails.value = props.selectedPostDetails;
    console.log("props", selectedReportDetails.value);
    _user_id.value = selectedReportDetails.value.user_id
    await getUserDetailsOnHover()
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
                            <div class="flex flex-col bg-white sm:rounded-2xl md:rounded-none">
                                <div class="flex sm:flex-col md:flex-row">
                                    <!-- display username on small screen -->
                                    <!-- Nov5 salpocial's replacement -->
                                    <!-- <div
                                        class="flex items-center justify-between text-gray-700 md:hidden gap-x-2 border-b px-[2rem] py-4">
                                        <div class="flex items-center gap-x-2">
                                            <img :src="viewpostdetials.profile" alt="profile"
                                                class="w-10 h-10 rounded-full object-cover" />
                                            <span class="font-bold sm:text-base xl:text-xl">
                                                {{ selectedReportDetails.posted_by }}</span>
                                        </div> -->
                                    <!-- Nov5 salpocial's replacement but not use-->

                                    <!-- orig code -->
                                    <div v-if="userdetails[0]"
                                        class="flex items-center justify-between text-gray-700 md:hidden gap-x-2 border-b px-[2rem] py-4">
                                        <div class="flex items-center gap-x-2">
                                            <img :src="userdetails[0].profile_url" alt="profile"
                                                class="w-10 h-10 rounded-full object-cover" />
                                            <span class="font-bold sm:text-base xl:text-xl">
                                                {{ selectedReportDetails.posted_by }}</span>
                                        </div>
                                    </div>
                                    <div
                                        class="relative overflow-hidden bg-black flex justify-center items-center sm:w-full md:w-[60%] xl:w-[70%]">
                                        <div
                                            class="absolute left-4 z-10 bg-white bg-opacity-40 rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                                            <button v-if="hasPrev" @click="prevImage">
                                                <ChevronLeftIcon
                                                    class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-700 sm:hover:text-white" />
                                            </button>
                                        </div>
                                        <div class="flex">
                                            <img :src="postImageUrl" alt="Image post"
                                                class="flex-shrink-0 aspect-auto sm:w-full xl:w-[80rem] xl:h-[55rem] object-contain" />
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
                                        class="text-gray-700 sm:w-full md:w-[40%] xl:w-[30%] sm:py-[1rem] flex flex-col text-sm sm:border-t lg:border-l ">
                                        <!-- display details in large screen -->
                                        <div
                                            class="flex items-center justify-between sm:hidden md:flex gap-x-2 border-b px-[2rem] pb-4">
                                            <!-- Nov5 salpocial's replacement -->
                                            <!-- <div class="flex items- center gap-x-3">
                                                <img :src="viewpostdetials.profile" alt="profile"
                                                    class="w-10 h-10 rounded-full object-cover" />
                                                <span class="font-bold sm:text-base xl:text-xl">{{
                                                    selectedReportDetails.posted_by }}</span>
                                            </div> -->
                                            <!-- Nov5 salpocial's replacement but not use-->

                                            <!-- orig code -->
                                            <div v-if="userdetails[0]" class="flex items-center gap-x-3">
                                                <img :src="userdetails[0].profile_url" alt="profile"
                                                    class="w-10 h-10 rounded-full object-cover" />
                                                <span class="font-bold sm:text-base xl:text-xl">{{
                                                    selectedReportDetails.posted_by }}</span>
                                            </div>
                                        </div>
                                        <div class="flex flex-col text-left mx-8 my-4 sm:text-sm md:text-base">
                                            <div class="flex justify-center border-b pb-7">
                                                <dd class="flex flex-col justify-center gap-x-3 gap-y-1">
                                                    <p
                                                        class="max-w-2xl text-sm leading-6 text-gray-500 font-semibold flex justify-center">
                                                        Report Status
                                                    </p>
                                                    <span :class="{
                                                        'bg-green-50 text-green-600 border-green-100': selectedReportDetails.report_status === 'Rescued',
                                                        'bg-red-50 text-red-600 border-red-100': selectedReportDetails.report_status === 'Pending',
                                                        'bg-amber-50 text-amber-600 border-amber-100': selectedReportDetails.report_status === 'In progress'
                                                    }"
                                                        class="text-[12px] font-medium leading-6 border px-4 rounded-full w-fit">
                                                        {{ selectedReportDetails.report_status }}</span>
                                                </dd>
                                            </div>
                                            <div class="my-4">
                                                <div class="flex justify-center lg:justify-start">
                                                    <h3 class="text-base font-semibold leading-7 text-gray-900">
                                                        Report Information</h3>
                                                </div>
                                                <div class="mt-4 border-t border-gray-100">
                                                    <dl class="divide-y divide-gray-100">
                                                        <div
                                                            class="bg-gray-50 px-4 py-6 sm:grid xl:grid-cols-3 sm:gap-y-2 gap-x-4 sm:px-3">
                                                            <dt class="text-sm font-medium leading-6 text-gray-900">
                                                                Report Type
                                                            </dt>
                                                            <dd :class="{
                                                                'text-green-600': selectedReportDetails.report_status === 'Rescued',
                                                                'text-red-600': selectedReportDetails.report_status === 'Pending',
                                                                'text-amber-600': selectedReportDetails.report_status === 'In progress'
                                                            }"
                                                                class="text-sm leading-6 font-bold text-red-600 xl:col-span-2">
                                                                {{ selectedReportDetails.post_type }}</dd>
                                                        </div>
                                                        <div
                                                            class="bg-white px-4 py-6 sm:grid xl:grid-cols-3 sm:gap-y-2 gap-x-4 sm:px-3">
                                                            <dt class="text-sm font-medium leading-6 text-gray-900">
                                                                Pet Category</dt>
                                                            <dd class="text-sm leading-6 text-gray-700 xl:col-span-2">
                                                                {{ selectedReportDetails.category }}</dd>
                                                        </div>
                                                        <div
                                                            class="bg-gray-50 px-4 py-6 sm:grid xl:grid-cols-3 gap-y-1 gap-x-4 sm:px-3">
                                                            <dt class="text-sm font-medium leading-6 text-gray-900">
                                                                Pet Condition</dt>
                                                            <dd class="text-sm leading-6 text-gray-700 xl:col-span-2">
                                                                {{ selectedReportDetails.pet_condition }}</dd>
                                                        </div>
                                                        <div
                                                            class="bg-white px-4 py-6 sm:grid xl:grid-cols-3 sm:gap-y-2 gap-x-4 sm:px-3">
                                                            <dt class="text-sm font-medium leading-6 text-gray-900">
                                                                Report Location</dt>
                                                            <dd class="text-sm leading-6 text-gray-700 xl:col-span-2">
                                                                {{ selectedReportDetails.report_address_location }}</dd>
                                                        </div>
                                                        <div
                                                            class="bg-gray-50 px-4 py-6 sm:grid xl:grid-cols-3 gap-y-1 gap-x-4 sm:px-3">
                                                            <dt class="text-sm font-medium leading-6 text-gray-900">
                                                                Report Details</dt>
                                                            <dd class="text-sm leading-6 xl:col-span-2 text-gray-700">
                                                                {{ selectedReportDetails.content }}</dd>
                                                        </div>
                                                        <div
                                                            class="px-4 py-6 sm:grid xl:grid-cols-3 gap-y-1 gap-x-4 sm:px-3">
                                                            <dt class="text-sm font-medium leading-6 text-gray-900">
                                                                Date Reported</dt>
                                                            <dd
                                                                class="text-sm leading-6 xl:col-span-2 text-gray-500 font-bold">
                                                                {{ formattedDate }}
                                                            </dd>
                                                        </div>
                                                        <div v-if="selectedReportDetails.report_status === 'Pending'">
                                                            <button class="w-full">
                                                                <!-- Nov15 added :postId="selectedReportDetails.post_id" salpocial's integration-->
                                                                <statusbuttons
                                                                    :postId="selectedReportDetails.post_id" />
                                                            </button>
                                                        </div>
                                                    </dl>
                                                </div>
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