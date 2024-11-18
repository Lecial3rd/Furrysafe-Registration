<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from "axios";
import { PencilIcon, PhoneIcon, LinkIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/vue/20/solid'
import { SparklesIcon, RectangleStackIcon } from '@heroicons/vue/24/outline'

import linkfooter from '@/components/footerLink.vue'; // footer

import Toast from '@/components/toast.vue';  // Ensure correct case for the file name
const route = useRoute();
const toastRef = ref(null);  // Ref for the Toast component

onMounted(() => {
    if (route.query.showToast) {
        if (toastRef.value) {
            toastRef.value.showToast(route.query.status, route.query.message);
        }
    }
});


const id = localStorage.getItem('c_id');
const profiles = ref([]); // Holds shelter and email data
const profileUrl = ref(null); // Holds the image URL

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

onMounted(() => {
    loadProfileCard();
    console.log(id)
});


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


onMounted(() => {
    loadProfileDetails();
    console.log(id)
});

import gridPostImages from '@/components/Shelter/shelter_Myshelter_GridPosts.vue'
import gridEventImages from '@/components/Shelter/shelter_MyShelter_GridEventpost.vue' //new added

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
    <div class="aspect-auto mx-8">
        <Toast ref="toastRef" @closed="refreshRoute($router)" /> <!-- prompt message -->
        <!-- user profile details -->
        <main class="h-screen">
            <div>
                <div v-for="(profile, index) in profiles" :key="index"
                    class="lg:container mx-auto py-8 rounded-xl flex flex-col items-center gap-2 md:w-fit">

                    <!-- user detail in large screen -->
                    <div class="flex gap-x-6 mx-8 items-center">
                        <!-- user profile image -->
                        <div>
                            <img class="sm:h-40 sm:w-40 xl:h-52 xl:w-52 rounded-full border-2 object-cover"
                                :src="profileUrl" alt="profile image " />
                        </div>

                        <div class="sm:hidden md:flex flex-col w-[30rem] gap-y-4">
                            <div class="flex justify-between items-center">
                                <!-- username visible on large screen -->
                                <div>
                                    <h1 class="text-2xl font-bold">{{ profile.shelter }}</h1>
                                </div>
                                <!-- edit button -->
                                <div>
                                    <router-link to="/edit_shelterprofile"
                                        class="flex items-center gap-x-2 w-fit py-1.5 px-6 bg-slate-50 border rounded-md hover:bg-lightorange group">
                                        <PencilIcon class="h-4 w-4 text-gray-600 group-hover:text-white"
                                            aria-hidden="true" />
                                        <span class="text-sm font-medium text-gray-600 group-hover:text-white">
                                            Edit Profile</span>
                                    </router-link>
                                </div>
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
                        <router-link to="/edit_shelterprofile"
                            class="flex items-center gap-x-2 w-fit py-1.5 px-6 bg-slate-50 border rounded-md hover:bg-lightorange group">
                            <PencilIcon class="h-4 w-4 text-gray-600 group-hover:text-white" aria-hidden="true" />
                            <span class="text-sm font-medium text-gray-600 group-hover:text-white">
                                Edit Profile</span>
                        </router-link>
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
                    <div class="xl:container mx-auto my-2">
                        <gridPostImages />
                    </div>

                </div>
                <div v-show="currentTab === 'Events'" class="h-auto">
                    <div class="xl:container mx-auto my-2">
                        <gridEventImages/>
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
