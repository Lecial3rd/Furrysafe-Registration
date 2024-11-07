<template>
    <header>
        <Disclosure as="nav" class="bg-white shadow" v-slot="{ open }">
            <div class="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div class="flex h-16 justify-between">
                    <div class="flex px-2 lg:px-0">
                        <div class="flex flex-shrink-0 items-center sm:ml-4 lg:ml-0">
                            <img :src="logo" alt="Logout Icon" class="w-10" aria-hidden="true" />
                            <h1 id="logotext" class="pl-3 font-extrabold text-2xl text-gray-600">
                                FurrySafe</h1>
                        </div>
                    </div>

                    <div class="flex items-center lg:hidden">
                        <!-- Mobile menu button -->
                        <DisclosureButton
                            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-50  hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-400">
                            <span class="absolute -inset-0.5" />
                            <span class="sr-only">Open main menu</span>
                            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                        </DisclosureButton>
                    </div>
                    <!-- large screen -->
                    <div class="hidden lg:ml-4 lg:flex lg:items-center gap-4">
                        <RouterLink to="login" class="hover:text-lightorange">
                            Login</RouterLink>
                        <RouterLink to="buddy-registration"
                            class="bgteal text-white p-1.5 px-4 rounded-lg font-medium hover:bg-lightorange">
                            Sign-Up</RouterLink>
                    </div>
                </div>
            </div>
            <!-- small screen -->
            <DisclosurePanel class="lg:hidden">
                <div class="border-t border-gray-200 pb-3 pt-4 space-y-2 text-white">
                    <div class="mx-[1rem]">
                        <RouterLink to="buddy-registration"
                            class="w-full bgteal rounded-lg py-2 flex justify-center hover:bg-bgteal hover:font-medium">
                            Sign-Up
                        </RouterLink>
                    </div>
                    <div class="mx-[1rem]">
                        <RouterLink to="login"
                            class="w-full bgorange rounded-lg py-2 flex justify-center hover:bg-lightorange hover:font-medium">
                            Login</RouterLink>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    </header>
    <main>
        <div>
            <RouterView /> <!-- main content page -->
        </div>
    </main>
    <!-- <footer class="mt-auto">
        <div>
            <linkfooter />
        </div>
    </footer> -->
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import logo from '@/assets/images/frrysfLOGO.png' // FurrySafe Logo

// import Linkfooter from '@/components/footerLink.vue'
</script>