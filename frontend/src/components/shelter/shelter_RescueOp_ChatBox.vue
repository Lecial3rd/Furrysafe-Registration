<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/20/solid";
import { PencilSquareIcon, PhotoIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline"
import axios from 'axios';
import { io } from 'socket.io-client';

import default_avatar from '@/assets/images/buddy_default.jpg'
import viewpostdetials from '@/components/Shelter/shelter_RescueOp_ReportViewdetailsModal.vue';

//Nov20 - Salpocial
import { useRoute } from 'vue-router';
const route = useRoute();
// End one

// Reactive user ID
const user_id = ref(localStorage.getItem('u_id'));
// Other reactive references
const selectedChat_id = ref(null);
const conversations = ref([]);
const createConversation = ref(false); //flagging for ui
const searchValue = ref('');
const searchResults = ref([]);

const newMessage = ref(''); // New message input
const messagesContainer = ref(null); // Reference to the messages container
const lastMessage = ref(null); // For alternative scrolling

let receiverId = ref(null);
let receiverName = ref('');
let userFullName; //user fullname
const url = ref([])

// Selected conversation
const selectedConversation = ref({
    NameFrom: '',
    messages: [],
    timestamp: '',
    lastMessageDate: null,
    profile: ''
});

//socket connections, and routes
const socket = io('http://localhost:5000');
socket.on('connect', () => {
});
socket.on('receive-message', (messageData) => {
    if (messageData.chat_id == selectedChat_id.value) {
        // Append to current conversation
        selectedConversation.value.messages.push(messageData);
        selectedConversation.value.lastMessageDate = new Date(messageData.date);
        scrollToBottom();
        refreshonsend()
    }
    updateConversationsList(messageData);
});

// Fetch all conversations
const fetchInbox = async () => {
    try {
        const response = await axios.post("http://localhost:5000/loadinbox", {
            id: user_id.value,
            // Optionally, include other parameters if needed
        });

        console.log("fetch inbox", response)
        response.data.forEach(chat => {
            let room = chat.chat_id;
            socket.emit('join-chat', room); // Ensure both users emit this to join the room
        });
        // console.log
        if (response.data) {
            // Map conversations to include lastMessageDate
            conversations.value = response.data.map(conversation => ({
                ...conversation,
                lastMessageDate: new Date(conversation.date)
            }));

            if (conversations.value.length > 0) {
                selectConversation(conversations.value[0]);
            }

            // No need to manually sort since we're using a computed property
        } else {
            console.log("No data received.");
        }
    } catch (err) {
        console.log("Error fetching inbox:", err);
    }
};
const updateConversationsList = (messageData) => {
    const conversationIndex = conversations.value.findIndex(conv => conv.chat_id === messageData.chat_id);

    // Determine who is the sender and who is the receiver
    let otherParticipantName;
    if (messageData.p1_name === userFullName) {
        otherParticipantName = messageData.p2_name; // Current user is p1, so p2 is the other participant
    } else {
        otherParticipantName = messageData.p1_name; // Current user is p2, so p1 is the other participant
    }

    if (conversationIndex !== -1) {
        // Update existing conversation's lastMessageDate and last message
        conversations.value[conversationIndex].lastMessageDate = new Date(messageData.date);
        conversations.value[conversationIndex].message = messageData.message; // Update last message snippet
        conversations.value[conversationIndex].other_participant_name = otherParticipantName;

        // Move the updated conversation to the top
        const updatedConversation = conversations.value.splice(conversationIndex, 1)[0];
        conversations.value.unshift(updatedConversation);
    } else {
        // Add a new conversation if it doesn't exist
        conversations.value.unshift({
            chat_id: messageData.chat_id,
            other_participant_name: otherParticipantName, // Set receiver's name
            message: messageData.message,
            date: messageData.date,
            lastMessageDate: new Date(messageData.date)
        });
    }
};
// Select a conversation
const selectConversation = async (conversation) => {
    receiverName.value = conversation.other_participant_name || conversation.p2_name
    receiverId.value = conversation.user_id || conversation.p2_id; // Set the receiver ID from the conversation - Edited By Salpocial
    // Nov20 comment receiverId.value = null; // Corrected spelling

    if (!conversation || !conversation.chat_id) {
        return;
    }
    selectedChat_id.value = conversation.chat_id;

    let room = selectedChat_id.value;
    socket.emit('join-chat', room); // Ensure both users emit this to join the room

    try {
        // Fetch messages for the selected chat
        const response = await axios.post("http://localhost:5000/loadinbox", {
            id: user_id.value,
            chat_id: selectedChat_id.value
        });

        if (response.data) {
            selectedConversation.value = {
                NameFrom: receiverName.value,
                messages: response.data, // Array of messages
                photo_url: parsedPhotos(conversation.photo_url),
                timestamp: conversation.date,
                lastMessageDate: new Date(conversation.date),
                profile: response.data[0].profile_url
            };

            console.log("selected convo messages", selectedConversation.value.messages)

            await nextTick(); // Ensure DOM is updated
            scrollToBottom(); // Scroll after messages are loaded
        } else {
            selectedConversation.value = {
                NameFrom: receiverName.value,
                messages: [],
                timestamp: conversation.date,
                lastMessageDate: new Date(conversation.date),
                profile: response.profile_url
            };
            await nextTick(); // Ensure DOM is updated
            scrollToBottom();
        }
    } catch (err) {
        console.log("Error fetching messages:", err);
    }
};
//check here
async function sendMessage(thisformData) {
    // for (let pair of thisformData.entries()) {
    //     console.log("send message", pair[0], pair[1]);
    // }
    if (!newMessage.value) {
        newMessage.value = null;
    }

    // Ensure a chat ID is selected
    if (!selectedChat_id.value) {
        createNewMessage(); // Await the creation of a new chat
        // After creating a new chat, selectedChat_id should be set
    }

    // Proceed to send the message
    try {
        const response = await axios.post("http://localhost:5000/sendmessage", thisformData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log("under response", response.data);
        if (response.data.success) { // true
            createConversation.value = false;

            url.value = response.data.url;

            // console.log(selectedChat_id.value) 45 (new chat id jd)
            let messageData = {
                chat_id: selectedChat_id.value,
                user_id: parseInt(user_id.value),
                message: newMessage.value,
                // photo_url: url.value.join(','), // Changed from 'url' to 'photo_url' and removed space after comma
                date: new Date().toISOString(),
                sender_name: userFullName,
                p1_name: userFullName,
                p2_name: receiverName.value // Ensure receiverName is set
            };

            const date = new Date(messageData.date);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                `${date.getDate().toString().padStart(2, '0')}-` +
                `${date.getFullYear()} ` +
                `${date.getHours().toString().padStart(2, '0')}:` +
                `${date.getMinutes().toString().padStart(2, '0')}`;

            const formattedMessageData = {
                ...messageData,
                date: formattedDate
            };

            // Update local messages for the sender
            selectedConversation.value.messages.push({
                ...formattedMessageData,
                date: new Date(formattedMessageData.date)
            });

            selectedConversation.value.lastMessageDate = new Date(formattedMessageData.date);

            updateConversationsList(formattedMessageData);
            selectConversation(messageData)
            // Emit the message to the receiver
            socket.emit('send-message', formattedMessageData); // Emit the message to the receiver

            newMessage.value = ''; // Clear the input field
            files.value = [];
            scrollToBottom(); // Scroll after sending a new message
            refreshonsend()
        } else {
            console.error("Failed to send message:", response.data.message);
        }
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

const createNewMessage = async () => {
    try {
        const response = await axios.post("http://localhost:5000/newchat", {
            senderid: user_id.value,
            receiverid: receiverId.value
        });

        if (response.data) {
            selectedChat_id.value = response.data[0].chat_id;
            // Join the new chat room
            socket.emit('join-chat', selectedChat_id.value);
            await retrieveMessage(); // Ensure that retrieveMessage is awaited
        }
    }
    catch (err) {
        console.log("Error creating new chat:", err);
    }
};

// Fetch data for search
const fetchData = async (query) => {
    if (!query.trim()) {
        searchResults.value = [];
        return;
    }
    try {
        const response = await axios.post("http://localhost:5000/search", {
            value: searchValue.value
        });
        searchResults.value = response.data;
        console.log('Fetched results:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        searchResults.value = [];
    }
};
// Function to scroll to the bottom of the messages container
const scrollToBottom = async () => {
    await nextTick(); // Wait for DOM updates
    await nextTick(); // Additional wait
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
    // Alternative approach:
    // if (lastMessage.value) {
    //     lastMessage.value.scrollIntoView({ behavior: 'smooth' });
    // }
}

const getUserFullName = async () => {
    try {
        const response = await axios.post("http://localhost:5000/getfullname", {
            id: user_id.value,
        });

        if (response.data) {
            userFullName = response.data.fullName; // Adjust based on your API response structure
            console.log("User full name:", response.data);
        } else {
            console.log("No data received for user full name.");
        }
    } catch (err) {
        console.log("Error fetching user full name:", err);
    }
};

let selectedPost = ref(null)
let posts = ref([])
let _user_id = localStorage.getItem('u_id')
async function retrieveInPorgressReports() {
    try {
        const response = await axios.post("http://localhost:5000/getongoingoperations", {
            _shelter_id: _user_id,
            _status: 'In progress'
        });

        if (response.data && response.data.length > 0) {
            posts.value = response.data
        }
        console.log("Handled value", posts.value)
    }
    catch (err) {
        console.log("error in retrieve operations", err)
    }
}
let rescuedposts = ref([])
async function retrieveRescuedReports() {
    try {
        const response = await axios.post("http://localhost:5000/getongoingoperations", {
            _shelter_id: _user_id,
            _status: 'Rescued'
        });

        if (response.data && response.data.length > 0) {
            rescuedposts.value = response.data
        }
        console.log("Rescued value", posts.value)

    }
    catch (err) {
        console.log("error in retrieve operations", err)
    }
}
let pendingposts = ref([])
async function retrievePendingReports() {
    try {
        const response = await axios.post("http://localhost:5000/getereports", {
            _post_id: selectedPost.value,
            _post_type: -1,
            _report_status: 'Pending' // Nov12 'In progress'  change to 'Pending'
        });

        if (response.data && response.data.length > 0) {
            pendingposts.value = response.data
        }
        console.log("pendingposts value", pendingposts.value)

    }
    catch (err) {
        console.log("error in retrieve operations", err)
    }
}
let selectedPostDetails = ref([])
const selectedPostViewDetailsId = ref(null);
let visible = ref(false)
const toggleModalViewDetails = (id, flag) => {
    // selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    // const foundPost = posts.value.find(post => post.post_id === id);
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? visible.value = false : id;
    let foundPost = null

    console.log("view details", id, flag)
    if (flag == 'rescued') {
        console.log("Rescued?")
        foundPost = rescuedposts.value.find(post => post.post_id === selectedPostViewDetailsId.value);
    }
    else if (flag == 'handled') {
        console.log("Handled?")
        foundPost = posts.value.find(post => post.post_id === selectedPostViewDetailsId.value);
    }
    else {
        console.log("cancelled")
        foundPost = pendingposts.value.find(post => post.post_id === selectedPostViewDetailsId.value);
    }

    if (foundPost) {
        selectedPostDetails.value = foundPost
        console.log("found post", selectedPostDetails.value)
        visible.value = true
    } else { // Nov12 added else
        console.error("Post not found for ID:", id);
    }
};

const fileInput = ref(null);
const files = ref([])
const handleMultipleFileChange = (event) => {
    const filesArray = event.target.files

    for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i]
        const reader = new FileReader()
        reader.onload = (event) => {
            // files.value.push({ source: file.name, url: event.target.result })
            files.value.push({ file: file, url: event.target.result });
        }
        reader.readAsDataURL(file)
    }
}
const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click(); // Accessing the DOM element
    }
};
const removeImage = (index) => {
    files.value.splice(index, 1)
}
async function retrieveMessage() {
    const formData = new FormData();
    const tempurl = [null];

    files.value.forEach((fileobj) => { //append images
        formData.append(`url`, fileobj.file);
    })

    let messageData = [
        ["chat_id", selectedChat_id.value],
        ["user_id", parseInt(user_id.value)],
        ["message", newMessage.value],
        ["date", new Date().toISOString()],
        ["sender_name", userFullName],
        ["p1_name", userFullName],
        ["p2_name", receiverName.value] // Ensure receiverName is set
    ];

    messageData.forEach(([key, value]) => formData.append(key, value));

    // for (let pair of formData.entries()) {
    //     console.log("retrieveMessage", pair[0], pair[1]);
    // }
    sendMessage(formData)
}
const parsedPhotos = (photoUrl) => {
    if (!photoUrl) return [];

    if (Array.isArray(photoUrl)) {
        return photoUrl;
    }

    if (typeof photoUrl === 'string') {
        if (photoUrl.includes(',')) {
            return photoUrl.split(',').map(photo => photo.trim());
        }
        return [photoUrl];
    }

    return [];
};

// SEARCH SUB FUNCTIONS
let timeout;
const handleInput = (value) => { //if user types, send a request to the backend every 500ms 
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        fetchData(value);
    }, 500); // 500ms debounce
};
const handleItemClick = (itemId, name) => {
    searchValue.value = '';
    receiverId.value = itemId;
    receiverName.value = name;
    selectedChat_id.value = null;

    const existingChat = conversations.value.find(chat => chat.other_participant_name === name);
    if (existingChat) {
        selectConversation(existingChat);
        createConversation.value = false;
    } else {
        // If no existing chat, ensure that a new chat will be created when sending a message
        console.log("No existing chat found, will create a new chat when sending a message.");
    }
};

