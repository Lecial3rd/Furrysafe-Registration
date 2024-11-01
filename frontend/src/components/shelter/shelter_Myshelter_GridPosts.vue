<template>
    <div>
        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
            <li v-for="file in postImages" :key="file.id" class="relative">
                <button class="group block w-full overflow-hidden bg-white">
                    <!-- Display the first image in the array or the single image if it's not an array -->
                    <img :src="Array.isArray(file.imageUrl) ? file.imageUrl[0] : file.imageUrl" alt=""
                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                    <!-- Display the overlay icon if there are multiple images -->
                    <Square2StackIcon v-if="Array.isArray(file.imageUrl) && file.imageUrl.length > 1"
                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { Square2StackIcon } from '@heroicons/vue/20/solid'

const postImages = [
    {
        id: 1,
        imageUrl: [require('@/assets/images/eric.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
    {
        id: 2,
        imageUrl: require('@/assets/images/charles.png')
    },
    {
        id: 3,
        imageUrl: [require('@/assets/images/bals.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
];
</script>