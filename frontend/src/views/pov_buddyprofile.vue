<script setup>
import { ref, onMounted } from 'vue';
import { PencilIcon, UserIcon, Square2StackIcon, DocumentPlusIcon } from "@heroicons/vue/20/solid";
import axios from 'axios';
import Linkfooter from '@/components/footerLink.vue'
import viewpostdetials from '@/components/Buddy/buddy_Profile_GridReportViewdetailsModal.vue';
import default_avatar from '@/assets/images/buddy_default.jpg'
import { useRoute } from 'vue-router';
// joey added
import CreateReportModal from '@/components/Buddy/buddy_CreateReportPost_Modal.vue'
const openCreateModal = ref(false) // for create report modal

import viewprofiledetials from '@/components/Buddy/buddy_Profile_GridProfileViewdetailsModal.vue'; // for view profile details
// view detials on grid profile images
const selectedProfileViewDetailsId = ref(null);
const toggleModalProfileViewDetails = (id) => {
    selectedProfileViewDetailsId.value = selectedProfileViewDetailsId.value === id ? null : id;
    console.log(id);
};
// end


const props = defineProps({
    buddyId: {
        type: String,
        required: true,  // Make sure the ID is passed
    }
});
const route = useRoute(); // Get the current route object
const buddyId = route.query.buddyId;

const _id = buddyId;

// view detials on grid images
const selectedPostViewDetailsId = ref(null);
const selectedPostDetails = ref([])
const selectedTab = ref('Report'); // Default selected tab
const user = ref({})


onMounted(() => { //pag load sa page mag load ni =)
    getUserDetails()
    getBuddyPost()
})

const selectTab = (tab) => {
    selectedTab.value = tab; // Update the selected tab
};
const toggleModalViewDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    const foundPost = buddyPosts.value.find(post => post.post_id === selectedPostViewDetailsId.value);

    if (foundPost) {
        selectedPostDetails.value = foundPost
        console.log(selectedPostDetails.value)
    }
};

async function getUserDetails() {
    try {
        const response = await axios.post("http://localhost:5000/getbuddydetails",
            {
                _id: _id
            }
        )
        if (response.data.success) {
            console.log(response.data.data)
            user.value = response.data.data[0]
            console.log("user avatar", user.value) // Check to confirm values are set
        }
    }
    catch (err) {
        console.log("error", err)
    }
}

