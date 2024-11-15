<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-50" @click.self="$emit('close')">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
            </TransitionChild>
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-lg mx-4 bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-fit sm:p-6">

                            <div class="mt-3 text-center sm:mx-4 sm:mt-0 sm:text-left">
                                <div class="flex justify-end">
                                    <button @click="$emit('close')" ref="cancelButtonRef">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <DialogTitle as="h3"
                                    class="mb-[1.5rem] text-2xl font-semibold leading-6 text-gray-700 flex justify-center">
                                    Pet Information Form
                                </DialogTitle>

                                <!-- start content -->
                                <div>
                                    <form class="xl:w-[70rem]">
                                        <div class="space-y-12 sm:mx-[2rem] my-[2.5rem]">
                                            <div class="border-b border-gray-900/10 pb-7">
                                                <div
                                                    class="mt-4 border-t pt-[2rem] grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                    <div class="md:col-span-3 sm:col-span-full">
                                                        <label for="profile-photo"
                                                            class="block text-base font-medium leading-6 text-gray-900">
                                                            Profile photo</label>
                                                        <div :class="{ 'py-5': !selectedImage, 'py-2': selectedImage }"
                                                            class="mt-2 flex justify-center rounded-lg outline-2 outline-dashed outline-gray-300">
                                                            <div class="text-center" v-if="!selectedImage">
                                                                <PhotoIcon class="mx-auto h-12 w-12 text-gray-300"
                                                                    aria-hidden="true" />
                                                                <div
                                                                    class="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                                    <label for="profile-photo"
                                                                        class="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-600 focus-within:ring-offset-2 hover:text-teal-500">
                                                                        <span>Upload a file</span>
                                                                        <input id="profile-photo" ref="profileInput"
                                                                            name="profile-photo" type="file"
                                                                            class="sr-only"
                                                                            @change="handleFileChange" />
                                                                    </label>
                                                                </div>
                                                                <p class="text-xs leading-5 text-gray-600">PNG, JPG, GIF
                                                                    up to 10MB</p>
                                                            </div>
                                                            <div v-else
                                                                class="flex justify-center items-center h-full w-full relative">
                                                                <img :src="selectedImage"
                                                                    class="max-w-[15rem] max-h-[15rem] rounded-md" />
                                                                <button @click="clearImage"
                                                                    class="absolute top-2 sm:right-[1rem] lg:right-[8.1rem] text-gray-600 hover:text-red-600">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                                                        stroke="currentColor">
                                                                        <path stroke-linecap="round"
                                                                            stroke-linejoin="round" stroke-width="2"
                                                                            d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mt-[1rem] grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                    <div class="md:col-span-3 sm:col-span-full">
                                                        <label for="given-name"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Temporary Name</label>
                                                        <div class="mt-2">
                                                            <input v-model="name" type="text" name="given-name"
                                                                id="given-name" autocomplete="given-name"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div>
                                                    <!-- <div class="md:col-span-3 sm:col-span-full">
                                                        <label for="alias"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Nickname</label>
                                                        <div class="mt-2">
                                                            <input v-model="nickname" type="text" name="alias"
                                                                id="alias"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div> -->
                                                    <div id="rehomed" class="lg:col-span-1 sm:col-span-full">
                                                        <label for="rehome"
                                                            class="block text-sm font-medium leading-6 text-gray-900">
                                                            Date Re-homed</label>
                                                        <div class="mt-2">
                                                            <input v-model="daterehomed" type="date" name="rehome"
                                                                id="rehome"
                                                                class="border p-1 rounded-lg px-[1rem] w-full">
                                                        </div>
                                                    </div>
                                                    <div id="anitype" class="lg:col-span-2 sm:col-span-full">
                                                        <label for="animaltype"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Pet
                                                            Type</label>
                                                        <div class="mt-2">
                                                            <select v-if="selectedAnimalType !== 'Other'"
                                                                id="animaltype" name="animaltype"
                                                                v-model="selectedAnimalType"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                                <option value="" selected disabled hidden>Select Animal
                                                                    Type</option>
                                                                <option v-for="(item, index) in animalCategory"
                                                                    :key="index" :value="item.id">{{
                                                                        item.pet_category }}</option>
                                                                <option value="Other">Other</option>
                                                                <!-- Make sure this value matches the check -->
                                                            </select>
                                                            <div v-else class="flex gap-2 items-center">
                                                                <input type="text" v-model="animaltype"
                                                                    name="animaltype" id="animaltype"
                                                                    placeholder="Type of Furry Animal"
                                                                    class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                                <button @click="clearAnimalTypeInput" class="w-4 h-4">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" stroke-width="2">
                                                                        <path stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- <div id="breed" class="lg:col-span-2 sm:col-span-full">
                                                        <label for="animalbreed"
                                                            class="block text-sm font-medium leading-6 text-gray-900">
                                                            Breed / Mix</label>
                                                        <div class="mt-2"> -->
                                                            <!-- Display the dropdown when selectedAnimalTypeString is not 'Other' -->
                                                            <!-- <select
                                                                v-if="selectedAnimalTypeString && selectedBreedString !== 'Other'"
                                                                id="animalbreed" name="animalbreed"
                                                                v-model="selectedAnimalBreed"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                                <option value="" selected disabled hidden>Select {{
                                                                    selectedAnimalTypeString }}
                                                                    Breed/Mix</option>
                                                                <option v-for="(breed, index) in breedCategory"
                                                                    :key="index" :value="breed.id">{{
                                                                        breed.name }}</option>
                                                                <option value="Other">Other</option>
                                                            </select> -->

                                                            <!-- Display the text input when selectedAnimalTypeString is 'Other' -->
                                                            <!-- <div v-else class="flex gap-2 items-center">
                                                                <input type="text" v-model="animalbreed"
                                                                    name="animalbreed" id="animalbreed"
                                                                    :placeholder="selectedBreedString === 'Other' ? 'Type of Furry Animal Breed/Mix' : `Type of ${selectedAnimalTypeString} Breed/Mix`"
                                                                    class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                                <button v-if="selectedBreedString === 'Other'"
                                                                    @click.prevent="clearAnimalTypeBreed"
                                                                    class="w-4 h-4 lg:mr-[1rem]">
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 24 24" fill="none"
                                                                        stroke="currentColor" stroke-width="2">
                                                                        <path stroke-linecap="round"
                                                                            stroke-linejoin="round"
                                                                            d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div> -->
                                                    <div id="gender" class="lg:col-span-1 sm:col-span-full">
                                                        <label for="animalGender"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
                                                        <div class="mt-2">
                                                            <select v-model="selectedGender" id="animalGender"
                                                                name="animalGender"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                                <option value="" selected disabled hidden>Select Gender
                                                                </option>
                                                                <option value="male">Male</option>
                                                                <option value="female">Female</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <!-- <div id="fur" class="md:col-span-4 sm:col-span-full">
                                                        <label for="coatfur"
                                                            class="block text-sm font-medium leading-6 text-gray-900">
                                                            Coat / Fur</label>
                                                        <div class="mt-2">
                                                            <input v-model="coat" type="text" name="coatfur"
                                                                id="coatfur"
                                                                placeholder="ex. Short, dark-brown coat with a slight wave"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div>
                                                    <div id="age" class="md:col-span-2 sm:col-span-full">
                                                        <label for="animalAge"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Age</label>
                                                        <div class="mt-2">
                                                            <input v-model="age" type="number" name="animalAge"
                                                                id="animalAge" placeholder="Ex. 2 yrs old"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div> -->
                                                    <!-- <div id="size" class="md:col-span-4 sm:col-span-full">
                                                        <label for="animalSize"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Size</label>
                                                        <div class="mt-2">
                                                            <input v-model="sizeweight" type="text" name="animalSize"
                                                                id="animalSize"
                                                                placeholder="ex. 38 pounds, 59 inches tall"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div>
                                                    <div id="lvl" class="md:col-span-2 sm:col-span-full">
                                                        <label for="energyLvl"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Energy
                                                            Level</label>
                                                        <div class="mt-2">
                                                            <select id="energyLvl" name="energyLvl"
                                                                @change="getSelectedOption($event)"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                                <option value="" selected disabled hidden>Select Energy
                                                                    Level Status</option>
                                                                <option>Low</option>
                                                                <option>Medium</option>
                                                                <option>Medium-High</option>
                                                                <option>High</option>
                                                                <option>Very High</option>
                                                            </select>
                                                        </div>
                                                    </div> -->
                                                    <!-- <div id="lvl" class="md:col-span-2 sm:col-span-full">
                                                        <label for="status"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Status</label>
                                                        <div class="mt-2">
                                                            <select id="status" name="status" v-model="selectedstatus"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                                <option value="" selected disabled hidden>Select Pet
                                                                    Status</option>
                                                                <option v-for="(status, index) in status" :key="index"
                                                                    :value="status.id">{{
                                                                        status.name }} </option>
                                                            </select>
                                                        </div>
                                                    </div> -->
                                                    <!-- <div class="col-span-full border-t border-gray-900/10">
                                                        <div class="border-b border-gray-900/10 py-5">
                                                            <h2 class="text-base font-semibold leading-7 text-gray-900">
                                                                Health and Medical</h2>
                                                            <p class="mt-1 text-sm leading-6 text-gray-600">Provide
                                                                details about the animal's
                                                                current health, including vaccinations, medical
                                                                conditions, and treatment history.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="col-span-full">
                                                        <div class="lg:flex items-center gap-3">
                                                            <h4
                                                                class="block text-sm font-medium leading-6 text-gray-900">
                                                                Vaccinations Status</h4>
                                                            <p class="font-normal text-[13px] text-gray-500">( Please
                                                                select one or more of the
                                                                following vaccination options this animal has received.
                                                                )</p>
                                                        </div>
                                                        <div
                                                            class="mt-4 grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-2 text-sm leading-6">
                                                            <div v-for="(option, index) in displayVaccines" :key="index"
                                                                class="flex items-center mx-6">
                                                                <div>
                                                                    <input type="checkbox"
                                                                        :id="'checkbox' + (index + 1)"
                                                                        v-model="selectedVaccines" :value="option.name"
                                                                        class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600">
                                                                </div>
                                                                <div>
                                                                    <label :for="'checkbox' + (index + 1)"
                                                                        class="font-medium text-gray-600 pl-[.50rem]">{{
                                                                            option.name }}</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-span-full">
                                                                <label for=""
                                                                    class="block text-sm font-medium leading-6 text-gray-900">Other
                                                                    Vaccines</label>
                                                                <div class="mt-2 flex gap-x-3">
                                                                    <textarea v-model="otherVaccines"
                                                                        class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"></textarea>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-span-full">
                                                        <label for="MedConditions"
                                                            class="block text-sm font-medium leading-6 text-gray-900">
                                                            Medical Conditions
                                                        </label>
                                                        <div class="mt-2 flex gap-x-3">
                                                            <textarea type="text" v-model="medicalcondition"
                                                                name="MedConditions" id="MedConditions"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div>
                                                    <div class="sm:col-span-full">
                                                        <label for="specialNeeds"
                                                            class="block text-sm font-medium leading-6 text-gray-900">
                                                            Special Needs
                                                        </label>
                                                        <div class="mt-2 flex gap-x-3">
                                                            <textarea type="text" v-model="specialneed"
                                                                name="specialNeeds" id="specialNeeds"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div>
                                                    <div v-if="categoriesLoaded" class="sm:col-span-full">
                                                        <h4 class="font-medium text-gray-900">
                                                            Has this animal been sterilized?
                                                        </h4>
                                                        <div v-for="[categoryname, options] in Object.entries(categoriesRaw)"
                                                            :key="categoryname" class="mt-4 space-y-2">
                                                            <span v-if="categoryname !== 'None'"
                                                                class="font-medium text-sm text-gray-900">
                                                                {{ categoryname }}
                                                            </span>
                                                            <div v-if="options.length > 0"
                                                                v-for="(option, index) in options" :key="index"
                                                                class="relative flex gap-x-3">
                                                                <div class="flex h-6 items-center">
                                                                    <input :id="option.id" name="spayNeuterStatus"
                                                                        type="radio" :value="option.name"
                                                                        v-model="selectedSterilization"
                                                                        class="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                                                                        @input="selectedValue = $event.target.value" />
                                                                </div>
                                                                <div class="lg:flex text-sm leading-6">
                                                                    <label :for="option.id"
                                                                        class="font-medium text-gray-700 pr-[1rem]">
                                                                        {{ option.name }}
                                                                    </label>
                                                                    <p class="text-gray-600">{{ option.description }}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> -->
                                                    <!-- <div class="col-span-full border-t border-gray-900/10">
                                                        <div class="border-b border-gray-900/10 py-5">
                                                            <h2 class="text-base font-semibold leading-7 text-gray-900">
                                                                Other Information
                                                            </h2>
                                                            <p class="mt-1 text-sm leading-6 text-gray-600">
                                                                Share other important information related to this furry
                                                                animal. This
                                                                information
                                                                you've provided for this animal can
                                                                help potential adopters to learn more about its
                                                                background, personality, and
                                                                needs.
                                                            </p>
                                                        </div>
                                                    </div> -->
                                                    <!-- <div class="col-span-full">
                                                        <label for="aboutInfo"
                                                            class="block text-sm font-medium leading-6 text-gray-900">
                                                            Tell me more about this Furry Animal</label>
                                                        <div class="mt-2">
                                                            <textarea v-model="about" id="aboutInfo" name="aboutInfo"
                                                                rows="3"
                                                                class="block w-full rounded-md border-0 py-1.5 px-[1rem] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6" />
                                                        </div>
                                                    </div> -->
                                                    <div class="col-span-full">
                                                        <label for="otherPhotos"
                                                            class="block text-sm font-medium leading-6 text-gray-900">Photos</label>
                                                        <div class="px-[1rem] py-[1rem]">
                                                            <div class="px-4 sm:col-span-2 sm:px-0">
                                                                <ul role="list"
                                                                    class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                                                                    <li v-for="(file, index) in files"
                                                                        :key="file.source" class="relative">
                                                                        <div
                                                                            class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                                                            <img :src="file.url" alt=""
                                                                                class="pointer-events-none object-cover" />
                                                                            <button @click="removeImage(index)"
                                                                                class="absolute top-0 right-0 p-1 text-gray-600 hover:text-red-600">
                                                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                                                    viewBox="0 0 24 24" fill="none"
                                                                                    stroke="currentColor"
                                                                                    stroke-width="2" class="w-4 h-4">
                                                                                    <path stroke-linecap="round"
                                                                                        stroke-linejoin="round"
                                                                                        d="M6 18L18 6M6 6l12 12" />
                                                                                </svg>
                                                                            </button>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div class="mt-3">
                                                                <label for="otherPhotos"
                                                                    class="cursor-pointer flex items-center gap-x-2">
                                                                    <input type="file" multiple
                                                                        @change="handleMultipleFileChange"
                                                                        id="otherPhotos" ref="otherPhotos"
                                                                        class="hidden" />
                                                                    <img width="24" height="24"
                                                                        src="https://img.icons8.com/fluency/48/stack-of-photos.png"
                                                                        alt="stack-of-photos" />
                                                                    <span
                                                                        class="font-medium text-gray-700 text-[14px]">Add
                                                                        more
                                                                        photos</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-end gap-x-6">
                                                <button type="button" @click="retrieveData"
                                                    class="rounded-md bgteal px-[2rem] py-2 text-sm font-semibold text-white shadow-sm hover:bg-bgteal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                                                    Save Information
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <!-- end content -->
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, toRaw, defineProps } from 'vue'
import axios from "axios"
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { PhotoIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router';


const emit = defineEmits(['close', 'post-created']) // for closing the modal with close button - joey added
const props = defineProps(['postId']);
console.log('Received postId:', props.postId); // Debug line

// to close press esc
onMounted(() => {
    const closeModalOnEsc = (e) => e.key === 'Escape' && emit('close')
    window.addEventListener('keydown', closeModalOnEsc)
    onBeforeUnmount(() => window.removeEventListener('keydown', closeModalOnEsc))
})

const toastRef = ref(null);

// jeneh's code from shelter create new profile geh reuse nlng nkong form...
const router = useRouter();
function navigateTo(path) {
    router.push(path);
}

//user details
const userid = localStorage.getItem('u_id');

// const formData = new FormData()
const dataEntries = ref([]);
//pet details
const name = ref('');
const nickname = ref('');
const daterehomed = ref('');
const genderchar = ref('');
const age = ref('');
const sizeweight = ref('');
const energylevel = ref('');
const coat = ref('');
const about = ref('');
const specialneed = ref('');
const medicalcondition = ref('');
const selectedGender = ref('');
const selectedSterilization = ref('');

const profileInput = ref(null); // Initialized with a value of null, but it will eventually hold a reference to the file input element. (profile photo)
const selectedImage = ref(null); // Initialized with a value of null, but it will eventually hold the selected image data (e.g., a URL string or a blob)
const profileToUpload = ref(null)
const fileToUploadArray = ref(null) //holds the file in handlefilechanges event function
//holds the file in handlefilechanges event function

// multiple images
const files = ref([])
const otherPhotos = ref(null)

function clearImage() {
    selectedImage.value = null; // sets the selectedImage reference to null, effectively removing the image
    if (profileInput.value) { // if the file input element exists, sets its value to an empty string, effectively clearing the file selection
        profileInput.value.value = '';
    }
}

// For select animal type and auto change the value option on animalbreed depending on what's the animal type selected.
const animaltype = ref(''); //others option
const animalbreed = ref('');
const selectedAnimalType = ref(''); //selected from the options, retrieves the ID based on the database
const selectedAnimalBreed = ref('');
const selectedAnimalTypeString = ref('') //retrieves the string exactly from the option e.g.: dog, cat, horse, bird
const selectedBreedString = ref('')

//for dropbox/options
const animalCategory = ref([])
const breedCategory = ref([])
const status = ref([])

watch(selectedAnimalType, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        selectedAnimalBreed.value = ''; // reset selectedAnimalBreed when selectedAnimalType changes
        Vaccines.value = []; // reset the selected vaccines when animal type changes
        // otherVaccines.value = ''; // reset the other vaccines when animal type changes
    }
});

