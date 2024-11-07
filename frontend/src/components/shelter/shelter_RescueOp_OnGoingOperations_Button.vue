<template>
    <div class="font-semibold border-t text-sm rounded-b-lg">
        <div class="flex justify-between font-semibold text-gray-600 rounded-b-lg">
            <button type="button" class="bg-green-100 py-4 w-full hover:bg-green-500 hover:text-white rounded-bl-lg"
                @click="handleAction('Rescued')">
                Rescued
            </button>
            <button type="button" class="bg-red-100 py-4 w-full hover:bg-red-500 hover:text-white rounded-br-lg"
                @click="handleAction('Cancelled')">
                Cancel
            </button>
        </div>

        <!-- Rescue confirmation dialog -->
        <div v-if="showRescueConfirm" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure about this status?</span>
            <button type="button" class="text-green-700" @click="confirmRescued">
                Yes
            </button>
            <button type="button" class="text-red-700" @click="cancelAction">
                No
            </button>
        </div>

        <!-- Cancel confirmation dialog -->
        <div v-if="showCancelConfirm" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure you want to cancel your action?</span>
            <button type="button" class="text-green-700" @click="cancelRescue">
                Yes
            </button>
            <button type="button" class="text-red-700" @click="cancelAction">
                No
            </button>
        </div>

        <div v-if="showSuccessMessage" class="flex justify-center py-2 text-[12px] bg-green-50">
            <span>{{ successMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

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
const successMessage = ref('');
const selectedAction = ref('');

const handleAction = (action) => {
    selectedAction.value = action;
    if (action === 'Rescued') {
        showRescueConfirm.value = true;
        showCancelConfirm.value = false;
    } else if (action === 'Cancelled') {
        showCancelConfirm.value = true;
        showRescueConfirm.value = false;
    }
};

const confirmRescued = async () => {
    try {
        const response = await axios.post('http://localhost:5000/confirmRescue', {
            post_id: props.postId,
            shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            showRescueConfirm.value = false;
            showSuccessMessage.value = true;
            successMessage.value = 'Pet rescued successfully and profile created';
            emit('statusUpdated');
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