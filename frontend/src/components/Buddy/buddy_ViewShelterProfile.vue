<template>
    <div class="aspect-auto">
        <!-- user profile details -->
        <main class="h-screen">
            <div>
                <div class="lg:container mx-auto py-8 rounded-xl flex flex-col items-center gap-2 md:w-fit">

                    <!-- user detail in large screen -->
                    <div class="flex gap-x-6 mx-8 items-center">
                        <!-- user profile image -->
                        <div>
                            <img class="sm:h-40 sm:w-40 xl:h-52 xl:w-52 rounded-full border-2 object-cover"
                                :src="shelterdetails.profile" alt="profile image " />
                        </div>

                        <div class="sm:hidden md:flex flex-col w-[30rem] gap-y-4">
                            <div class="flex justify-between items-center">
                                <!-- username visible on large screen -->
                                <div>
                                    <h1 class="text-2xl font-bold">{{ shelterdetails.use }}</h1>
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

                    <!-- about/bio in large screen -->
                    <div
                        class="container mx-auto px-8 py-4 text-sm sm:hidden md:flex flex-col gap-y-2 sm:w-full xl:w-[50rem]">
                        <span class="text-gray-600 font-semibold ">About Shelter</span>
                        <!-- <ul v-for="item in shelterdetails" :key="item.id"> -->
                        <span class="break-words">{{ shelterdetails.about }}</span>
                        <!-- </ul> -->
                    </div>
                </div>

                <!-- user details in small screen -->
                <div class="sm:visible md:hidden bg-white px-10 p-2 rounded-xl text-sm">
                    <div class="mb-[1rem] flex flex-col">
                        <span class="text-gray-600 font-semibold">About Shelter</span>
                        <!-- <ul v-for="item in shelterdetails" :key="item.id"> -->
                        <span class="break-words">{{ shelterdetails.about }}</span>
                        <!-- </ul> -->
                    </div>
                    <!-- <ul role="list">
                        <li v-for="item in details" :key="item.id" class="py-1 grid grid-cols-[20px_1fr] gap-x-4">
                            <component :is="item.icon" class="w-5 h-5 text-gray-500" />
                            <span class="break-words text-sm">{{ item.label }}</span>
                        </li> -->
                    <!-- social links -->
                    <!-- <li v-for="item in sociallink" :key="item.link" class="py-1 grid grid-cols-[20px_1fr] gap-2">
                            <LinkIcon class="w-5 h-5 text-gray-500" />
                            <a v-if="item.link" :href="item.link" target=_blank class="cursor-pointer break-words">
                                {{ item.link }}</a>
                        </li>
                    </ul> -->
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
                    dsads
                    <div class="xl:container mx-auto my-2">
                        <ul role="list" class="grid grid-cols-3 gap-x-2 gap-y-2 md:grid-cols-3 xl:grid-cols-4">
                            <li v-for="post in postImages" :key="post.id" class="relative">
                                <button @click="toggleModalViewDetails(post.id)"
                                    class="group block w-full overflow-hidden bg-white">
                                    <!-- Display the first image in the array or the single image if it's not an array -->
                                    <img :src="Array.isArray(post.imageUrl) ? post.imageUrl[0] : post.imageUrl" alt=""
                                        class="pointer-events-none aspect-square object-cover group-hover:opacity-75" />

                                    <!-- Display the overlay icon if there are multiple images -->
                                    <Square2StackIcon v-if="Array.isArray(post.imageUrl) && post.imageUrl.length > 1"
                                        class="absolute top-2 right-2 h-5 w-5 text-white group-hover:opacity-75" />
                                </button>

                            </li>
                            <button>view</button>
                        </ul>
                    </div>
                    <viewpostdetials v-if="selectedPostViewDetailsId"
                        @close="toggleModalViewDetails(selectedPostViewDetailsId)" />

                </div>
                <div v-show="currentTab === 'Events'" class="h-auto">
                    <div class="xl:container mx-auto my-2">
                        Events
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
<script setup>
import { onMounted, ref } from 'vue';
// import axios from "axios";
import { PhoneIcon, LinkIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/vue/20/solid'
import { SparklesIcon, RectangleStackIcon } from '@heroicons/vue/24/outline'

import viewpostdetials from '@/components/Buddy/buddy_Profile_GridViewdetailsModal.vue';
import linkfooter from '@/components/footerLink.vue'; // footer

// view detials
const selectedPostViewDetailsId = ref(null);

const toggleModalViewDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    console.log('Selected Post ID:', selectedPostViewDetailsId.value);
};



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

const shelterdetails = {
    id: 1,
    username: "Name sa shelter",
    badge: "buddy",
    about: "Im airix jr sheshhh",
    location: "#506 Lim Building J.P. Laurel Avenue, Corner Acacia, Davao City, Philippines",
    contact: "0943907403",
    profile: require("@/assets/images/eric.png"),
}

// grid images user shelter post
const postImages = ref([
    {
        id: 1,
        imageUrl: [
            require('@/assets/images/eric.png'),
            require('@/assets/images/eric.png'),
            require('@/assets/images/eric.png')
        ]
    },
    {
        id: 2,
        imageUrl: require('@/assets/images/charles.png')
    },
    {
        id: 3,
        imageUrl: [
            require('@/assets/images/bals.png'),
            require('@/assets/images/eric.png'),
            require('@/assets/images/eric.png')
        ]
    }
]);

</script>