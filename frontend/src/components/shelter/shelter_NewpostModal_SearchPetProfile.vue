<template>
    <Combobox as="div" v-model="selectedPet">
        <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">
            Select Animal Profile
        </ComboboxLabel>
        <div class="relative mt-2">
            <!-- <ComboboxInput
                class="w-full rounded-md border-0 bg-white py-1.5 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                @input="handleInputChange" :display-value="(pet) => pet?.name" placeholder="Search Pet Profile" /> -->
            <ComboboxInput
                class="w-full rounded-md border-0 bg-white py-1.5 px-4 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                @input="handleInputChange" :display-value="(pet) => pet?.name"
                :placeholder="noPetsFound ? 'Pet profile didn\'t exist...' : 'Search Pet Profile'"
                :class="{ 'placeholder-red-500': noPetsFound }" />

            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>

            <ComboboxOptions v-if="filteredPets.length > 0"
                class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ComboboxOption v-for="pet in filteredPets" :key="pet.id" :value="pet" as="template"
                    v-slot="{ active, selected }">
                    <li
                        :class="['relative cursor-default select-none py-2 pl-3 pr-9', active ? 'bg-teal-600 text-white' : 'text-gray-900']">
                        <div class="flex items-center">
                            <img :src="pet.profile" alt="" class="h-10 w-10 flex-shrink-0 object-cover rounded-full" />
                            <span :class="['ml-3 truncate text-base', selected && 'font-semibold']">
                                {{ pet.name }}
                            </span>
                        </div>

                        <span v-if="selected"
                            :class="['absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-teal-600']">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                    </li>
                </ComboboxOption>
            </ComboboxOptions>
        </div>
    </Combobox>

</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { defineEmits } from 'vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxLabel, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import axios from 'axios'

const emit = defineEmits(['petSelected'])

const id = localStorage.getItem('u_id')  // Assuming user ID is stored in localStorage
const pets = ref([])  // Array to store pet profiles
const selectedPet = ref(null)  // To bind selected pet
const query = ref('')  // Search query input by user

// Capitalize the first letter of each word in a string (for pet names)
const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, char => char.toUpperCase())
}

// Fetch pet profiles from the API
// Check and log the fetched pet data
async function retrievePets() {
    try {
        const response = await axios.post("http://localhost:5000/profile", {
            _userid: id,
        })

        if (response.data && response.data.length > 0) {
            pets.value = response.data.map(profile => {
                const [name, nickname] = profile.name_nickname.split('/')
                return {
                    id: profile.id,
                    name: capitalizeWords(name.trim()),
                    nickname: capitalizeWords(nickname.trim()),
                    breed: profile.breed,
                    rehomed: profile.date_rehomed,
                    profile: profile.profileurl,
                }
            })
        }
    } catch (err) {
        console.error("Error fetching pet profiles", err)
    }
}


// Compute filtered pets based on search query
const filteredPets = computed(() => {
    return query.value === ''
        ? pets.value
        : pets.value.filter(pet => pet.name.toLowerCase().includes(query.value.toLowerCase()))
})

// Computed property to check if no pets were found
const noPetsFound = computed(() => {
    return filteredPets.value.length === 0 && query.value !== ''
})

// Watch for changes in selected pet, and emit the selected pet to the parent component
watch(selectedPet, (newPet) => {
    if (newPet && newPet.id) {  // Check if 'newPet' exists and has an 'id'
        emit('petSelected', newPet)  // Emit the selected pet object
    } else {
        console.warn('Selected pet is invalid:', newPet)
    }
})

// Handle input change and update query value
function handleInputChange(event) {
    query.value = event.target.value
    console.log("selectedPet value:", selectedPet.value);
}

onMounted(() => {
    retrievePets()  // Fetch pet profiles when the component is mounted
})
</script>
