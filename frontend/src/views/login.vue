<template>
    <section class="bg-white">
        <div class="lg:grid min-h-screen lg:grid-cols-12">
            <aside class="bg-blue-50 w-full right-[6%] relative lg:order-last lg:col-span-5 lg:h-full hidden lg:block ">
                <!-- Check if this image is causing issues -->
                <img alt="" :src="require('@/assets/images/home_animalshelter_slider_pic4.png')"
                    class="absolute inset-0 my-20 mx-16 h-[90%] w-[90%] object-contain " />
            </aside>

            <main
                class="flex items-center justify-center min-h-screen px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-10 xl:col-span-6">
                <div class=" text-left w-full md:w-2/3 pt-10 pb-10 md:pt-2 mx-auto">
                    <form @submit.prevent="isSignUp ? handleSignUpSubmit : handleLoginSubmit">
                        <div class="mb-6" v-if="!isSignUp">
                            <h2 class="text-4xl font-semibold mb-4 sm:text-center lg:text-left"> Welcome Back</h2>
                            <p class="text-sm text-gray-500 mb-8 pt-2 pb-4 sm:text-center lg:text-left">
                                We're glad to see you again! Ready to continue making a difference for animals today?
                            </p>
                            <label for="email" class="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                            <input type="text" id="email" v-model="loginEmail"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                placeholder="Example@mail.com" />
                        </div>
                        <div class="pb-3" v-if="!isSignUp">
                            <passwordunhide />
                        </div>

                        <div class="flex items-center justify-between mb-6" v-if="!isSignUp">
                            <div class="flex items-center">
                                <input id="rememberMe" name="rememberMe" type="checkbox"
                                    class="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                <label for="rememberMe" class="ml-2 block text-sm text-gray-900"> Keep me signed in
                                </label>
                            </div>
                            <div class="text-sm">
                                <a @click="navigateTo('/forgot-password')" class="cursor-pointer">
                                    <u>Forget password</u>
                                </a>
                            </div>
                        </div>
                        <button @click.prevent="handleLogin()" type="submit"
                            class="font-semibold w-full text-white bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded-md hover:bg-darkblue focus:outline-none focus:ring-2"
                            v-if="!isSignUp">
                            Sign in
                        </button>
                        <div v-if="isSignUp">
                            <h3 class="text-2xl text-center font-semibold mb-4">How are you planning to Register?</h3>
                            <p class="text-sm pb-10 text-center text-gray-600 break-words">
                                Register as a Buddy, helping animals, fostering, or reporting; or as a Shelter, managing
                                adoptions and animal care.
                            </p>
                            <div class="flex justify-between sm:h-32 md:h-48">
                                <button type="button"
                                    class="border rounded-lg p-4 w-full mr-2 bg-gray-50 hover:bg-lightteal hover:text-white"
                                    @click="goToRegis">
                                    <div class="font-semibold">Buddy</div>
                                </button>
                                <button type="button"
                                    class="border rounded-lg p-4 w-full ml-2 bg-gray-50 hover:bg-lightorange hover:text-white"
                                    @click="goToRegis2">
                                    <div class="font-semibold">Shelter</div>
                                </button>
                            </div>
                        </div>
                        <div class="mt-6 text-center">

                            <p class="text-sm text-gray-600">
                                {{ isSignUp ? 'Already have an account?' : 'Don\'t have an account?' }}
                                <button @click="toggleForm" class="font-medium text-teal-600 hover:text-teal-500">{{
                                    isSignUp ?
                                        'Sign in' : 'Sign up' }}</button>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </section>
</template>

<script>
import axios from "axios"; // Import axios for HTTP requests
import passwordunhide from "../components/passwordHide.vue"; // Import password unhide component

