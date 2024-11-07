<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
    selectedPostDetails: {
        type: Object,
        required: true,
    },
});

// Data properties
const viewreportpost = ref({
    id: 1,
    username: 'Eric Jr.',
    name: 'Eric',
    lastname: 'Ramones',
    type: 'Missing Dog',
    caption: 'Found this dog at abandoned lot near STI College Davao',
    location: '#506 Lim Building J.P. Laurel Avenue, Corner Acacia, Davao City, Philippines',
    animalstatus: 'Severe',
    imageUrl: require('@/assets/images/homepage.png'),
    badge: 'rescuer',
});

// Example selectedPost and currentIndex for computed properties
const selectedPost = ref({
    photos: [require('@/assets/images/eric.png'),
    require('@/assets/images/homepage.png'),
    require('@/assets/images/eric.png')] // replace with actual photos array
});
const currentIndex = ref(0);

// Computed properties
const postImageUrl = computed(() => selectedPost.value.photos[currentIndex.value]);
const hasPrev = computed(() => currentIndex.value > 0);
const hasNext = computed(() => currentIndex.value < selectedPost.value.photos.length - 1);

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
</script>
<template>
    <div id="marginright" class="pb-[2rem] lg:mx-[3rem] flex justify-between items-center">
        <div>
            <RouterLink to="/rescueoperation" class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="text-[14px] hover:font-medium">Back</span>
            </RouterLink>
        </div>
    </div>
    <div class="flex justify-center items-center h-full">
        <div class="border rounded-lg bg-white w-full h-fit mb-4">
            <div class="px-[2rem] py-[10px] border-b-2 flex items-center gap-x-2 text-gray-600">

                <RouterLink class="hover:text-gray-900 hover:underline">
                    <h1 class="text-sm font-semibold">
                        {{ viewreportpost.name }} tite
                    </h1>
                </RouterLink>
                <span class="text-[12px] border rounded-xl px-2 text-gray-500">{{ viewreportpost.badge }}</span>
            </div>
            <div class="relative bg-black flex justify-center items-center ">
                <div
                    class="absolute left-4 z-10 bg-white bg-opacity-40 rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                    <button v-if="hasPrev" @click="prevImage">
                        <ChevronLeftIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-700 sm:hover:text-white" />
                    </button>
                </div>
                <div class="flex">
                    <img :src="postImageUrl" alt="Image post"
                        class="flex-shrink-0 aspect-auto sm:w-full xl:w-[80rem] xl:h-[50rem] object-contain" />
                </div>
                <!--<div class="w-full bg-slate-50">
                    <img class="mx-auto flex-shrink-0 w-[50rem] object-cover" :src="viewreportpost.imageUrl"
                        alt="image post" />
                </div> -->
                <div
                    class="absolute right-4 z-10 bg-white bg-opacity-40 rounded-full flex items-center hover:bg-gray-100 hover:bg-opacity-50">
                    <button v-if="hasNext" @click="nextImage">
                        <ChevronRightIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-700 sm:hover:text-white" />
                    </button>
                </div>
            </div>
            <div class="px-[2rem] py-[2rem] flex flex-col">
                <span> {{ viewreportpost.type }}</span>
                <span> {{ viewreportpost.animalstatus }}</span>
                <span> {{ viewreportpost.location }}</span>
                <p class="text-sm font-medium text-gray-900 pt-[1rem]">{{ viewreportpost.caption }}</p>
            </div>
        </div>
    </div>
</template>