const clearAnimalTypeInput = () => {
    animaltype.value = '';
    selectedAnimalType.value = ''; // reset the selected animal type
};
const clearAnimalTypeBreed = () => {
    animalbreed.value = '';
    selectedAnimalBreed.value = ''; // reset the selected animal breed
};

// For Vaccines options
const vaccines = ref({});
const other_vaccine = ({
    "Other": [
        "Rabies",
        "Distemper",
        "Influenza",
        "Tetanus",
        "Bovine viral diarrhea (BVD)"
    ]
})

//VACCINES
const displayVaccines = computed(() => {
    // console.log(selectedAnimalType.value)
    if (selectedAnimalType.value == 'Other') {
        // return other_vaccine.Other; // Return the array directly
    } else if (Vaccines.value && Array.isArray(Vaccines.value)) {
        return Vaccines.value; // Ensure vaccines is an array
    }
    return [];
});

const selectedstatus = ref('')

const Vaccines = ref([]);
const selectedVaccines = ref([]) // initialize an empty array to store the selected vaccines
const otherVaccines = ref(''); // initialize an empty string to store the other vaccines

const allVaccines = computed(() => {
    const selectedVaccineNames = selectedVaccines.value.map(vaccine => vaccine); // Extract the vaccine names
    return [...selectedVaccineNames, ...otherVaccines.value.split(',').filter(Boolean)];
});

