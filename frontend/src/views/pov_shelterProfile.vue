<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";
import { SparklesIcon, RectangleStackIcon } from '@heroicons/vue/24/outline'

import vieweventdetials from '@/components/Shelter/shelter_Myshelter_GridEventViewdetailsModal.vue';
// view detials on grid images
const selectedEventViewDetailsId = ref(null);

const selectedEventViewDetails = ref(null); // Nov12

const toggleModalEventViewDetails = (id) => {
    // Nov12
    selectedEventViewDetailsId.value = selectedEventViewDetailsId.value === id ? null : id;
    const foundevent = events.value.find(event => event.event_id === selectedEventViewDetailsId.value);

    if (foundevent) {
        selectedEventViewDetails.value = foundevent
        console.log("found post in event shelter", selectedEventViewDetailsId.value)
    }
};


import viewpostdetials from '@/components/Shelter/shelter_Myshelter_GridPostViewdetailsModal.vue';
/// view detials on grid post images
const selectedPostViewDetailsId = ref(null);
let selectedPostDetails = ref([])

const toggleModalViewPostDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    const foundPost = posts.value.find(post => post.post_id === selectedPostViewDetailsId.value);

    if (foundPost) {
        selectedPostDetails.value = foundPost
        console.log("found post in posts shelter", selectedPostDetails.value)
    }
};

import linkfooter from '@/components/footerLink.vue'; // footer

// const shelterId = ref(null);
const props = defineProps({
    shelterId: {
        type: Number,
        required: true,  // Make sure the ID is passed
    },
    shelterUserID: {
        type: Number,
        required: true,
    }
});
const route = useRoute(); // Get the current route object
const shelterId = route.query.shelterId;  // Access the shelterId from the route parameters (geh kuha sa HoverName)
const shelterUserID = route.query.shelterUserID; // for post kasi user_id gah base

console.log('View Profile of ShelterID:', shelterId);
console.log('View Profile of UserID???:', shelterUserID);

const id = shelterId;
const userId = shelterUserID; // for post kasi user_id gah base

const profiles = ref([]); // Holds shelter and email data
const profileUrl = ref(null); // Holds the image URL
// const userid = ref(null)

// profile
async function loadProfileCard() {
    try {
        const response = await axios.post("http://localhost:5000/edit_shelterprofile", {
            shelterid: id
        });

        if (response.data && response.data.length > 0) {
            response.data.forEach(item => {
                profiles.value.push({
                    shelter: item.shelter,
                    email: item.email,
                    profileurl: item.profile
                });
            });

            profileUrl.value = profiles.value[0]?.profileurl;
            console.log("profile url", profileUrl.value)
        } else {
            console.error("No profile data received:", response);
        }
    } catch (err) {
        console.error("An error occurred getting shelter details:", err);
    }
}


// details
const bio = ref([])
const sociallink = ref([])
const details = ref([])


async function loadProfileDetails() {
    //const id = localStorage.getItem('c_id');

    try {
        const response = await axios.post("http://localhost:5000/edit_shelterprofile", {
            shelterid: id
        });

        // Assuming response.data is an array and you need the first item
        const data = response.data[0];
        console.log(data);

        // Update bio
        bio.value = [
            {
                info: data.bio || 'No bio available.'
            }
        ];

        // Update social links
        sociallink.value = [
            {
                link: data.link || 'No social link available.'
            },
        ];

        // Update details
        details.value = [
            {
                icon: MapPinIcon,
                label: data.address || 'No address available.',
            },
            {
                icon: PhoneIcon,
                label: data.contact ? data.contact.toString() : 'No contact available.',
            },
            {
                icon: EnvelopeIcon,
                label: data.email || 'No email available.',
            },
        ];

    } catch (err) {
        console.error("Error loading profile details:", err);
        // Optionally, you can set default or error messages in your reactive variables here
    }
}


// gridpost
let _user_id = userId;
let posts = ref([])
async function retrieveReports() {
    try {
        const response = await axios.post("http://localhost:5000/getereports", {
            _user_id
        });

        if (response.data && response.data.length > 0) {
            posts.value = response.data
        }
        console.log("post value", posts.value)
        console.log("posts photos", posts.value[0].photos)

    }
    catch (err) {
        console.log("error in retrieve reports", err)
    }
}

function posthasMultiplePhotos(photo_display_url) {
    try {
        return Array.isArray(photo_display_url) && photo_display_url.length > 1
    } catch (e) {
        console.error("Error parsing photos:", e);
        return false;
    }
}

