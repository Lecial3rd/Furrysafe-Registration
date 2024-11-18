<script>
import textvalue from '@/components/textString.vue'
import datetoday from '@/components/Shelter/dateCard.vue'
import linkfooter from '@/components/footerLink.vue'
import updatescard from '@/components/Shelter/shelter_Dashboard_Activities.vue';
import displaymap from '@/components/Map2.vue';
import mapoverlay from '@/components/pin_MapModal.vue'
import statsCard from '@/components/Shelter/shelter_Dashboard_statsCard.vue';
import shelterfeed from '@/components/Shelter/shelter_Myshelter_NewsfeedCard.vue'; // joey added

export default {
    beforeMount() {
        // this.address_exists = localStorage.getItem("address_exists")
        const address_exist = localStorage.getItem('address_exists')

        if (address_exist.startsWith(false)) {
            this.toggleModal()
        }

        this.open = true; // Set the open ref value to true
    },
    components: {
        textvalue, datetoday, linkfooter, updatescard, displaymap, mapoverlay, statsCard, shelterfeed
    },
    data() {
        return {
            modalVisible: false,
        }
    },
    methods: {
        toggleModal() {
            console.log("Toggling modal");
            this.modalVisible = true; // Show the modal
        },
    },
};

// function toggleModal() {
//     console.log("D:")
// }
</script>
<template>
    <div class="h-screen flex flex-col my-8 mx-4">
        <mapoverlay v-if="modalVisible" @close="modalVisible = false" />
        <header class="flex justify-between items-center">
            <div class="graycolor">
                <textvalue msg="Dashboard" />
            </div>
            <div class="flex gap-5">
                <datetoday />
            </div>
        </header>
        <main class="mt-[1rem] flex gap-x-6 sm:flex-col sm:gap-y-6 xl:flex-row">
           <div class="xl:container mx-auto">
                <shelterfeed />
            </div>
        </main>
        <footer class="mt-auto">
            <div>
                <linkfooter />
            </div>
        </footer>
    </div>
</template>