const buddyPosts = ref([])
async function getBuddyPost() {
    try {
        console.log("id", _id)
        const response = await axios.post("http://localhost:5000/getbuddypost",
            {
                _id: _id
            }
        )
        if (response.data.success) {
            buddyPosts.value = response.data.data;
            console.log("buddyPosts data:??", buddyPosts.value);  // Log the data here
        }
    }
    catch (err) {
        console.log("error", err)
    }
}
</script>
<template>
    <div class="my-4">
        <!-- <p>Buddy ID: {{ buddyId }}</p> -->
        <main class="flex-1">
            <div class="bg-white p-6">
                <div class="flex sm:flex-col md:flex-row justify-between gap-y-4 items-center mb-6 px-8">
                    <div class="flex sm:flex-col md:flex-row items-center gap-y-3 gap-x-3">
                        <img :src="user.user_profile_url || default_avatar" alt=""
                            class="rounded-full border-2 w-32 h-32 object-cover" />
                        <div>
                            <h2 class="text-2xl font-bold">{{ user.firstname + ' ' + user.lastname }}</h2>
                            <div
                                class="flex sm:justify-center md:justify-start items-center gap-x-2 text-gray-600 text-sm">
                                <UserIcon class="h-4 w-4 text-gray-500" />
                                <span class="font-medium">{{ user.gender }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p class="text-gray-600 mb-4 mx-8">
                    {{ user.bio }}
                </p>


                <div class="border-b mb-6 sm:mx-0 md:mx-8 text-sm">
                    <div class="flex space-x-4 text-lg">
                        <button @click="selectTab('Report')" class="px-4 py-2"
                            :class="{ 'text-gray-900 border-b-2 border-gray-900': selectedTab === 'Report' }">Report</button>
                        <button @click="selectTab('Profile')" class="px-4 py-2"
                            :class="{ 'text-gray-900 border-b-2 border-gray-900': selectedTab === 'Profile' }">Pet
                            Profile</button>
                        <button @click="selectTab('Badge')" class="px-4 py-2"
                            :class="{ 'text-gray-900 border-b-2 border-gray-900': selectedTab === 'Badge' }">Badge</button>
                    </div>
                </div>

                <div v-if="selectedTab === 'Report'" class="sm:mx-0 md:mx-8">
                    <!-- grid images of buddy post -->
                    <div v-if="buddyPosts && buddyPosts.length > 0" class="xl:container sm:mx-0 2xl:mx-auto">
                        <ul role="list"
                            class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            <li v-for="post in buddyPosts" :key="post.post_id" class="relative">
                                <button @click="toggleModalViewDetails(post.post_id)"
                                    class="group block w-full overflow-hidden bg-white">
                                    <!-- Display the first image in the photos array or a placeholder if no image exists -->
                                    <img :src="Array.isArray(post.photos) && post.photos.length > 0 ? post.photos[0] : 'placeholder.jpg'"
                                        alt="Post image"
                                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                                    <!-- Display overlay icon if there are multiple images -->
                                    <Square2StackIcon v-if="Array.isArray(post.photos) && post.photos.length > 1"
                                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                                </button>
                                <viewpostdetials v-if="selectedPostViewDetailsId === post.post_id"
                                    :selectedPostDetails="selectedPostDetails" :mode="'pov'"
                                    @close="toggleModalViewDetails(post.post_id)" />
                            </li>
                        </ul>
                    </div>

                    <div v-else
                        class="flex flex-col place-items-center text-gray-500 mx-8 gap-y-1 sm:my-[5rem] lg:my-[8.5rem]">
                        <img width="100" height="100"
                            src="https://img.icons8.com/external-becris-lineal-becris/100/737373/external-pet-hotel-service-becris-lineal-becris.png"
                            alt="external-pet-hotel-service-becris-lineal-becris" />
                        <h1 class="sm:text-xl lg:text-2xl font-extrabold">{{ user.firstname }} Pet Reports</h1>
                        <p class="text-sm font-medium flex text-center">
                            When {{ user.firstname }} create a Reports about Strays or their Missing pets, they'll
                            appear here.</p>
                    </div>
                    <div>
                        <linkfooter />
                    </div>
                </div>

                <div v-if="selectedTab === 'Profile'" class="sm:mx-0 md:mx-8">
                    <div v-if="petprofiles && petprofiles.length > 0">
                        <div class="flex justify-between items-center mb-4">
                            <h1 class="font-semibold sm:text-base md:text-lg">{{ user.firstname }} Pet Profile's</h1>
                        </div>
                        <!-- pet profile grid -->
                        <div class="xl:container sm:mx-0 2xl:mx-auto">
                            <ul role="list"
                                class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                <li v-for="Profile in petprofiles" :key="Profile.id" class="relative">
                                    <button @click="toggleModalProfileViewDetails(Profile.id)"
                                        class="group block w-full overflow-hidden bg-white">
                                        <!-- Display the first image in the array or the single image if it's not an array -->
                                        <img :src="Array.isArray(Profile.imageUrl) ? Profile.imageUrl[0] : Profile.imageUrl"
                                            alt=""
                                            class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                                        <!-- Display the overlay icon if there are multiple images -->
                                        <Square2StackIcon
                                            v-if="Array.isArray(Profile.imageUrl) && Profile.imageUrl.length > 1"
                                            class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                                    </button>
                                    <viewprofiledetials v-if="selectedProfileViewDetailsId === Profile.id"
                                        @close="toggleModalProfileViewDetails(Profile.id)" />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div v-else
                        class="flex flex-col place-items-center text-gray-500 mx-8 gap-y-1 sm:my-[5rem] lg:my-[8.5rem]">
                        <img width="100" height="100"
                            src="https://img.icons8.com/external-photo3ideastudio-lineal-photo3ideastudio/100/737373/external-pawprint-pet-shop-photo3ideastudio-lineal-photo3ideastudio.png"
                            alt="external-pawprint-pet-shop-photo3ideastudio-lineal-photo3ideastudio" />
                        <h1 class="sm:text-xl lg:text-2xl font-extrabold">{{ user.firstname }} Pet's Profile</h1>
                        <p class="text-sm font-medium flex text-center">When {{ user.firstname }} create a pet profiles,
                            they'll
                            appear here.</p>
                    </div>
                    <div>
                        <linkfooter />
                    </div>
                </div>
                <div v-if="selectedTab === 'Badge'" class="sm:mx-0 md:mx-8">
                    <!-- Content for Badge -->
                </div>
                <div v-if="selectedTab === 'achievements'">
                    <!-- Content for Achievements -->
                </div>
            </div>
        </main>
    </div>
</template>
