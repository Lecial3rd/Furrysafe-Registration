<template>
    <div class="font-semibold border-t text-sm rounded-b-lg">
        <!-- Nov5 change v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmRescue && !showConfirmCancel" to -->
        <button v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmDialog" type="button"
            class="flex justify-center py-4 font-semibold w-full text-red-600 bg-slate-50 hover:bg-red-500 hover:text-white rounded-b-lg"
            @click="showRescueCancelButtons = true; confirmAction()">
            Take Action
        </button>

        <div v-else-if="showRescueCancelButtons || props.operation == 'ongoing'" class="flex justify-between font-semibold text-gray-600 rounded-b-lg">
            <button type="button" class="bg-green-100 py-4 w-full hover:bg-green-500 hover:text-white rounded-bl-lg"
                @click="handleAction('Rescued')"> <!-- Nov5 -->
                Rescued
            </button>
            <button type="button" class="bg-red-100 py-4 w-full hover:bg-red-500 hover:text-white rounded-br-lg"
                @click="handleAction('Cancelled')"> <!-- Nov5 -->
                Cancel
            </button>
        </div>

        <div v-if="showConfirmRescue" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure about this status?</span>
            <button type="button" class="text-green-700" @click="showSuccessMessage = true; showConfirmRescue = false">
                Yes
            </button>
            <button type="button" class="text-red-700"
                @click="showRescueCancelButtons = true; showConfirmRescue = false">
                No
            </button>
        </div>
        <!-- Nov5 change showConfirmCancel to -->
        <div v-if="showConfirmDialog" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
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

// Nov5 start of salpocial's new code
import axios from 'axios';

// converted into <script setup> salpocial's code below
const props = defineProps({
    postId: {
        type: Number,
        required: true
    },
    operation:{
        type: String,
        required: false
    }
});

const emit = defineEmits(['statusUpdated']);

const showRescueCancelButtons = ref(false);
const showSuccessMessage = ref(false);
const showConfirmDialog = ref(false);
const successMessage = ref('');
const selectedAction = ref('');

const handleAction = (action) => {
    selectedAction.value = action;
    showRescueCancelButtons.value = false;
    showConfirmDialog.value = true;
};

const confirmAction = async () => { //upon click
    try {
        const response = await axios.post('http://localhost:5000/accept-report', {
            post_id: props.postId,
            shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            showConfirmDialog.value = false;
            emit('statusUpdated');
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error (show error message)
    }
};

const confirmRescued = async () => { //rescued => yes
    try {
        const response = await axios.post('http://localhost:5000/confirmRescue', {
            post_id: props.postId,
            shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            showConfirmDialog.value = false;
            emit('statusUpdated');
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error (show error message)
    }
}

const cancelRescue = async () => { //rescued => yes
    try {
        const response = await axios.post('http://localhost:5000/cancelOperation', {
            _post_id: props.postId,
            _shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            showConfirmDialog.value = false;
            emit('statusUpdated');
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error (show error message)
    }
}


const cancelAction = () => {
    showConfirmDialog.value = false;
    showRescueCancelButtons.value = true;
};

let button_flag = ref('')
onMounted(()=>{
    button_flag.value = props.operation
    console.log("flag", button_flag.value)
})

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
