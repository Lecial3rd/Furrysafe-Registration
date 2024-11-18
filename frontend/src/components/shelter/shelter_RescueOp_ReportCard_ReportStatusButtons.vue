<template>
    <div class="font-semibold border-t text-sm rounded-b-lg">
        <!-- Nov5 change v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmRescue && !showConfirmCancel" to -->
        <button v-if="!showRescueCancelButtons && !showSuccessMessage && !showConfirmDialog" type="button"
            class="flex justify-center py-4 font-semibold w-full text-red-600 bg-slate-50 hover:bg-red-500 hover:text-white rounded-b-lg"
            @click="handleTakeAction">
            <!-- Nov15 @click="showRescueCancelButtons = true; confirmAction()"> change to -->
            Take Action
        </button>
        <!-- Is this code even used? - Salpocial -->
        <div v-else-if="showRescueCancelButtons || props.operation == 'ongoing'"
            class="flex justify-between font-semibold text-gray-600 rounded-b-lg">
            <button type="button" class="bg-green-100 py-4 w-full hover:bg-green-500 hover:text-white rounded-bl-lg"
                @click="handleAction('Rescued')"> <!-- Nov5 -->
                Rescued
            </button>
            <button type="button" class="bg-red-100 py-4 w-full hover:bg-red-500 hover:text-white rounded-br-lg"
                @click="handleAction('Cancelled')"> <!-- Nov5 -->
                Cancel
            </button>
        </div>
        <!-- Is this code even used? - Salpocial -->
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
        <!-- Nov15 Modal for Buddy Rescue Fill-Up Form -->
        <formModal v-if="showFormModal" :postId="postId" @close="showFormModal = false"
            @statusUpdated="handleAction('Rescued')">
        </formModal>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// Nov5 start of salpocial's new code
import axios from 'axios';
import formModal from "@/components/Buddy/buddy_Rescue_FillUpForm.vue"; // Nov15

// converted into <script setup> salpocial's code below
const props = defineProps({
    postId: {
        type: Number,
        required: true
    },
    operation: {
        type: String,
        required: false
    },
    reportedUserId: { // Nov15 comment line Not in Salpocial changes - joey
        type: Number,
        required: false
    },
});

const emit = defineEmits(['statusUpdated']);

const showRescueCancelButtons = ref(false);
const showSuccessMessage = ref(false);
const showConfirmDialog = ref(false);
const successMessage = ref('');
const selectedAction = ref('');
const showFormModal = ref(false); // State for showing the form modal

// Nov15
const handleTakeAction = async () => {
    const userType = localStorage.getItem('u_type'); // Retrieve the user type

    if (userType === 'shelter') {
        // Confirm rescue action for shelter
        await confirmAction();
    } else if (userType === 'buddy') {
        // Show the form modal instead of redirecting
        showFormModal.value = true; // Open the modal
    }
};
// Nov15 end of new added line

const handleAction = (action) => {
    selectedAction.value = action;
    showRescueCancelButtons.value = false;
    // showConfirmDialog.value = true; Nov15 comment line Not in Salpocial changes - joey
    if (action === 'Rescued') { // Nov15
        showFormModal.value = true; // Open the modal
    } else {
        showConfirmDialog.value = true;
    }
};

const confirmAction = async () => { //upon click

    try {
        const response = await axios.post('http://localhost:5000/accept-report', {
            post_id: props.postId,
            shelter_id: localStorage.getItem('c_id')
        });

        if (response.data.success) {
            retrieveMessage()
            showConfirmDialog.value = false;
            emit('statusUpdated'); // Nov15
            emit('close'); // Nov15
        }
        // emit('statusUpdated'); Nov15 comment line Salpocial changes
    } catch (error) {
        console.error('Error:', error);
        // Handle error (show error message)
    }
};

// const confirmRescued = async () => { //rescued => yes // Nov15 comment line Not in Salpocial changes - joey
//     try {
//         const response = await axios.post('http://localhost:5000/confirmRescue', {
//             post_id: props.postId,
//             shelter_id: localStorage.getItem('c_id')
//         });

//         if (response.data.success) {
//             showConfirmDialog.value = false;
//             emit('statusUpdated');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         // Handle error (show error message)
//     }
// }

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
// Nov15 Not in salpocials change mabye jeneh?? - joey
const receiverId = ref(null)
const userFullName = ref(null)
const currentUser_id = localStorage.getItem('u_id')
const getUserFullName = async () => {
    try {
        const response = await axios.post("http://localhost:5000/getfullname", {
            id: currentUser_id,
        });

        if (response.data) {
            userFullName.value = response.data[0].full_name; // Adjust based on your API response structure
            console.log(userFullName.value)
        } else {
            console.log("No data received for user full name.");
        }
    } catch (err) {
        console.log("Error fetching user full name:", err);
    }
};
async function retrieveMessage() {
    await getUserFullName()
    if (!selectedChat_id.value) {
        await retrieveChatId(); // Await the creation of a new chat
        // After creating a new chat, selectedChat_id should be set
    }
    const formData = new FormData();
    // const tempurl = [null];

    // files.value.forEach((fileobj) => { //append images
    //     formData.append(`url`, fileobj.file);
    // })

    console.log("retrievemessagehere")
    console.log("props post id",)

    let messageData = [
        ["chat_id", selectedChat_id.value],
        ["user_id", null],
        ["message", `This stray animal report is now handled by ` + userFullName.value],
        ["date", new Date().toISOString()],
        ["post_id", props.postId]
        //     ["sender_name", userFullName],
        //     ["p1_name", userFullName],
        //     ["p2_name", receiverName.value] // Ensure receiverName is set
    ];

    messageData.forEach(([key, value]) => formData.append(key, value));

    // sendMessage(formData)
    sendMessagetoUser(formData)
}
const selectedChat_id = ref(null)
const retrieveChatId = async () => {
    try {
        const response = await axios.post("http://localhost:5000/newchat", {
            senderid: currentUser_id,
            receiverid: receiverId.value
        });

        if (response.data) {
            selectedChat_id.value = response.data[0].chat_id;
            console.log(selectedChat_id.value)


        }
    }
    catch (err) {
        console.log("Error creating new chat:", err);
    }
};
async function sendMessagetoUser(thisformData) {
    for (let pair of thisformData.entries()) {
        console.log("send message to user", pair[0], pair[1]);
    }

    // return
    try {
        const response = await axios.post("http://localhost:5000/sendmessage", thisformData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.data.success) { // true
            console.log("under response", response.data);
        } else {
            console.error("Failed to send message:", response.data.message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}



const cancelAction = () => {
    showConfirmDialog.value = false;
    showRescueCancelButtons.value = true;
};

let button_flag = ref('')
onMounted(() => {
    button_flag.value = props.operation
    receiverId.value = props.reportedUserId
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