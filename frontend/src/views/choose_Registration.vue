<template>
    <section class="bg-white">
        <div class="lg:grid min-h-screen lg:grid-cols-12">
            <aside class="bg-blue-50 w-full right-[6%] relative lg:order-last lg:col-span-5 lg:h-full hidden lg:block ">
                <!-- Check if this image is causing issues -->
                <img alt="Dog" :src="DogImage" class="absolute inset-0 my-20 mx-16 h-[90%] w-[90%] object-contain " />
            </aside>

            <main
                class="flex items-center justify-center min-h-screen px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-10 xl:col-span-6">
                <div class=" text-left w-full md:w-2/3 pt-10 pb-10 md:pt-2 mx-auto">

                    <div>
                        <h3 class="text-2xl text-center font-semibold mb-4">How are you planning to Register?</h3>
                        <p class="text-sm pb-10 text-center text-gray-600">
                            Register as a Buddy, helping animals, fostering, or reporting; or as a Shelter, managing
                            adoptions and animal care.</p>
                        <div class="my-4 flex sm:justify-center md:justify-between mb-6 sm:h-32 md:h-48">
                            <RouterLink to="/buddy-registration"
                                class="flex justify-center items-center border rounded-lg p-4 sm:w-52 md:w-full mr-2 bg-gray-50 hover:bg-lightteal hover:text-white">
                                <span class="font-semibold">Buddy</span>
                            </RouterLink>
                            <RouterLink to="/shelter-registration"
                                class="flex justify-center items-center border rounded-lg p-4 sm:w-52 md:w-full ml-2 bg-gray-50 hover:bg-lightorange hover:text-white">
                                <span class="font-semibold">Shelter</span>
                            </RouterLink>
                        </div>
                    </div>
                    <div class="mt-10 text-center">
                        <span class="text-sm">Already have an account?
                            <RouterLink to="/login" class="underline font-medium text-teal-600 hover:text-teal-500">
                                Sign In
                            </RouterLink>
                        </span>
                    </div>
                </div>
            </main>
        </div>
    </section>
</template>

<script setup>
import DogImage from '@/assets/images/home_animalshelter_slider_pic4.png'
</script>

<style scoped>
/* Add any component-specific styles here */
/* Consider adjusting margins or padding if needed */
.bg-blue-200 {
    background-color: #bfdbfe;
    /* Light blue color for highlighting */
}
</style>