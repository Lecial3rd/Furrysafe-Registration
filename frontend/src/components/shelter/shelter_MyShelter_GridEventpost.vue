<template>
    <div class="xl:container mx-auto my-2">
        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
            <li v-for="post in postImages" :key="post.id" class="relative">
                <button @click="toggleModalViewDetails(post.id)" class="group block w-full overflow-hidden bg-white">
                    <!-- Display the first image in the array or the single image if it's not an array -->
                    <img :src="Array.isArray(post.imageUrl) ? post.imageUrl[0] : post.imageUrl" alt=""
                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                    <!-- Display the overlay icon if there are multiple images -->
                    <Square2StackIcon v-if="Array.isArray(post.imageUrl) && post.imageUrl.length > 1"
                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                </button>
                <vieweventdetials v-if="selectedPostViewDetailsId === post.id"
                    @close="toggleModalViewDetails(post.id)" />
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Square2StackIcon } from '@heroicons/vue/20/solid'

const postImages = [
    {
        id: 1,
        imageUrl: [require('@/assets/images/bals.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
    {
        id: 2,
        imageUrl: require('@/assets/images/bert.png')
    },
    {
        id: 3,
        imageUrl: [require('@/assets/images/charles.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
    {
        id: 4,
        imageUrl: [require('@/assets/images/homepage.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
    {
        id: 5,
        imageUrl: [require('@/assets/images/eric.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
];


import vieweventdetials from '@/components/Shelter/shelter_Myshelter_GridEventViewdetailsModal.vue';

// view detials on grid images
const selectedPostViewDetailsId = ref(null);
const toggleModalViewDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    console.log(id);
};
</script>