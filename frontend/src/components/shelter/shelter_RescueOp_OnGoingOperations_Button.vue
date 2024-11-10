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
                Rescued
            </button>
            <formModal v-if="showform" @close="showform = false" @statusUpdated="handleAction('Rescued')"></formModal>
            <button type="button" class="bg-red-100 py-4 w-full hover:bg-red-500 hover:text-white rounded-br-lg"
                @click="handleAction('Cancelled')"> <!-- Nov5 -->
                Cancel
            </button>
        </div>

        <!-- Rescue confirmation dialog -->
        <div v-if="showRescueConfirm" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure about this?</span>
            <button type="button" class="text-green-700" @click="confirmRescued">
                Yes
            </button>
            <button type="button" class="text-red-700" @click="cancelAction">
                No
            </button>
        </div>
        
        <!-- Nov5 change showConfirmCancel to -->
         <!-- Cancel confirmation dialog -->
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
import formModal from "@/components/Shelter/shelter_RescueOp_FillupForm.vue";

const props = defineProps({
    postId: {
        type: Number,
        required: true
    },
    operation: {
        type: String,
        required: false
    }
});

const emit = defineEmits(['statusUpdated']);

const showRescueConfirm = ref(false);
const showCancelConfirm = ref(false);
const showSuccessMessage = ref(false);
const showform = ref(false);
const successMessage = ref('');
const selectedAction = ref('');

const handleAction = (action) => {
    selectedAction.value = action;
    if (action === 'Rescued') {
        showRescueConfirm.value = true; // Show confirmation dialog
        showCancelConfirm.value = false; // Hide cancel confirmation
    } else if (action === 'Cancelled') {
        showCancelConfirm.value = true; // Show cancel confirmation dialog
        showRescueConfirm.value = false; // Hide rescue confirmation
    }
};

const confirmRescued = async () => {
    try {
        const response = await axios.post('http://localhost:5000/confirmRescue', {
            post_id: props.postId,
            shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            showRescueConfirm.value = false; // Hide confirmation dialog
            showform.value = true; // Show the form after confirmation
            showSuccessMessage.value = true;
            successMessage.value = 'Pet rescued successfully and profile created';
            emit('statusUpdated'); // Emit event to notify parent
        }
    } catch (error) {
        console.error('Error:', error);
        showSuccessMessage.value = true;
        successMessage.value = 'Error occurred while processing rescue';
    }
};

const cancelRescue = async () => {
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
};

const cancelAction = () => {
    showRescueConfirm.value = false;
    showCancelConfirm.value = false;
};

const button_flag = ref('');
onMounted(() => {
    button_flag.value = props.operation;
});
</script>

<!-- 
// Nov5 orig salpocial's code
// export default {
//     props: {
//         postId: {
//             type: Number,
//             required: true
//         }
//     },
//     emits: ['statusUpdated'],
//     setup(props, { emit }) {
//         const showRescueCancelButtons = ref(false);
//         const showSuccessMessage = ref(false);
//         const showConfirmDialog = ref(false);
//         const successMessage = ref('');
//         const selectedAction = ref('');

//         const handleAction = (action) => {
//             selectedAction.value = action;
//             showRescueCancelButtons.value = false;
//             showConfirmDialog.value = true;
//         };

//         const confirmAction = async () => {
//             try {
//                 const response = await axios.post('http://localhost:5000/accept-rescue', {
//                     post_id: props.postId,
//                     shelter_id: localStorage.getItem('c_id'),
//                     status: selectedAction.value
//                 });

//                 if (response.data.success) {
//                     showConfirmDialog.value = false;
//                     showSuccessMessage.value = true;
//                     successMessage.value = `${selectedAction.value} Successfully`;
//                     emit('statusUpdated');
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//                 // Handle error (show error message)
//             }
//         };

//         const cancelAction = () => {
//             showConfirmDialog.value = false;
//             showRescueCancelButtons.value = true;
//         };

//         return {
//             showRescueCancelButtons,
//             showSuccessMessage,
//             showConfirmDialog,
//             successMessage,
//             handleAction,
//             confirmAction,
//             cancelAction
//         };
//     }
// } -->
