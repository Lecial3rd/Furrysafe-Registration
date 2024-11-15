<template>
    <section class="bg-white max-h-screen">
        <div class="lg:grid lg:grid-cols-12 mx-4">
            <section
                class="bg-blue-50 left-[6%]  relative h-32 items-end  lg:col-span-5 lg:h-full xl:col-span-6 hidden lg:block">
                <img alt="" :src="require('@/assets/images/home_animalshelter_slider_pic4.png')"
                    class="absolute inset-0 my-20 mx-10 h-[90%] w-[90%] object-contain " />

                <div class="hidden lg:relative lg:block lg:p-12">
                    <a class="block text-white" href="#">
                        <span class="sr-only">Home</span>
                    </a>

                </div>
            </section>

            <main
                class="flex items-center justify-center min-h-screen px-8 sm:px-[2rem] lg:col-span-7 lg:px-8 lg:py-12 xl:col-span-6">
                <div class="w-full md:w-2/3 mx-auto">
                    <div class="flex gap-x-2 items-center">
                        <RouterLink to="/">
                            <HomeIcon class="h-6 w-6 text-gray-800 hover:text-gray-700" />
                        </RouterLink>
                        <h1 class="text-2xl font-semibold text-gray-800 ">Sign up as Buddy</h1>
                    </div>

                    <form action="#" class=" mt-5 grid grid-cols-6 gap-6 ">
                        <div class="sm:col-span-6 md:col-span-3 ">
                            <label class=" text-gray-800 text-sm mb-2 block font-semibold">First Name</label>
                            <input type="text" id="fname" v-model="firstName" placeholder="First Name"
                                class=" w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!firstName && submitted" class="text-red-500 text-[11px]">*First Name is required
                            </p>
                        </div>
                        <div class="sm:col-span-6 md:col-span-3 ">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Last Name</label>
                            <input type="text" id="lname" v-model="lastName" placeholder="Last Name"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!lastName && submitted" class="text-red-500 text-[11px]">*Last Name is required</p>
                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Username</label>
                            <input type="text" id="username" v-model="username" placeholder="Username"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!username && submitted" class="text-red-500 text-[11px]">*Username is required</p>
                        </div>
                        <div class="col-span-6">
                            <label class="text-gray-800 text-sm mb-2 block font-semibold">Email</label>
                            <input type="email" id="email" v-model="email" placeholder="Email"
                                class="w-full text-sm border border-gray-200 bg-white px-4 py-3 rounded-md text-gray-700 shadow-sm"
                                required />
                            <p v-if="!email && submitted" class="text-red-500 text-[11px]">*Email is required</p>
                        </div>
                        <div class="col-span-6">
                            <passwordunhide />

                            <p v-if="!password && submitted" class="text-red-500 text-[11px]">*Password is required</p>
                        </div>
                        <div
                            class="col-span-6 gap-y-6 gap-x-6 field w-full grid sm:grid-flow-row md:grid-flow-col items-center">

                            <div class="">
                                <label for="bdate"
                                    class="text-gray-800 text-sm mb-2 block font-semibold">Birth-date</label>
                                <input type="date" id="bdate" class="border w-full rounded-lg p-2 sm:text-sm">
                            </div>
                            <div class="field items-center grid">
                                <label class="pr-2 text-gray-800 text-sm mb-2 block font-semibold">Gender</label>
                                <Dropdown v-model="gender" />
                            </div>
                        </div>
                        <div class="text-center col-span-6">
                            <p class="text-sm text-gray-500">
                                By creating an account, you agree to our
                                <a href="#" class="text-gray-700 underline"> terms and conditions </a>
                                and
                                <a href="#" class="text-gray-700 underline">privacy policy</a>.
                            </p>
                        </div>
                        <div class="col-span-6 flex flex-col justify-center items-center gap-y-2 ">
                            <button @click.prevent="handleSignup()"
                                class="w-full bg-gray-800 text-white py-3  rounded-lg hover:bg-teal-600 transition duration-300">
                                Create an account
                            </button>

                            <p class="text-sm text-gray-500 sm:mt-0">
                                Already have an account?
                                <a href="#" @click="goBack" class="text-gray-700 underline">Log in</a>.
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    </section>
</template>

<script>
import axios from "axios";
import Dropdown from "../components/registration_dropdown.vue";
import passwordunhide from "../components/passwordHide.vue";
import { HomeIcon  } from '@heroicons/vue/20/solid'

export default {
    name: 'LoginShelter',
    components: {
        Dropdown,
        passwordunhide,
        HomeIcon
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            birthMonth: '',
            birthDay: '',
            birthYear: '',
            gender: '',
            submitted: false,
            dog: require('@/assets/images/animalshelterdog.png'),
            formData: new FormData(),
            userdetails: {
                firstname: 'fname',
                lastname: 'lname',
                username: 'username',
                dob: 'bdate',
                gender: 'gender',
                email: 'email',
                password: 'password',
            },
            reg_type: 'buddy',
            items: [],
        };
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'login' }); // Navigate to login.vue
        },
        handleLoginSubmit() {
            this.submitted = true; // Set submitted to true on form submission
            // Handle form submission logic here
            if (this.firstName && this.lastName && this.email && this.password) {
                // Proceed with form submission
                console.log('Form submitted successfully!');
            }
        },
        handleRegisterSubmit() {
            this.isStepTwo = true;
            this.activeStep = 2;
        },
        goToStepThree() {
            this.isStepThree = true;
            this.activeStep = 3;
        },
        range(start, end) {
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
        navigateTo(path) {
            this.$router.push(path);
        },
        async handleSignup() {
            try {
                this.userdetails = {
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    firstname: document.getElementById('fname').value,
                    lastname: document.getElementById('lname').value,
                    username: document.getElementById('username').value,
                    gender: document.getElementById('gender').value,
                    dob: document.getElementById('bdate').value
                }

                if (!this.userdetails.firstname || !this.userdetails.lastname ||
                    !this.userdetails.email || !this.userdetails.password || !this.userdetails.gender) {
                    console.log("Some required fields are empty.");
                    this.formData = new FormData();
                    return;
                }
                if (this.userdetails.gender == "  ") {
                    this.userdetails.gender = 'unspecified'
                }

                this.formData.append('dob', this.userdetails.dob);
                this.formData.append('email', this.userdetails.email);
                this.formData.append('password', this.userdetails.password);
                this.formData.append('firstname', this.userdetails.firstname);
                this.formData.append('lastname', this.userdetails.lastname);
                this.formData.append('username', this.userdetails.username,);
                this.formData.append('gender', this.userdetails.gender);
                this.formData.append('regtype', this.reg_type);

                await this.setUser();
            }
            catch (err) {
                console.log("error", err)
            }
        },
        async setUser() {
            try {
                const response = await axios.post("http://localhost:5000/buddy-registration", this.formData,
                    {
                        'Content-Type': 'multipart/form-data'
                    }
                )
                this.items = response.data
                console.log("response: ", response.data);
                if (response.data.success) {
                    this.formData = new FormData();
                    this.navigateTo('/');
                } else {
                    this.formData = new FormData();
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRR");
                }
            }
            catch (err) {
                console.log("An ERROR occurred: " + err);
            }
            finally {
                this.files = [];
                this.userdetails = {
                    sheltername: '',
                    email: '',
                    password: '',
                }
            }
        }
    }
}
</script>
