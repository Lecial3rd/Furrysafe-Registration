<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios"
import { ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/vue/24/outline";
import { InformationCircleIcon } from '@heroicons/vue/24/solid'
import { MapPinIcon } from '@heroicons/vue/24/outline'

import viewshelterpostdetials from '@/components/Buddy/buddy_Home_ViewdetailsModal.vue';
import viewbuddypostdetials from '@/components/Shelter/shelter_RescueOp_ReportViewdetailsModal.vue';

import viewpostimagepreview from '@/components/Buddy/buddy_Home_ImagePreviewModal.vue';
import default_avatar from '@/assets/images/buddy_default.jpg'

// import previewhover from '@/components/Buddy/buddy_HoverName.vue';
import previewhover from '@/components/Shelter/shelter_HoverName.vue';

const hoveredIndex = ref(null); // Track the hovered item index

// view detials
const selectedPostViewDetailsId = ref(null);

const toggleModalViewDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    const foundPost = posts.value.find(post => post.post_id === selectedPostViewDetailsId.value);

    if (foundPost) {
        selectedPostDetails.value = foundPost
        console.log(selectedPostDetails.value)
    }
};

// view image preview
const selectedPostViewImagePreviewId = ref(null);

const toggleModalViewImagePreview = (id) => {
    selectedPostViewImagePreviewId.value = selectedPostViewImagePreviewId.value === id ? null : id;
    console.log(id);
};

//function 
let selectedPost = ref(null)
let posts = ref([])
let selectedPostDetails = ref([])
async function retrieveReports() {
    try {
        console.log("retrieveReports")
        const response = await axios.post("http://localhost:5000/getereports", {
        });

        if (response.data && response.data.length > 0) {
            posts.value = response.data
        }
        console.log("post value", posts.value)
    }
    catch (err) {
        console.log("error in retrieve reports", err)
    }
}

onMounted(async () => {
    await retrieveReports()
})

</script>

<template>
    <div v-for="post in posts" :key="post.post_id"
        class="md:container sm:w-full md:w-[80%] lg:w-[70%] xl:w-[52rem] h-fit mb-4 mx-auto bg-white py-2 px-4  rounded-xl">
        <div class="px-[.5rem] py-[10px] flex gap-x-2 items-center">
            <div>
                <img :src="post.profile || default_avatar" alt="profile"
                    class="w-10 h-10 flex border bg-white rounded-full object-cover" />
            </div>

            <RouterLink to="" class="font-bold text-base"> <!-- path sa view user profile butang sa to="" -->
                <div @mouseenter="hoveredIndex = post.post_id" @mouseleave="hoveredIndex = null"
                    class="relative inline-block">
                    <span class="hover:underline cursor-pointer">{{ post.posted_by }}</span>
                    <previewhover v-if="hoveredIndex === post.post_id" :_user_id="post.user_id" class="absolute z-10" />
                </div>
            </RouterLink>
            <!-- <span class="text-[11px] border py-1 px-3 font-medium rounded-full bg-gray-50"> {{ post.post_type }}</span> -->
            <span :class="{
                'text-[10px] border py-1 px-3 font-medium rounded-full': true,
                'bg-amber-50 border-amber-300 text-amber-500': post.post_type === 'Missing Report',
                'bg-red-50 border-red-300 text-red-500': post.post_type === 'Stray Report',
                'bg-teal-50 border-teal-300 text-teal-500': post.post_type === 'Adoption',
                'bg-gray-50': post.post_type !== 'Missing Report' && post.post_type !== 'Stray Report' && post.post_type !== 'Adoption',
            }">{{ post.post_type }}</span>
        </div>

        <div class="w-full h-fit rounded-2xl bg-white  flex flex-col items-center relative group">
            <div v-if="post.post_type == 'Adoption'">
                <img @click="toggleModalViewDetails(post.post_id)"
                    class="mx-auto flex-shrink-0 w-[50rem] sm:h-[35rem] md:h-[40rem] rounded-2xl object-cover cursor-pointer"
                    :src="post.photos[0]" alt="image post" />
            </div>
            <div v-else>
                <img @click="toggleModalViewDetails(post.post_id)"
                    class="mx-auto flex-shrink-0 w-[50rem] sm:h-[35rem] md:h-[40rem] rounded-2xl object-cover cursor-pointer"
                    :src="post.photos[0]" alt="image post" />
            </div>

            <!-- Image Preview -->
            <viewpostimagepreview v-if="selectedPostViewImagePreviewId === post.post_id"
                @close="toggleModalViewImagePreview(post.post_id)" />
            <!-- view details button -->
            <div class="absolute bg-gray-900 bg-opacity-30 rounded-b-xl w-full bottom-0 hidden group-hover:block">

                <div class="flex justify-end p-2">
                    <button @click="toggleModalViewDetails(post.post_id)" class="relative right-0">
                        <InformationCircleIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-100 hover:text-white" />
                    </button>
                    <div v-if="post.post_type == 'Adoption'">
                        <viewshelterpostdetials v-if="selectedPostViewDetailsId === post.post_id"
                            :selectedPostDetails="selectedPostDetails" @close="toggleModalViewDetails(post.post_id)" />
                    </div>
                    <div v-else>
                        <viewbuddypostdetials v-if="selectedPostViewDetailsId === post.post_id"
                            :selectedPostDetails="selectedPostDetails" @close="toggleModalViewDetails(post.post_id)" />
                    </div>
                </div>
            </div>
        </div>

        <div class="p-2 px-3">
            <div class="flex items-center gap-x-4">
                <RouterLink to="" title="Chat with Us" class="flex items-center gap-x-2 relative group">
                    <ChatBubbleLeftRightIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-900" />
                    <span class="font-bold text-sm hidden group-hover:flex">
                        Message
                    </span>
                </RouterLink>

                <div v-if="post.post_type == 'Adoption'">
                    <RouterLink to="" title="Pet Profile" class="flex items-center gap-x-2 relative group">
                        <UserCircleIcon class="sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-gray-900" />
                        <span class="font-bold text-sm hidden group-hover:flex">
                            View Pet Profile
                        </span>
                    </RouterLink>
                </div>
            </div>
        </div>

        <div class="px-[.5rem] py-[.5rem] flex flex-col gap-y-2 items-start bg-gray-100 bg-opacity-0 border-t">
            <div class="py-2">
                <p v-if="post.post_type != 'Adoption'">
                    <i class="text-xs font-semibold grid grid-cols-[20px_1fr] gap-x-1 items-start mb-2">
                        <MapPinIcon class="sm:h-5 sm:w-5 md:h-4 md:w-4 text-gray-700" />
                        <p>{{ post.report_address_location }}</p>
                    </i>
                </p>
                <div class="sm:text-sm md:text-base font-medium text-gray-700">
                    <b class="pr-2">{{ post.posted_by }}</b>
                    {{ post.content }}
                </div>

            </div>
        </div>
    </div>
</template>