// grid event
let events = ref([])
let photos = ref([])
async function retrieveEvents() {
    try {
        const response = await axios.post("http://localhost:5000/getevents", {
            _shelter_id: id
        });

        if (response.data && response.data.length > 0) {
            events.value = response.data
            photos.value = response.data.photo_urls

            console.log("events", events.value) // Nov12
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

function eventhasMultiplePhotos(photo_display_url) {
    try {
        return Array.isArray(photo_display_url) && photo_display_url.length > 1
    } catch (e) {
        console.error("Error parsing photos:", e);
        return false;
    }
}


onMounted(async () => {
    loadProfileCard();
    console.log("shelter",id)
    loadProfileDetails();
    await retrieveReports()
    await retrieveEvents()
})

// tab grid display
const tabs = ref([
    { name: 'Posts', icon: RectangleStackIcon, current: true },
    { name: 'Events', icon: SparklesIcon, current: false },
])

const currentTab = ref(tabs.value[0].name)

const updateCurrentTab = (tabName) => {
    currentTab.value = tabName
    tabs.value.forEach((tab) => {
        tab.current = tab.name === tabName
    })
}
</script>

<template>
    <div class="aspect-auto">
        <!-- user profile details -->
        <!-- <p>Shelter ID: {{ shelterId }}</p> -->
        <main class="h-screen" v-for="(profile, index) in profiles" :key="index">
            <div>
                <div class="lg:container mx-auto py-8 rounded-xl flex flex-col items-center gap-2 md:w-fit">

                    <!-- user detail in large screen -->
                    <div class="flex gap-x-6 mx-8 items-center">
                        <!-- user profile image -->
                        <div>
                            <img class="sm:h-40 sm:w-40 xl:h-52 xl:w-52 rounded-full border-2 object-cover"
                                :src="profileUrl" alt="profile image " />
                        </div>

                        <div class="sm:hidden md:flex flex-col w-[30rem] gap-y-4">
                            <div class="flex text-left items-center">
                                <h1 class="text-2xl font-bold">{{ profile.shelter }}</h1>
                            </div>

                            <!-- user details -->
                            <div>
                                <ul role="list">
                                    <li v-for="item in details" :key="item.id"
                                        class="py-1 grid grid-cols-[20px_1fr] gap-x-4">
                                        <component :is="item.icon" class="w-5 h-5 text-gray-500" />
                                        <span class="break-words text-sm">{{ item.label }}</span>
                                    </li>
                                    <!-- social links -->
                                    <li v-for="item in sociallink" :key="item.link"
                                        class="py-1 grid grid-cols-[20px_1fr] gap-2">
                                        <LinkIcon class="w-5 h-5 text-gray-500" />
                                        <a v-if="item.link" :href="item.link" target=_blank
                                            class="cursor-pointer break-words">{{
                                                item.link }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- user detail & edit button in small screen -->
                    <div class="sm:flex flex-col place-items-center gap-y-4 md:hidden">
                        <h1 class="text-xl font-bold">{{ profile.shelter }}</h1>
                    </div>

                    <!-- about/bio in large screen -->
                    <div
                        class="container mx-auto px-8 py-4 text-sm sm:hidden md:flex flex-col gap-y-2 sm:w-full xl:w-[50rem]">
                        <span class="text-gray-600 font-semibold ">About Shelter</span>
                        <ul v-for="item in bio" :key="item.id">
                            <span class="break-words">{{ item.info }}</span>
                        </ul>
                    </div>
                </div>

                <!-- user details in small screen -->
                <div class="sm:visible md:hidden bg-white px-10 p-2 rounded-xl text-sm">
                    <div class="mb-[1rem]">
                        <span class="text-gray-600 font-semibold">About Shelter</span>
                        <ul v-for="item in bio" :key="item.id">
                            <span class="break-words">{{ item.info }}</span>
                        </ul>
                    </div>
                    <ul role="list">
                        <li v-for="item in details" :key="item.id" class="py-1 grid grid-cols-[20px_1fr] gap-x-4">
                            <component :is="item.icon" class="w-5 h-5 text-gray-500" />
                            <span class="break-words text-sm">{{ item.label }}</span>
                        </li>
                        <!-- social links -->
                        <li v-for="item in sociallink" :key="item.link" class="py-1 grid grid-cols-[20px_1fr] gap-2">
                            <LinkIcon class="w-5 h-5 text-gray-500" />
                            <a v-if="item.link" :href="item.link" target=_blank class="cursor-pointer break-words">
                                {{ item.link }}</a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- grid post and events diplay -->
            <div class="flex flex-col sm:mx-0 xl:mx-[5rem] sm:mt-4 md:mt-0">
                <div class="hidden sm:block">
                    <div class="border-y border-gray-200">
                        <nav class="-mb-px flex justify-center" aria-label="Tabs">
                            <button v-for="tab in tabs" :key="tab.name"
                                :class="[tab.current ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', ' w-fit border-b-2 py-4 px-6 text-center text-sm font-medium flex items-center gap-x-2']"
                                :aria-current="tab.current ? 'page' : undefined" @click="updateCurrentTab(tab.name)">
                                <component :is="tab.icon" class="w-6 h-6 text-gray-500" />
                                <span class="break-words text-sm">{{ tab.name }}</span>
                            </button>
                        </nav>
                    </div>
                </div>
                <div v-show="currentTab === 'Posts'" class="h-auto">
                    <div v-if="posts && posts.length > 0" class="xl:container mx-auto my-2">
                        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
                            <li v-for="post in posts" :key="post.post_id" class="relative">
                                <button @click="toggleModalViewPostDetails(post.post_id)"
                                    class="group block w-full overflow-hidden bg-white">
                                    <!-- Display the image (single or first in array) -->
                                    <img :src="Array.isArray(post.photos) ? post.photos[0] : post.photos"
                                        alt="Post image"
                                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                                    <!-- Display the overlay icon if there are multiple images -->
                                    <Square2StackIcon v-if="posthasMultiplePhotos(post.photos)"
                                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                                </button>
                                <viewpostdetials v-if="selectedPostViewDetailsId === post.post_id"
                                    :selectedPostDetails="selectedPostDetails" :mode="'pov'"
                                    @close="toggleModalViewPostDetails(post.post_id)" />
                            </li>
                        </ul>
                    </div>
                    <div v-else
                        class="flex flex-col place-items-center text-gray-500 mx-8 gap-y-1 sm:my-[5rem] lg:my-[8.5rem]">
                        <img width="100" height="100"
                            src="https://img.icons8.com/external-outline-geotatah/100/737373/external-pet-pet-lover-society-outline-geotatah-5.png"
                            alt="external-pet-pet-lover-society-outline-geotatah-5" />
                        <h1 class="sm:text-xl lg:text-2xl font-extrabold">{{ profile.shelter }}'s Posts</h1>
                        <p class="text-sm font-medium flex text-center">
                            When {{ profile.shelter }}'s create a post related to the shelter, they'll appear here.</p>
                    </div>
                </div>
                <div v-show="currentTab === 'Events'" class="h-auto">
                    <div v-if="events && events.length > 0" class="xl:container mx-auto my-2">
                        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
                            <li v-for="event in events" :key="event.event_id" class="relative">
                                <button @click="toggleModalEventViewDetails(event.event_id)"
                                    class="group block w-full overflow-hidden bg-white">
                                    <!-- Display the overlay icon if there are multiple images -->
                                    <Square2StackIcon v-if="eventhasMultiplePhotos(event.photo_urls)"
                                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                                    <!-- Display the image (single or first in array) -->
                                    <img :src="getFirstPhoto(event.photo_urls)" alt="Event image"
                                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />
                                </button>
                                <vieweventdetials v-if="selectedEventViewDetailsId === event.event_id"
                                    :selectedPetDetails="selectedEventViewDetails"
                                    @close="toggleModalEventViewDetails(event.event_id)" :mode="pov" />
                            </li>
                        </ul>
                    </div>
                    <div v-else
                        class="flex flex-col place-items-center text-gray-500 mx-8 gap-y-1 sm:my-[5rem] lg:my-[8.5rem]">
                        <img width="100" height="100"
                            src="https://img.icons8.com/external-becris-lineal-becris/100/737373/external-pet-hotel-service-becris-lineal-becris.png"
                            alt="external-pet-hotel-service-becris-lineal-becris" />
                        <h1 class="sm:text-xl lg:text-2xl font-extrabold">{{ profile.shelter }}'s Event Posts</h1>
                        <p class="text-sm font-medium flex text-center">
                            When {{ profile.shelter }}'s create an Event post related to the shelter, they'll appear
                            here.</p>
                    </div>
                </div>
            </div>
        </main>
        <footer class="mt-auto">
            <div>
                <linkfooter />
            </div>
        </footer>
    </div>
</template>
