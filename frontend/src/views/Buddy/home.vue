<script setup>
import { ref } from 'vue';
// import { ChatBubbleLeftIcon } from "@heroicons/vue/24/outline";
import { IdentificationIcon } from '@heroicons/vue/24/solid'
import viewpostdetials from '@/components/Buddy/buddy_Home_ViewdetailsModal.vue';
import viewpostimagepreview from '@/components/Buddy/buddy_Home_ImagePreviewModal.vue';


import previewhover from '@/components/Buddy/buddy_HoverName.vue';
const hoveredIndex = ref(null); // Track the hovered item index

// view detials
const selectedPostViewDetailsId = ref(null);

const toggleModalViewDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    console.log(id);
};

// view image preview
const selectedPostViewImagePreviewId = ref(null);

const toggleModalViewImagePreview = (id) => {
    selectedPostViewImagePreviewId.value = selectedPostViewImagePreviewId.value === id ? null : id;
    console.log(id);
};


// newsfeed
const shelterpost = ref([
    {
        id: 1,
        username: 'Eric',
        profileImage: require('@/assets/images/homepage.png'),
        caption: 'You can’t buy love, but you can rescue it.',
        imageUrl: require('@/assets/images/homepage.png'),
    },
    {
        id: 2,
        username: 'bals',
        profileImage: require('@/assets/images/bals.png'),
        caption: 'You can’t buy love, but you can rescue it.',
        imageUrl: require('@/assets/images/bals.png'),
    },
    {
        id: 3,
        username: 'charles',
        profileImage: require('@/assets/images/charles.png'),
        caption: 'You can’t buy love, but you can rescue it.',
        imageUrl: require('@/assets/images/charles.png'),
    },
    {
        id: 4,
        username: 'eric',
        profileImage: require('@/assets/images/eric.png'),
        caption: 'You can’t buy love, but you can rescue it.',
        imageUrl: require('@/assets/images/eric.png'),
    },
]);
</script>

<template>
    <div v-for="post in shelterpost" :key="post.id"
        class="sm:w-[80%] md:w-[75%] lg:w-[70%] xl:w-[50%] h-fit mb-4 mx-auto">
        <div class="px-[.5rem] py-[10px] flex gap-x-2 items-center">
            <div><img :src="post.profileImage" alt="profile"
                    class="w-10 h-10 flex border bg-white rounded-full object-cover" /></div>
            <RouterLink to="" class="font-bold text-base">
                <div @mouseenter="hoveredIndex = post.id" @mouseleave="hoveredIndex = null" class="relative inline-block">
                    <span class="hover:underline cursor-pointer">{{ post.username }}</span>
                    <previewhover v-if="hoveredIndex === post.id" class="absolute z-10" />
                </div>
            </RouterLink>
        </div>

        <div class="w-full h-fit rounded-xl bg-gray-900 flex items-center relative group">
            <img @click="toggleModalViewImagePreview(post.id)"
                class="mx-auto flex-shrink-0 w-[50rem] rounded-xl object-contain cursor-pointer" :src="post.imageUrl"
                alt="image post" />
            <!-- Image Preview -->
            <viewpostimagepreview v-if="selectedPostViewImagePreviewId === post.id"
                @close="toggleModalViewImagePreview(post.id)" />
            <!-- view details button -->

            <div class="absolute bg-gray-900 bg-opacity-30 rounded-b-xl w-full bottom-0 hidden group-hover:block">
                <div class="flex justify-end p-2">
                    <button @click="toggleModalViewDetails(post.id)" class="relative right-0">
                        <IdentificationIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                    </button>
                </div>
            </div>
            <!-- <button @click="toggleModalViewDetails(post.id)" class="absolute bottom-4 right-4 hidden group-hover:block">
                <IdentificationIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </button> -->

            <viewpostdetials v-if="selectedPostViewDetailsId === post.id" @close="toggleModalViewDetails(post.id)" />
        </div>
        <div class="px-[.5rem] py-[.5rem] flex flex-col gap-y-2 items-start bg-gray-100 bg-opacity-0">
            <div class="py-2">
                <p class="sm:text-sm md:text-base font-medium text-gray-700">
                    <b class="pr-2">{{ post.username }}</b>
                    {{ post.caption }}
                </p>
            </div>
        </div>
    </div>
</template>