// spayed or neutered
const sterilization = ref([])
const nonSurgical = ref([]);
const surgical = ref([]);
const spayNeuterOptions = ref([ //"other" option value
    {
        id: 'intact',
        name: 'Intact',
        label: 'No - Intact',
        description: 'This animal has not been spayed or neutered.'
    },
    {
        id: 'NA',
        name: 'Not Applicable',
        label: 'Not Applicable',
        description: 'This animal is too young or not eligible for spaying/neutering.'
    },
    {
        id: 'unknown',
        name: 'Unknown',
        label: 'Unknown',
        description: 'This animal\'s spay/neuter status is unknown.'
    }
])

const selectedValue = ref('')
const categories = ref({
    "non-surgical": [],
    "surgical": [],
    "others": []
})

const categoriesRaw = computed(() => toRaw(categories.value));

//image handling
const handleMultipleFileChange = (event) => {
    const filesArray = event.target.files
    console.log("handle multiple file change", filesArray)

    for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i]
        const reader = new FileReader()
        reader.onload = (event) => {
            // files.value.push({ source: file.name, url: event.target.result })
            files.value.push({ file: file, url: event.target.result });
        }
        reader.readAsDataURL(file)
    }
}
function handleFileChange(event) {
    const file = event.target.files[0]; // gets the first file selected by the user 
    profileToUpload.value = file;

    // console.log(file)
    console.log(profileToUpload.value)

    const reader = new FileReader(); // creates a new FileReader object, which is used to read the contents of the file
    reader.onload = (event) => { // sets up an event listener for when the file reading is complete.
        // When the file reading is complete, the onload event is triggered, and the callback function is executed:
        selectedImage.value = event.target.result; // sets the selectedImage reference to the result of the file reading (the data URL string)
    };
    reader.readAsDataURL(file); // starts reading the file as a data URL (a string representation of the file contents)
}
async function loadPetCategory() { //type from db dog cats //pet type/category rendering
    try {
        const response = await axios.get("http://localhost:5000/load-category")
        console.log(response)
        if (response.data) {
            animalCategory.value = response.data
        }
    }
    catch (err) {
        console.log("error", err)
    }
}
async function loadPetBreed() { //breed from db //load pet breed when pet type (animalCategory) is selected
    try {
        const response = await axios.post("http://localhost:5000/pet_breed",
            {
                _category_id: selectedAnimalType.value
            }
        )
        if (response.data) {
            breedCategory.value = response.data
        }
    }
    catch (err) {
        console.log("error", err)
    }
}
//load vaccines when pet type (animalCategory) is selected
async function loadVaccineOptions() { //ovi nmn ;-; load vaccine
    try {
        const response = await axios.post("http://localhost:5000/vaccine",
            {
                _category_id: selectedAnimalType.value
            }
        )
        if (response) {
            Vaccines.value = response.data
        }
    }
    catch (err) {
        console.log("error in loading vaccines", err)
    }
}
//load sterilization base on gender selectedGender
async function loadSterilization() { //kwaon tung sa db tas e load ;-; ovi
    try {
        console.log(selectedGender.value)
        const response = await axios.post("http://localhost:5000/sterilization",
            {
                _gender: selectedGender.value
            }
        )
        if (response) {
            sterilization.value = response.data
            categorizedSterilization() // Categorize after loading
            //
            categories.value = {
                "non-surgical": [...categories.value["non-surgical"]],
                "surgical": [...categories.value["surgical"]],
                "others": [...categories.value["others"], ...spayNeuterOptions.value]
            }
        }
    }
    catch (err) {
        console.log("error in loading sterilization", err)
    }
}
function categorizedSterilization() { //categorize sterilization from load sterilization (e.g. surgical, non surgical)
    try {
        const keys = Object.keys(categories.value);

        if (!Array.isArray(sterilization.value)) {
            console.error("sterilization.value is not an array:", sterilization.value);
            return;
        }

        sterilization.value.forEach(request => {
            if (categories.value[request.type]) {
                categories.value[request.type].push(request);
            }
            else {
                console.warn(`Unknown type '${request.type}' encountered.`);
                // If type doesn't match 'non-surgical' or 'surgical', add to 'others'
                categories.value["others"].push({
                    id: request.id || 'unknown',
                    value: request.type || 'Unknown',
                    label: request.label || 'Unknown',
                    description: request.description || 'No description available'
                });
            }
        });

        // console.log("Categories", categories.value);
        console.log("category", categories.value)

        // Assign categorized data to separate refs
        nonSurgical.value = categories.value["non-surgical"];
        surgical.value = categories.value["surgical"];

    }
    catch (err) {
        console.log("error in categorizing sterilization", err)
    }
}
async function loadPetStatus() { // load pet status... tf do u want 
    try {
        const response = await axios.get("http://localhost:5000/pet_status")
        if (response) {
            status.value = response.data
        }
    }
    catch (err) {
        console.log("error in loading sterilization", err)
    }
}
async function retrieveData() {
    const formData = new FormData();
    const vaccineArray = getSelectedVaccineIds();

    // Populate dataEntries
    const entries = [
        ['id', localStorage.getItem('u_id')],
        ['gender', `${genderchar.value}`],
        ['pet_category_id', selectedAnimalType.value],
        ['other_pet_category', animaltype.value],
        ['breed_id', selectedAnimalBreed.value],
        ['other_breed', animalbreed.value],
        ['status', selectedstatus.value || 1], //Default to available
        ['name', name.value],
        ['nickname', nickname.value],
        ['daterehomed', daterehomed.value],
        ['energylevel', energylevel.value],
        ['age', age.value],
        ['sizeweight', sizeweight.value],
        ['coat', coat.value],
        ['about', about.value],
        ['special_needs', specialneed.value || null],
        ['med_condition', medicalcondition.value || null],
        ['other_vaccines', otherVaccines.value || null],
        ['other_sterilization', selectedSterilization.value || null],
        ['sterilization_id', getSelectedSterilization() || null]
    ];

    // Append vaccines
    vaccineArray.forEach((vaccineId) => {
        formData.append(`vaccines`, vaccineId);
    });

    // Append profile image
    formData.append('profile', profileToUpload.value || null);

    // Append extra photos
    files.value.forEach((fileobj) => {
        formData.append(`extra_photo`, fileobj.file);
    });

    // Append data entries to FormData
    entries.forEach(([key, value]) => formData.append(key, value));

    // Log FormData contents
    for (let [key, value] of formData.entries()) {
    console.log(key, value);
}

    // Validate required fields
    const name_ = formData.get('name');
    const gender_ = formData.get('gender');
    const pet_ = formData.get('pet_category_id');
    const pet2_ = formData.get('other_pet_category');
    const status_ = formData.get('status');
    const steril_ = formData.get('other_sterilization');
    const steril2_ = formData.get('sterilization_id');

    if (!name.value || !selectedAnimalType.value || !selectedGender.value) {
    console.error("Required fields are missing");
    return; // Prevent submission if required fields are missing
    
}
    try {
        // Save pet profile
        const response = await axios.post("http://localhost:5000/save_pet_profile", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log("Response from save_pet_profile:", response.data);
        
        if (response.data.success) {
            const postId = props.postId; // Ensure this is correctly returned from the API
            const shelterId = localStorage.getItem('c_id');
            
            console.log("Post ID:", postId);
            console.log("Shelter ID:", shelterId);
            
            if (postId && shelterId) {
                // Confirm rescue
                const rescueResponse = await axios.post("http://localhost:5000/confirmRescue", {
                    post_id: postId,
                    shelter_id: shelterId
                    });
                    
                    console.log("Response from confirmRescue:", rescueResponse.data);

                    if (rescueResponse.data.success) {
                        emit('close');
                        
                        navigateTo({
                            path: "/buddy_home",
                            query: { showToast: true, message: 'Pet Profile Saved and Rescued Successfully', from: 'create' }
                        });


                    } else {
                        console.error('Failed to confirm rescue:', rescueResponse.data.message);
                    }
                } else {
                    console.error('Post ID or Shelter ID is undefined');
                }
            } else {
                console.error('Failed to save profile:', response.data.message);
            }
        } catch (err) {
            console.error("Error occurred during the process:", err);
            if (err.response) {
                console.error("Response data:", err.response.data); // Log server response
                console.error("Response status:", err.response.status); // Log status code
                }
            }
}

async function sendMessagetoUser(){
    
}

// async function savePetProfile(formData) {
//     console.log("Profile data being sent to server:", formData); // Log the FormData contents

//     try {
//         const response = await axios.post("http://localhost:5000/save_pet_profile", formData, {
//             headers: { 'Content-Type': 'multipart/form-data' } // Ensure correct header
//         });

//         console.log("Response from server:", response.data); // Log the response from the server

//         if (response.data.success) {
//             navigateTo({
//                 path: "/animalprofile",
//                 query: { showToast: true, message: 'Pet Profile Saved Successfully', from: 'create' }
//             });
//         } else {
//             console.error('Failed to save profile:', response.data.message);
//             if (toastRef.value) {
//                 toastRef.value.showToast('Error: ' + response.data.message); // Show error message
//             }
//         }
//     } catch (err) {
//         console.error("Error occurred while saving pet profile:", err);
//         if (toastRef.value) {
//             toastRef.value.showToast('An error occurred: ' + err.message); // Show error message
//         }
//     }
// }


//SMALL FUNCTIONS

const removeImage = (index) => {
    files.value.splice(index, 1)
}

function getSelectedOption(event) { //for energy level
    const selectedOption = event.target.options[event.target.selectedIndex].text;
    energylevel.value = selectedOption
}
function getSelectedVaccineIds() {
    return selectedVaccines.value
        .map(selectedName => {
            const matchingVaccine = Vaccines.value.find(vaccine => vaccine.name === selectedName);
            return matchingVaccine ? matchingVaccine.id : null; // Handle unmatched names
        })
        .filter(id => id !== null);
}
function getSelectedSterilization() {
    console.log(sterilization.value)
    const selectedSterilizationId = sterilization.value.find(sterilization => sterilization.name === selectedValue.value)?.id ?? null;
    return selectedSterilizationId;
}

//watcher
watch(selectedGender, (value) => {//watch for breed
    if (value == 'male') {
        genderchar.value = 'm'
    }
    else {
        genderchar.value = 'f'
    }
});
watch(selectedAnimalType, (newValue) => { //watch for breed
    if (newValue === 'Other') {
        selectedAnimalTypeString.value = newValue;
        breedCategory.value = ''
    }
    else {
        // Ensure animalCategory is an array and defined before using find
        if (Array.isArray(animalCategory.value)) {
            const selected = animalCategory.value.find(item => item.id === newValue);
            selectedAnimalTypeString.value = selected ? selected.pet_category : '';
            loadPetBreed()
            loadVaccineOptions()
            // console.log("string", selectedAnimalTypeString.value)
        } else {
            console.error("animalCategory is not an array or is undefined");
            selectedAnimalTypeString.value = '';
        }
    }
});
watch(selectedAnimalBreed, (newValue) => { //watch for breed 
    if (newValue === 'Other') {
        selectedBreedString.value = newValue;
    }
    else {
        // Ensure animalCategory is an array and defined before using find
        if (Array.isArray(breedCategory.value)) {
            const selected = breedCategory.value.find(
                item => item.id === newValue
            );
            selectedBreedString.value = selected ? selected.name : '';
        } else {
            console.error("breedCategory is not an array or is undefined");
            selectedBreedString.value = '';
        }
    }
});
watch(selectedGender, (newValue) => { //watch for sterilization
    if (newValue) {
        selectedGender.value = newValue;
        categories.value = {
            "non-surgical": [],
            "surgical": [],
            "others": []
        };
        loadSterilization();
    }
});
const categoriesLoaded = ref(false);
watch(() => categories.value, (newVal) => {//i forgot where dis used basta ayaw tanggala 
    if (newVal && Object.keys(newVal).length > 0) {
        categoriesLoaded.value = true;
    }
})

onMounted(() => { //pag load sa page mag load ni =)
    //data rendering :'D
    loadPetCategory()
    loadPetStatus()

    //This is for current date for date of rehomed
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    daterehomed.value = today;
})
// Reactive state
const open = ref(true);
</script>