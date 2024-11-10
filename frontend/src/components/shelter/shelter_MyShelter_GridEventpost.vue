<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios"
import { Square2StackIcon } from '@heroicons/vue/20/solid'

import popupNewEvent from '@/components/Shelter/shelter_EventPostModal.vue'
const showModalCreateEvent = ref(false)

const EventImages = [
    {
        id: 1,
        imageUrl: [require('@/assets/images/bals.png'), require('@/assets/images/eric.png'), require('@/assets/images/eric.png')]
    },
];


import vieweventdetials from '@/components/Shelter/shelter_Myshelter_GridEventViewdetailsModal.vue';

// view detials on grid images
const selectedEventViewDetailsId = ref(null);
const toggleModalViewDetails = (id) => {
    selectedEventViewDetailsId.value = selectedEventViewDetailsId.value === id ? null : id;
    console.log(id);
};

//functions 
let _user_id = localStorage.getItem('u_id')
let _shelter_id = localStorage.getItem('c_id')
let events = ref([])
let photos = ref([])
async function retrieveReports() {
    try {
        const response = await axios.post("http://localhost:5000/getevents", {
            _shelter_id: _shelter_id
        });

        if (response.data && response.data.length > 0) {
            events.value = response.data
            photos.value = response.data.photo_urls
        }
    }
    catch (err) {
        console.log("error in retrieve events", err)
    }
}

function getFirstPhoto(photo_display_url) {
    try {
        // Double parse to handle stringified JSON
        console.log("photo_display_url", photo_display_url)
        // const photos = JSON.parse(JSON.parse(`"${photo_display_url}"`));
        return Array.isArray(photo_display_url) && photo_display_url.length > 0
            ? photo_display_url[0]
            : null;
    } catch (e) {
        console.error("Error parsing photos:", e);
        return null;
    }
}

function hasMultiplePhotos(photo_display_url) {
    try {
        // // Double parse to handle stringified JSON
        // const photos = JSON.parse(JSON.parse(`"${photo_display_url}"`));
        // return Array.isArray(photos) && photos.length > 1;
        return Array.isArray(photo_display_url) && photo_display_url.length > 1
    } catch (e) {
        console.error("Error parsing photos:", e);
        return false;
    }
}

onMounted(async () => {
    await retrieveReports()
})

</script>
<template>
    <!-- <div v-if="EventImages && EventImages.length > 0" class="xl:container mx-auto my-2">
        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
            <li v-for="post in EventImages" :key="post.id" class="relative">
                <button @click="toggleModalViewDetails(post.id)" class="group block w-full overflow-hidden bg-white">
                     Display the first image in the array or the single image if it's not an array
                    <img :src="Array.isArray(post.imageUrl) ? post.imageUrl[0] : post.imageUrl" alt=""
                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                     Display the overlay icon if there are multiple images
                    <Square2StackIcon v-if="Array.isArray(post.imageUrl) && post.imageUrl.length > 1"
                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                </button>
                <vieweventdetials v-if="selectedEventViewDetailsId === post.id"
                    @close="toggleModalViewDetails(post.id)" />
            </li>
        </ul>
    </div> -->
    <div v-if="events && events.length > 0" class="xl:container mx-auto my-2">
        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
            <li v-for="event in events" :key="event.event_id" class="relative">
                <button @click="toggleModalViewDetails(event.event_id)"
                    class="group block w-full overflow-hidden bg-white">
                    <!-- Display the overlay icon if there are multiple images -->
                    <Square2StackIcon v-if="hasMultiplePhotos(event.photo_urls)"
                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                    <!-- Display the image (single or first in array) -->
                    <img :src="getFirstPhoto(event.photo_urls)" alt="Event image"
                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />
                </button>
                <vieweventdetials v-if="selectedEventViewDetailsId === event.event_id"
                    @close="toggleModalViewDetails(event.event_id)" />
            </li>
        </ul>
    </div>
    <div v-else class="flex flex-col place-items-center text-gray-500 mx-8 gap-y-1 sm:my-[5rem] lg:my-[8.5rem]">
        <img width="100" height="100"
            src="https://img.icons8.com/external-becris-lineal-becris/100/737373/external-pet-hotel-service-becris-lineal-becris.png"
            alt="external-pet-hotel-service-becris-lineal-becris" />
        <h1 class="sm:text-xl lg:text-2xl font-extrabold">Your Shelter Posts</h1>
        <p class="text-sm font-medium flex text-center">When you create a post related to the shelter, they'll appear
            here.</p>
        <button @click="showModalCreateEvent = true" type="button"
            class="underline underline-offset-4 hover:text-amber-600">Post your first Event.</button>
        <popupNewEvent v-if="showModalCreateEvent" @close="showModalCreateEvent = false" />
    </div>
</template>