// Computed property for sorted messages
const sortedMessages = computed(() => {
    if (!selectedConversation.value || !selectedConversation.value.messages) {
        return [];
    }
    console.log("sorts", selectedConversation.value)
    return [...selectedConversation.value.messages].sort((a, b) => new Date(a.date) - new Date(b.date));
});
function containsReportedOrHandled(message) {
    const keywords = ['handled', 'rescued', 'withdrawn'];
    const lowerMessage = message.toLowerCase();
    return keywords.find(keyword => lowerMessage.includes(keyword)) || null;
}

// Function to format time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// events
const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        // sendMessage();
        if (!selectedChat_id.value) {
            createNewMessage()
        }
        else {
            retrieveMessage()
        }
    }
};
function closeNewMessage() {
    receiverName.value = null
    receiverId.value = null
}
async function refreshonsend() {
    await fetchInbox()
}

// Watchers
watch(sortedMessages, () => {
    scrollToBottom();
});
watch(searchValue, (newValue) => {
    handleInput(newValue);
});

// onMounted(() => {
//     fetchInbox();
//     getUserFullName();
// });

// Nov20 - Salpocial
const retrieveUserChat = async () => {
    const userIdFromQuery = route.query.shelterUserID;
    console.log("User  ID from Query:", userIdFromQuery);

    if (!userIdFromQuery) return; // Exit early if userId is not present

    try {
        const response = await axios.post("http://localhost:5000/getfullname", {
            id: userIdFromQuery,
        });

        console.log("API Response:", response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
            const [userData] = response.data;

            // Update receiver details
            receiverId.value = userIdFromQuery;
            receiverName.value = userData.full_name;

            console.log("Receiver ID set to:", receiverId.value);
            console.log("Receiver Name set to:", receiverName.value);

            // Find an existing conversation with the receiver
            const existingChat = conversations.value.find(chat =>
                chat.participant_1_id === Number(receiverId.value) ||
                chat.participant_2_id === Number(receiverId.value)
            );

            if (existingChat) {
                console.log("Existing chat found:", existingChat);
                selectConversation(existingChat);
                createConversation.value = false;
            } else {
                console.log("No existing chat found. Preparing new conversation.");
                createConversation.value = true; // Show the new conversation UI
                selectedChat_id.value = null;  // Ensure no chat ID is set for new chat
            }
        } else {
            console.error("Failed to fetch receiver name. Response:", response.data);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

onMounted(async () => {
    await getUserFullName();
    await fetchInbox();
    await retrieveInPorgressReports();
    await retrieveRescuedReports();
    await retrievePendingReports();
    await retrieveUserChat(); // Nov20 - Salpocial
});
</script>


<template>
    <!-- Nov 20 If conversations list is empty, show the "Create New Message" default display - Joey -->
    <div v-if="conversations.length === 0"
        class="flex justify-center items-center sm:h-[calc(100vh-67px)] lg:md:h-[calc(100vh-0px)] mx-4">
        <div v-if="!createConversation" class="p-4 text-center grid grid-flow-row place-items-center container gap-y-4">
            <img width="300" height="300"
                src="https://img.icons8.com/external-nawicon-flat-nawicon/300/external-conversation-communication-nawicon-flat-nawicon-2.png"
                alt="external-conversation-communication-nawicon-flat-nawicon-2" />
            <button @click="createConversation = true">
                <span
                    class="text-gray-500 font-semibold text-base hover:underline hover:underline-offset-4 hover:text-amber-500">
                    Click to Start a Conversation!</span>
            </button>
        </div>
        <div v-if="createConversation"
            class="sm:w-[30rem] xl:w-[70%]  xl:h-[70%] sm:h-[40rem] flex flex-col border rounded-2xl overflow-hidden shadow-md">
            <div v-if="!receiverId" class="flex flex-row w-full gap-x-3 items-center p-8 border-b">
                <span class="text-base font-semibold">To: </span>
                <div class="relative w-full">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute inset-y-2 left-3" aria-hidden="true" />
                    <input id="search" name="search" @input="handleInput(searchValue)" v-model="searchValue"
                        class="block w-full rounded-lg bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        placeholder="Search" type="search" />
                    <!-- Search Results Dropdown -->
                    <ul v-if="searchResults.length > 0"
                        class="absolute bg-white border mt-1 w-full max-h-60 overflow-y-auto">
                        <li v-for="item in searchResults" :key="item.id" class="px-4 py-2 hover:bg-gray-100">
                            <button @click="handleItemClick(item.id, item.name)" class="w-full text-left">
                                {{ item.name }}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else class="relative p-8 border-b">
                <span class="text-base font-semibold flex gap-x-1">To: {{ receiverName }}</span>
            </div>
            <!-- default image -->
            <div class="h-full flex items-center justify-center">
                <img width="300" height="300"
                    src="https://img.icons8.com/external-nawicon-flat-nawicon/300/external-conversation-communication-nawicon-flat-nawicon-2.png"
                    alt="external-conversation-communication-nawicon-flat-nawicon-2" />
            </div>
            <!-- New Conversation Message Input Form -->
            <form @submit.prevent="createNewMessage" class="mt-auto">
                <div v-if="files.length > 0" class="px-4 my-2 mx-2 sm:col-span-2 sm:px-0">
                    <ul role="list"
                        class="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-8">
                        <li v-for="(file, index) in files" :key="file.source" class="relative">
                            <div
                                class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img :src="file.url" alt=""
                                    class="pointer-events-none sm:w-full sm:h-24 lg:w-32 lg:h-32 object-cover" />
                                <button @click.prevent="removeImage(index)"
                                    class="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" class="w-7 h-7">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="mt-auto flex border-t items-center">
                    <div class="flex justify-start w-full">
                        <!-- @click="messagesent=false"  -->
                        <textarea v-model="newMessage" placeholder="Write a message..." @keydown="handleKeyDown"
                            class="w-full px-6 py-6 outline-none resize-none" />

                    </div>
                    <div class="flex px-6 gap-x-3 justify-end">
                        <div>
                            <input type="file" ref="fileInput" multiple class="hidden"
                                @change="handleMultipleFileChange" />
                            <PhotoIcon class="h-7 w-7 text-gray-700 hover:text-gray-900" aria-hidden="true"
                                @click="triggerFileInput" />
                        </div>
                        <PaperAirplaneIcon @click.prevent="createNewMessage"
                            class="h-7 w-7 text-gray-700 hover:text-gray-900" aria-hidden="true" />
                    </div>
                </div>
            </form>
        </div>
    </div>

    <div v-else class="flex sm:h-[calc(100vh-67px)] lg:md:h-[calc(100vh-0px)] ">
        <!-- Conversations Sidebar -->
        <!-- responsive text by color sm:bg-red-400 md:bg-blue-400 lg:bg-orange-400 xl:bg-green-400 -->
        <div class="sm:w-[20%] xl:w-[30%] border-r-2 text-gray-600 flex-1">
            <div class="py-4 mt-4 md:mx-6 flex items-center sm:gap-x-2 sm:justify-center md:justify-between">
                <span class="sm:text-base md:text-xl font-bold sm:hidden md:block">CHAT</span>
                <!-- Nov20 added v-if="conversations.length > 0" - Joey -->
                <button v-if="conversations.length > 0" @click="createConversation = true">
                    <PencilSquareIcon class="h-8 w-8 text-gray-500 sm:w-[7rem] md:w-fit hover:text-gray-900" />
                </button>
            </div>
            <!-- <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input id="search" name="search" @input="handleInput(searchValue)" v-model="searchValue"
                    class="block w-full rounded-lg bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                    placeholder="Search" type="search" />
                 Search Results Dropdown
                <ul v-if="searchResults.length > 0"  @input="handleInput(searchValue)"
                    class="absolute bg-white border mt-1 w-full max-h-60 overflow-y-auto">
                    <li v-for="item in searchResults" :key="item.id" class="px-4 py-2 hover:bg-gray-100">
                        <button @click="handleItemClick(item.id, item.name)" class="w-full text-left">
                            {{ item.name }}
                        </button>
                    </li>
                </ul>
            </div> -->
            <div class="py-4 overflow-y-auto">
                <!-- <div class="mb-2 flex justify-between items-center">
                    <span class="text-md font-semibold">Inbox</span>
                    <button @click="createConversation = true">
                        <PencilSquareIcon class="h-6 w-6 text-gray-500" />
                    </button>
                </div> -->

                <div class="overflow-hidden">
                    <!-- Create New Conversation Section -->
                    <div v-if="createConversation">
                        <div class="bgorange border-t p-4 m-2 rounded px-4 cursor-pointer hover:bg-lightorange group">
                            <div class="flex justify-between items-center font-medium text-sm truncate text-white">
                                <span v-if="!receiverId" class="truncate">New Message</span>
                                <span v-else class="truncate">New Message to {{ receiverName }}</span>
                                <button @click="closeNewMessage(); createConversation = false" type="button">
                                    <XMarkIcon class="h-6 w-6 text-white hidden group-hover:block" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Conversations List -->
                    <!-- <div v-for="(conversation, index) in conversations" :key="conversation.chat_id"
                        @click="createConversation = false; selectConversation(conversation)"
                        class="border-t p-2 px-4 cursor-pointer hover:bg-gray-50"
                        :class="{ 'bg-gray-100': conversation.chat_id === selectedChat_id }"> -->
                    <!-- Changed from selectedConversation?.chat_id to selectedChat_id -->
                    <!-- <div class="flex justify-between">
                            <span class="font-medium truncate">{{ conversation.other_participant_name }}</span>
                            <span class="text-[12px] sm:hidden xl:flex">{{ formatTime(conversation.date) }}</span>
                        </div>
                        <p class="text-sm truncate">{{ conversation.message }}</p>
                    </div> -->

                    <!-- Nov 20 If conversations list is empty, show the "Create New Message" default display - Joey -->
                    <!-- <div v-if="conversations.length === 0"
                        class="p-4 text-center grid grid-flow-row place-content-center gap-y-4">
                        <img width="200" height="200"
                            src="https://img.icons8.com/external-nawicon-flat-nawicon/200/external-conversation-communication-nawicon-flat-nawicon-2.png"
                            alt="external-conversation-communication-nawicon-flat-nawicon-2" />
                        <button @click="createConversation = true">
                            <span class="text-gray-500 font-semibold text-base hover:underline hover:underline-offset-4 hover:text-amber-500">Create New Message</span>
                        </button>
                    </div> -->
                    <!-- Nov15 -joey styling list large screen-->
                    <div v-for="(conversation, index) in conversations" :key="conversation.chat_id"
                        @click="createConversation = false; selectConversation(conversation)"
                        class="border-t p-2 px-4 cursor-pointer hover:bg-gray-50 sm:hidden xl:block xl:px-8"
                        :class="{ 'bg-gray-100': conversation.chat_id === selectedChat_id }">
                        <div class="flex justify-between">
                            <div class="grid grid-cols-[40px_1fr] items-center gap-x-2">
                                <img :src="conversation.profile_url || default_avatar" alt="profile"
                                    class="w-10 h-10 object-cover border bg-gray-50 rounded-full">
                                <span class="font-medium truncate">{{ conversation.other_participant_name }}</span>
                            </div>
                            <span class="text-[12px] sm:hidden lg:flex">{{ formatTime(conversation.date) }}</span>
                        </div>
                        <div v-if="conversation.message?.includes('https')">
                            <div v-if="conversation.user_id == user_id">
                                <p> You sent a photo.</p>
                            </div>
                            <div v-else>
                                <p> {{ conversation.other_participant_name }} sent a photo.</p>
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="conversation.user_id == user_id" class="flex justify-between">
                                <p class="text-sm truncate">You: {{ conversation.message }}</p>
                                <!-- <span class="text-[12px] sm:hidden lg:flex">{{ formatTime(conversation.date) }}</span> -->
                            </div>
                            <div v-else-if="conversation.user_id == null" class="flex justify-between items-center">
                                <p class="text-sm truncate">{{
                                    conversation.message }}</p>
                                <!-- <span class="text-[12px] sm:hidden lg:flex text-right">{{ formatTime(conversation.date)
                                    }}</span> -->
                            </div>
                            <div v-else>
                                <p class="text-sm truncate">{{ conversation.other_participant_name }}: {{
                                    conversation.message }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- List on small screen profile only -->
                    <div v-for="(conversation, index) in conversations" :key="conversation.chat_id"
                        @click="createConversation = false; selectConversation(conversation)"
                        class="border-t p-4 cursor-pointer hover:bg-gray-50 sm:block xl:hidden"
                        :class="{ 'bg-gray-100': conversation.chat_id === selectedChat_id }">
                        <div class="flex justify-center">
                            <div class="flex items-center gap-x-2">
                                <img :src="conversation.profile_url || default_avatar" alt="profile"
                                    class="w-14 h-14 object-cover border bg-gray-50 rounded-full">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chat Area -->
        <div v-if="!createConversation" class="sm:w-[80%] xl:w-[70%] flex flex-col">
            <!-- Chat Header -->
            <!-- <div class="text-gray-600 bg-white p-4 flex gap-x-2 items-center">
                <span class="text-md font-semibold">{{ selectedConversation?.NameFrom }}</span>
                dsa <span class="text-sm font-medium border rounded-xl px-2">badge</span> dsads
            </div> -->

            <div class="flex items-center gap-x-2 p-4 border-b">
                <img :src="selectedConversation?.profile || default_avatar" alt="profile image"
                    class="w-10 h-10 object-cover border bg-gray-50 rounded-full">
                <!-- here jeneh put :scr="" sa <img> -->
                <span class="text-lg font-semibold">{{ selectedConversation?.NameFrom }} </span>

            </div>

            <!-- Messages Display -->
            <div ref="messagesContainer" class="messages-container flex-1 overflow-y-auto p-4 bg-gray-50">
                <div v-for="(message, messageIndex) in sortedMessages" :key="messageIndex" class="message">
                    <!-- Outgoing Messages (Sent by Current User) -->
                    <div v-if="message.user_id == user_id" class="flex text-sm text-gray-600 p-3 justify-end">
                        <div class="text-sm text-gray-600">
                            <!-- <div class="text-right">
                                <span class="font-medium">You</span>
                                <span class="text-[10px] ml-2">{{ formatTime(message.date) }}</span>
                            </div> -->
                            <div v-if="message.message?.includes('https')">
                                <div>
                                    <img :src="message.message" alt=""
                                        class="pointer-events-none sm:w-60 md:w-80 object-contain border rounded-lg">
                                </div>
                            </div>
                            <div v-else="message.message"
                                class="mt-1 bg-teal-200 px-4 py-2 rounded-t-2xl rounded-l-2xl ">
                                <p>{{ message.message }} </p>
                            </div>
                            <span class="text-[10px] flex justify-end">{{ formatTime(message.date) }}</span>
                        </div>
                    </div>

                    <!-- Incomming message sent by the system -->
                    <div v-else-if="message.user_id == null" class="flex justify-center mb-2 border-y">
                        <div class="text-sm text-gray-600 p-3">
                            <p>
                                <!-- Check if message contains "rescued" or "handled" -->
                                <span v-if="containsReportedOrHandled(message.message) === 'rescued'"
                                    @click="toggleModalViewDetails(message.this_post_id, 'rescued')"
                                    class="cursor-pointer text-green-600">
                                    {{ message.message }} </span>
                                <span v-else-if="containsReportedOrHandled(message.message) === 'handled'"
                                    @click="toggleModalViewDetails(message.this_post_id, 'handled')"
                                    class="text-teal-500">
                                    {{ message.message }} </span>
                                <span v-else class="cursor-pointer text-red-500"
                                    @click="toggleModalViewDetails(message.this_post_id, 'withdrawn')">
                                    {{ message.message }}
                                </span>
                            </p>

                            <viewpostdetials v-if="visible" :selectedPostDetails="selectedPostDetails"
                                @close="toggleModalViewDetails(message.this_post_id)" />
                        </div>
                    </div>

                    <!-- Incoming Messages (Sent by Other Participant) -->
                    <div v-else class="flex flex-col justify-start m-4 mb-2 gap-y-1">
                        <div class="text-sm text-gray-600 flex gap-x-2">
                            <!-- <div class="text-left flex items-center gapx">
                                <span class="font-medium">{{ selectedConversation?.NameFrom }}</span>
                                <span class="text-[10px] ml-2">{{ formatTime(message.date) }}</span>
                            </div> -->
                            <div class="flex items-end">
                                <img :src="selectedConversation?.profile || default_avatar" alt="profile image"
                                    class="w-8 h-8 object-cover border bg-gray-50 rounded-full">
                            </div>
                            <div>
                                <div v-if="message.message?.includes('https')">
                                    <div>
                                        <img :src="message.message" alt=""
                                            class="pointer-events-none sm:w-60 md:w-80 object-contain border rounded-lg">
                                    </div>
                                </div>
                                <div v-else="message.message"
                                    class="mt-1 bg-gray-200 px-4 py-2 rounded-t-2xl rounded-r-2xl text-gray-900">
                                    <p>{{ message.message }} </p>
                                </div>
                            </div>
                        </div>
                        <span class="text-[10px] ml-11">{{ formatTime(message.date) }}</span>
                    </div>

                    <!-- Optional: Add a ref to the last message for alternative scrolling -->
                    <div v-if="messageIndex === sortedMessages.length - 1" ref="lastMessage"></div>
                </div>
            </div>

            <!-- Message Input Form -->
            <form @submit.prevent="retrieveMessage">
                
                <!-- Nov15 -->
                <div v-if="files.length > 0" class="px-4 my-2 mx-2 sm:col-span-2 sm:px-0">
                    <ul role="list"
                        class="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-8">
                        <li v-for="(file, index) in files" :key="file.source" class="relative">
                            <div
                                class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img :src="file.url" alt=""
                                    class="pointer-events-none sm:w-full sm:h-24 lg:w-32 lg:h-32 object-cover" />
                                <button @click.prevent="removeImage(index)"
                                    class="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" class="w-7 h-7">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="mt-auto flex border items-center">
                    <div class="flex justify-start w-full">
                        <!-- @click="messagesent=false"  -->
                        <textarea v-model="newMessage" placeholder="Write a message..." @keydown="handleKeyDown"
                            class="w-full px-6 py-6 outline-none resize-none" />
                    </div>
                    <div class="flex px-6 gap-x-3 justify-end">
                        <div>
                            <input type="file" ref="fileInput" multiple class="hidden"
                                @change="handleMultipleFileChange" />
                            <!-- <PaperClipIcon class="h-7 w-7 text-gray-400" aria-hidden="true" @click="triggerFileInput" /> -->
                            <PhotoIcon class="h-7 w-7 text-gray-700 hover:text-gray-900" aria-hidden="true"
                                @click="triggerFileInput" />
                        </div>
                        <PaperAirplaneIcon @click.prevent="retrieveMessage"
                            class="h-7 w-7 text-gray-700 hover:text-gray-900" aria-hidden="true" />
                    </div>
                </div>
                <!-- <div class="px-4 sm:col-span-2 sm:px-0">
                    <ul role="list"
                        class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                        <li v-for="(file, index) in files" :key="file.source" class="relative">
                            <div
                                class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img :src="file.url" alt="" class="pointer-events-none h-20 w-20 object-cover" />
                                <button @click="removeImage(index)"
                                    class="absolute top-0 right-0 p-1 text-gray-600 hover:text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div> -->
            </form>
        </div>

        <!-- New Conversation Area -->
        <div v-if="createConversation" class="w-[70%] flex flex-col border-r-2">
            <!-- New Conversation Header -->
            <div v-if="!receiverId" class="flex flex-row w-full gap-x-3 items-center p-8">
                <span class="text-base font-semibold">To: </span>
                <div class="relative w-full">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute inset-y-2 left-3" aria-hidden="true" />
                    <input id="search" name="search" @input="handleInput(searchValue)" v-model="searchValue"
                        class="block w-full rounded-lg bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                        placeholder="Search" type="search" />
                    <!-- Search Results Dropdown -->
                    <ul v-if="searchResults.length > 0"
                        class="absolute bg-white border mt-1 w-full max-h-60 overflow-y-auto">
                        <li v-for="item in searchResults" :key="item.id" class="px-4 py-2 hover:bg-gray-100">
                            <button @click="handleItemClick(item.id, item.name)" class="w-full text-left">
                                {{ item.name }}
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div v-else class="relative p-8">
                <span class="text-base font-semibold flex gap-x-1">To: {{ receiverName }}</span>
            </div>
            <!-- Nov16 Comment - Joey changes New Conversation Header
            <div class="text-gray-600 bg-white p-4 gap-x-2 items-center flex">
                <span class="text-md font-semibold">
                    <span>To: </span>
                    <div v-if="!receiverId" class="relative bg-red-400 w-full">
                        <span>To: </span>
                        <div class=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input id="search" name="search" @input="handleInput(searchValue)" v-model="searchValue"
                            class="block w-full rounded-lg bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                            placeholder="Search" type="search" />
                        Search Results Dropdown
                        <ul v-if="searchResults.length > 0"
                            class="absolute bg-white border mt-1 w-full max-h-60 overflow-y-auto">
                            <li v-for="item in searchResults" :key="item.id" class="px-4 py-2 hover:bg-gray-100">
                                <button @click="handleItemClick(item.id, item.name)" class="w-full text-left">
                                    {{ item.name }}
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div v-else class="relative">
                        <span>To: {{ receiverName }}</span>
                    </div>
                </span>
            </div> -->

            <!-- New Conversation Messages (if any) -->
            <div class="flex-1 overflow-y-auto px-4 bg-gray-50">
                <!-- Implement if needed -->
            </div>

            <!-- New Conversation Message Input Form -->
            <form @submit.prevent="createNewMessage">
                <div v-if="files.length > 0" class="px-4 my-2 mx-2 sm:col-span-2 sm:px-0">
                    <ul role="list"
                        class="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-x-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-8">
                        <li v-for="(file, index) in files" :key="file.source" class="relative">
                            <div
                                class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-md bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img :src="file.url" alt=""
                                    class="pointer-events-none sm:w-full sm:h-24 lg:w-32 lg:h-32 object-cover" />
                                <button @click.prevent="removeImage(index)"
                                    class="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" class="w-7 h-7">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="mt-auto flex border items-center">
                    <div class="flex justify-start w-full">
                        <!-- @click="messagesent=false"  -->
                        <textarea v-model="newMessage" placeholder="Write a message..." @keydown="handleKeyDown"
                            class="w-full px-6 py-6 outline-none resize-none" />

                    </div>
                    <div class="flex px-6 gap-x-3 justify-end">
                        <div>
                            <input type="file" ref="fileInput" multiple class="hidden"
                                @change="handleMultipleFileChange" />
                            <!-- <PaperClipIcon class="h-7 w-7 text-gray-400" aria-hidden="true" @click="triggerFileInput" /> -->

                            <PhotoIcon class="h-7 w-7 text-gray-700 hover:text-gray-900" aria-hidden="true"
                                @click="triggerFileInput" />
                        </div>
                        <PaperAirplaneIcon @click.prevent="createNewMessage"
                            class="h-7 w-7 text-gray-700 hover:text-gray-900" aria-hidden="true" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
