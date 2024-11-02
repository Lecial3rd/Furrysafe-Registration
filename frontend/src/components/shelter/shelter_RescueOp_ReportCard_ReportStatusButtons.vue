<template>
    <div class="font-semibold border-t text-sm rounded-b-lg">
        <button v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmDialog"
            type="button"
            class="flex justify-center py-4 font-semibold w-full text-red-600 bg-slate-50 hover:bg-red-500 hover:text-white rounded-b-lg"
            @click="showRescueCancelButtons = true">
            Take Action
        </button>

        <div v-else-if="showRescueCancelButtons" class="flex justify-between font-semibold text-gray-600 rounded-b-lg">
            <button type="button" class="bg-green-100 py-4 w-full hover:bg-green-500 hover:text-white rounded-bl-lg"
                @click="handleAction('Rescued')">
                Rescued
            </button>
            <button type="button" class="bg-red-100 py-4 w-full hover:bg-red-500 hover:text-white rounded-br-lg"
                @click="handleAction('Cancelled')">
                Cancel
            </button>
        </div>

        <div v-if="showConfirmDialog" class="flex justify-center py-4 text-[13px] gap-x-6 bg-slate-50">
            <span>Are you sure about this status?</span>
            <button type="button" class="text-green-700" @click="confirmAction">
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

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
    props: {
        postId: {
            type: Number,
            required: true
        }
    },
    emits: ['statusUpdated'],
    setup(props, { emit }) {
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

        const confirmAction = async () => {
            try {
                const response = await axios.post('http://localhost:5000/accept-rescue', {
                    post_id: props.postId,
                    shelter_id: localStorage.getItem('c_id'),
                    status: selectedAction.value
                });

                if (response.data.success) {
                    showConfirmDialog.value = false;
                    showSuccessMessage.value = true;
                    successMessage.value = `${selectedAction.value} Successfully`;
                    emit('statusUpdated');
                }
            } catch (error) {
                console.error('Error:', error);
                // Handle error (show error message)
            }
        };

        const cancelAction = () => {
            showConfirmDialog.value = false;
            showRescueCancelButtons.value = true;
        };

        return {
            showRescueCancelButtons,
            showSuccessMessage,
            showConfirmDialog,
            successMessage,
            handleAction,
            confirmAction,
            cancelAction
        };
    }
}
</script>