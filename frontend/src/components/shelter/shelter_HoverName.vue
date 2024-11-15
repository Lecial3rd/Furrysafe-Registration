<script setup>
import { ref, onMounted, computed } from 'vue';
import { MapPinIcon, UserIcon, EyeIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/vue/20/solid";
import axios from "axios"
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();

const viewreportpost = ref({
    id: 1,
    name: "Eric",
    lastname: "Ramones",
    badge: "buddy",
    about: "Im airix jr sheshhh",
    location: "#506 Lim Building J.P. Laurel Avenue, Corner Acacia, Davao City, Philippines",
    profile: require("@/assets/images/eric.png"),
});

const props = defineProps({
    _user_id: {
        type: Number,
        require: true
    }
});

//function 
let _user_id = ref(null)

let userdetails = ref([])
const id = ref(null)
const userType = ref(null)

async function getUserDetailsOnHover() {
    console.log("on hover")
    try {
        const response = await axios.post("http://localhost:5000/getusedetails", {
            _id: _user_id.value
        });

        if (response.data.success && response.data.data.length > 0) {
            userdetails.value = response.data.data;
            // const userId = userdetails.value[0].id;

            // Extract and convert the userId to a number
            const userId = Number(userdetails.value[0].id);  // Convert the userId to a number
            id.value = userId;

            const typeOfUser = userdetails.value[0].user_type;
            userType.value = typeOfUser;
        }
    }
    catch (err) {
        console.log("error in retrieve reports", err)
    }
}

onMounted(async () => {
    _user_id.value = props._user_id
    console.log(_user_id.value)
    await getUserDetailsOnHover()
    console.log("what user:", userType)
})
</script>
<template>
    <div class="border rounded-lg py-4 bg-white shadow-sm sm:w-[20rem] md:w-[25rem] xl:w-[37rem]">
        <div v-if="userdetails[0]" class="px-[2rem] py-[10px] xl:flex gap-x-4 text-gray-600 mb-2">
            <div class="flex justify-center">
                <img class="flex-shrink-0 sm:w-44 sm:h-44 xl:w-72 xl:h-72 rounded-full object-cover"
                    :src="userdetails[0].profile_url" alt="image post" />
            </div>
            <div class="flex flex-col gap-y-1 my-auto">
                <div class="flex flex-col sm:place-items-center xl:place-items-start">
                    <div>
                        <h1 class="sm:mt-4 sm:text-base xl:text-lg font-bold">
                            {{ userdetails[0].name }}
                        </h1>
                    </div>
                </div>
                <div class="grid grid-cols-[20px_1fr] gap-2">
                    <UserIcon class="h-5 w-5 text-gray-500" />
                    <p class="sm:text-[12px] xl:text-sm">{{ userdetails[0].bio }}</p>
                </div>
            </div>
        </div>
        <div class="flex justify-evenly items-center text-sm font-semibold">
            <!-- shelter profile -->
            <!-- <RouterLink v-if="id" :to="{
                name: 'pov_viewshelterprofile_shelter',
                query: { shelterId: id }
            }"
                class="flex gap-x-2 border rounded-lg bg-gray-50 hover:bg-gray-200 group hover:animate-pulse sm:px-4 md:px-8 xl:px-20 py-2 items-center">
                <EyeIcon class="h-6 w-6 text-gray-300 group-hover:text-gray-700" />
                <span class="text-gray-500 group-hover:text-gray-700">View Profile</span>
            </RouterLink> -->

            <!-- buddy profile -->
            <!-- <RouterLink v-if="_user_id" :to="{
                name: 'pov_viewbuddyprofile_shelter',
                query: { buddyId: _user_id }
            }"
                class="flex gap-x-2 border rounded-lg bg-gray-50 hover:bg-gray-200 group hover:animate-pulse sm:px-4 md:px-8 xl:px-20 py-2 items-center">
                <EyeIcon class="h-6 w-6 text-gray-300 group-hover:text-gray-700" />
                <span class="text-gray-500 group-hover:text-gray-700">View Profile</span>
            </RouterLink> -->
            <RouterLink :to="userType === 'shelter'
                ? { name: 'pov_viewshelterprofile_shelter', query: { shelterId: id, shelterUserID: _user_id } }
                : { name: 'pov_viewbuddyprofile_shelter', query: { buddyId: _user_id } }"
                class="flex gap-x-2 border rounded-lg bg-gray-50 hover:bg-gray-200 group hover:animate-pulse sm:px-4 md:px-8 xl:px-20 py-2 items-center">
                <EyeIcon class="h-6 w-6 text-gray-300 group-hover:text-gray-700" />
                <span class="text-gray-500 group-hover:text-gray-700">View Profile</span>
            </RouterLink>

            <RouterLink to="/messages"
                class="flex gap-x-3 border rounded-lg bgteal hover:animate-pulse sm:px-4 md:px-8 xl:px-20 py-2 items-center">
                <ChatBubbleLeftEllipsisIcon class="h-6 w-6 text-white" />
                <span class="text-white">Message</span>
            </RouterLink>
        </div>
    </div>
</template>