export default {
    name: 'LoginShelter',
    components: { passwordunhide }, // Register the password unhide component
    data() {
        return {
            loginEmail: '',
            loginPassword: '',
            signupPassword: '', // New data property for sign-up password
            isSignUp: false, // New data property to toggle forms
            usageType: '',
            usageType2: '', // New data property to store usage selection
            dog: require('@/assets/images/animalshelterdog.png'), // New data property for dog image
            passwordError: false, // New data property for password error state
            showPassword: false, // New data property for showing password
            userEmail: '', // New data property for user email
            userPassword: '', // New data property for user password
            items: [], // New data property for storing response items
        };
    },
    methods: {
        handleLoginSubmit() {
            // Handle login form submission
        },
        handleSignUpSubmit() {
            // Handle sign-up form submission
        },
        toggleForm() {
            this.isSignUp = !this.isSignUp; // Toggle between login and sign-up
        },
        goToRegis() {
            this.$router.push({ name: "buddy_registration" }); // Navigate to Regis.vue
        },
        goToRegis2() {
            this.$router.push({ name: "shelter_registration" }); // Navigate to Regis.vue
        },
        // createWorkspace() {
        //     if (this.usageType || this.usageType2) { // Check if either usage type is selected
        //         if (this.usageType) {
        //             this.$router.push({ name: "buddy_registration" }); // Navigate to Regis.vue
        //         } else if (this.usageType2) {
        //             this.$router.push({ name: "shelter_registration" }); // Navigate to Regisshel.vue
        //         }
        //     } else {
        //         alert('Please select a usage type before creating a workspace.'); // Alert if no selection
        //     }
        // },
        // selectUsage(type) {
        //     this.usageType = this.usageType === type ? '' : type; // Toggle selection for Buddy
        //     this.usageType2 = ''; // Clear Shelter selection
        // },
        // selectUsage2(type2) {
        //     this.usageType2 = this.usageType2 === type2 ? '' : type2; // Toggle selection for Shelter
        //     this.usageType = ''; // Clear Buddy selection
        // },
        navigateTo(path) {
            this.$router.push(path); // Method to navigate to a different route
        },
        async handleLogin() {
            try {
                // Retrieve input from email & password textboxes
                const UserEmail = document.getElementById('email');
                const UserPassword = document.getElementById('password');
                this.userEmail = UserEmail.value; // Get email value
                this.userPassword = UserPassword.value; // Get password value

                await this.getUser(); // Call getUser method
            } catch (err) {
                console.log(err); // Log any errors
            }
        },
        async getUser() {
            try {
                const response = await axios.post("http://localhost:5000/login", {
                    email: this.userEmail,
                    password: this.userPassword
                }, {
                    withCredentials: true // Include cookies in the request
                });

                this.items = response.data; // Store response data
                console.log("login", response.data);

                // Store tokens and user information in localStorage
                localStorage.setItem("access_token", this.items.token);
                localStorage.setItem("u_type", this.items.userType);
                localStorage.setItem("u_id", this.items.userID);
                localStorage.setItem("c_id", this.items.characterId);
                localStorage.setItem("address_exists", this.items.address_exists);

                // Navigate based on user type
                if (response.data.success) {
                    const userType = response.data.userType;
                    if (userType === 'shelter') {
                        this.navigateTo('/shelterDashboard');
                    } else if (userType === 'buddy') {
                        this.navigateTo('/buddydashboard'); // Need UI
                    } else if (userType === 'admin') {
                        this.navigateTo('/dashboard');
                    }
                } else {
                    if (response.status === 403 && response.data.message === 'Shelter is not verified') {
                        console.log('Shelter is not verified. Please verify your shelter documents.');
                    }
                    console.log("Invalid login credentials");
                }

            } catch (err) {
                if (err.response) {
                    console.log("Error Response Data??:", err.response.data);
                    console.log("Status Code:", err.response.status);
                } else {
                    console.log("An ERROR occurred:", err.message);
                }
            }
        },
    }
}
</script>

<style scoped>
/* Add any component-specific styles here */
/* Consider adjusting margins or padding if needed */
.bg-blue-200 {
    background-color: #bfdbfe;
    /* Light blue color for highlighting */
}
</style>