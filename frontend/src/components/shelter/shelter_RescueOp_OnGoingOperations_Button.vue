<template>
    <div class="font-semibold border-t text-sm rounded-b-lg">
        <!-- Nov5 change v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmRescue && !showConfirmCancel" to -->
        <!-- <button v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmDialog" type="button"
            class="flex justify-center py-4 font-semibold w-full text-red-600 bg-slate-50 hover:bg-red-500 hover:text-white rounded-b-lg"
            @click="showRescueCancelButtons = true; confirmAction()">
            Take Action v-else-if="showRescueCancelButtons || props.operation == 'ongoing'" 
        </button> -->

        <div class="flex justify-between font-semibold text-gray-600 rounded-b-lg">
            <button type="button" class="bg-green-100 py-4 w-full hover:bg-green-500 hover:text-white rounded-bl-lg"
                @click="handleAction('Rescued')"> <!-- Nov5 -->
                Confirm Rescue
            </button>
            <RescueFillupFormModal v-if="showform" :postId="postId" :reportedUserId="props.reportedUserId" :reportDetails="selectedPostDetails"
                @close="showform = false" @statusUpdated="handleAction('Rescued')" /> <!-- Nov12 -->

            <button type="button" class="bg-red-100 py-4 w-full hover:bg-red-500 hover:text-white rounded-br-lg"
                @click="handleAction('Cancelled')"> <!-- Nov5 -->
                Cancel
            </button>
        </div>

        <div v-if="showConfirmRescue" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure about this status?</span>
            <!-- Nov12 @click="confirmRescued"-->
            <button type="button" class="text-green-700">
                Yes
            </button>
            <button type="button" class="text-red-700" @click="cancelAction">
                No
            </button>
        </div>
        <!-- Nov5 change showConfirmCancel to -->
        <div v-if="showCancelConfirm" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure you want to cancel your action?</span>
            <button type="button" class="text-green-700" @click="cancelRescue"> <!-- Nov5 -->
                Yes
            </button>
            <button type="button" class="text-red-700" @click="cancelAction"> <!-- Nov5 -->
                No
            </button>
        </div>

        <div v-if="showSuccessMessage" class="flex justify-center py-2 text-[12px] bg-green-50">
            <!-- <span>Rescued Succesfully</span> -->
            <span>{{ successMessage }}</span> <!-- Nov5 -->
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

import RescueFillupFormModal from "@/components/Shelter/shelter_RescueOp_FillupForm.vue"; // Nov12
const showform = ref(false); // Nov12

// converted into <script setup> salpocial's code below
const props = defineProps({
    reportedUserId: {
        type: Number,
        required: false
    },
    postId: {
        type: Number,
        required: true
    },
    operation: {
        type: String,
        required: false
    }
    //need to get the post details here = ) 
});

const emit = defineEmits(['statusUpdated']);

const showRescueCancelButtons = ref(false);
const showSuccessMessage = ref(false);
const showConfirmDialog = ref(false);
const showCancelConfirm = ref(false); // Nov12
const successMessage = ref('');
const selectedAction = ref('');

const handleAction = (action) => { // Nov12
    toggleModalViewDetails()
    selectedAction.value = action;

    if (action === 'Rescued') {
        console.debug('Attempting to rescue with postId:', props.postId); // Debug line
        showform.value = true;
    } else if (action === 'Cancelled') {
        showCancelConfirm.value = true;
    }
};

let selectedPostDetails = ref([])
function toggleModalViewDetails() {
    // props.postId = props.postId.value === id ? null : id;
    const foundPost = posts.value.find(post => post.post_id === props.postId);

    if (foundPost) {
        selectedPostDetails.value = foundPost
        console.log("found post", selectedPostDetails.value)
    } else { // Nov12 added else
        console.error("Post not found for ID:", props.postId);
    }
};
let posts = ref([])
let _shelter_id = localStorage.getItem('c_id')
async function retrieveReports() {
    try {
        console.log("retrieveReports =)")
        const response = await axios.post("http://localhost:5000/getongoingoperations", {
            _shelter_id: _shelter_id,
            _status: 'In progress' // Nov12 'Pending' change to 'In progress' 
        });

        if (response.data && response.data.length > 0) {
            posts.value = response.data
        }
        console.log("post value", posts.value)
    }
    catch (err) {
        console.log("error in retrieve operations", err)
    }
}
const cancelRescue = async () => { //rescued => yes
    if (!props.postId) {
        console.error('Error: postId is undefined.');
        return; // Exit the function early
    }
    console.debug('Cancelling rescue for postId:', props.postId); // Debug line
    try {
        const response = await axios.post('http://localhost:5000/cancelOperation', {
            _post_id: props.postId,
            _shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            showCancelConfirm.value = false;
            showSuccessMessage.value = true;
            successMessage.value = 'Operation cancelled successfully';
            emit('statusUpdated');
        }
    } catch (error) {
        console.error('Error:', error);
        showSuccessMessage.value = true;
        successMessage.value = 'Error occurred while cancelling operation';
    }
}

const cancelAction = () => {
    showConfirmDialog.value = false;
    showRescueCancelButtons.value = true;
};

// Nov12 let button_flag = ref('') change to
const button_flag = ref('');
onMounted(async () => {
    await retrieveReports()

    button_flag.value = props.operation
    console.log("flag", button_flag.value)
})

</script>