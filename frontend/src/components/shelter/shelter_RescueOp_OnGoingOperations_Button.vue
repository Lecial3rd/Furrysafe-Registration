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
            <RescueFillupFormModal v-if="showform" :postId="postId" :reportedUserId="props.reportedUserId"
                :reportDetails="selectedPostDetails" @close="showform = false"
                @statusUpdated="handleAction('Rescued')" /> <!-- Nov12 -->

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
let _user_id = localStorage.getItem('u_id')
async function retrieveReports() {
    try {
        console.log("retrieveReports =)")
        const response = await axios.post("http://localhost:5000/getongoingoperations", {
            _shelter_id: _user_id,
            _status: 'In progress' // Nov12 'Pending' change to 'In progress' 
        });

        if (response.data && response.data.length > 0) {
            posts.value = response.data
        }
        console.log("ongoing operations", posts.value)
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
            _user_id: localStorage.getItem('u_id')
        });

        if (response.data.success) {
            retrieveMessage()
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
            ["message", userFullName.value + ` has withdrawn from handling this stray animal report.`],
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
}
const selectedChat_id = ref(null)
const retrieveChatId = async () => {
    try {
        console.log("new chat", currentUser_id, receiverId.value)
        const response = await axios.post("http://localhost:5000/newchat", {
            senderid: currentUser_id,
            receiverid: receiverId.value
        });

        if (response.data) {
            selectedChat_id.value = response.data[0].chat_id;
            console.log("here fu", selectedChat_id.value)
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

// Nov12 let button_flag = ref('') change to
const button_flag = ref('');
onMounted(async () => {
    await retrieveReports()

    receiverId.value = props.reportedUserId
    button_flag.value = props.operation
    console.log("flag", button_flag.value)
})

</script>