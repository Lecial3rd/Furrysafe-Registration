<!-- <script setup>
import { ref, onMounted, computed, watch, nextTick , reactive} from 'vue';
import { MagnifyingGlassIcon, PaperAirplaneIcon, PaperClipIcon } from "@heroicons/vue/20/solid";
import axios from 'axios';
import { io } from 'socket.io-client';

import default_avatar from '@/assets/images/buddy_default.jpg'

const showNewMessage = ref(false);
const newMessage = ref('');
const uploadedFile = ref(null);
const searchTerm = ref('');
const isModalVisible = ref(false);
const selectedUser = ref('');
const users = ['June Cyril Dolendo', 'afdsafsdafsda', 'afsdafas', 'afsdafsa', 'CAPSTONE : UI | FURSAFE', 'afdsafsad', 'weqrewqrewq', 'zvxczvzvz'];
const filteredUsers = ref([]);
const messages = reactive([]);

function toggleModal() {
  isModalVisible.value = !isModalVisible.value;
}

function toggleNewMessage() {
  showNewMessage.value = !showNewMessage.value;
}

function sendMessage() {
  if (newMessage.value.trim() || uploadedFile.value) {
    const message = {
      text: newMessage.value.trim(),
      photo: uploadedFile.value ? URL.createObjectURL(uploadedFile.value) : null,
      isSent: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messages.push(message);
    newMessage.value = '';
    uploadedFile.value = null;
  }
}

function handleFileUpload(event) {
  uploadedFile.value = event.target.files[0];
}

function triggerFileInput() {
  document.getElementById('fileInput').click();
}

function filterUsers() {
  filteredUsers.value = users.filter(user => user.toLowerCase().includes(searchTerm.value.toLowerCase()));
}

function selectUser(user) {
  searchTerm.value = user;
  filteredUsers.value = [];
}

function startChat() {
  if (selectedUser.value) {
    console.log(`Starting chat with ${selectedUser.value}`);
    toggleModal();
  }
}
</script> -->

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { MagnifyingGlassIcon, PaperAirplaneIcon, PaperClipIcon } from "@heroicons/vue/20/solid";
import axios from 'axios';
import { io } from 'socket.io-client';

import default_avatar from '@/assets/images/buddy_default.jpg'

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
  if (messageData.chat_id === selectedChat_id.value) {
    // Push the message to the array
    selectedConversation.value.messages.push(messageData);

    // Sort messages by date
    selectedConversation.value.messages.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Update lastMessageDate for sorting purposes
    selectedConversation.value.lastMessageDate = new Date(messageData.date);

    scrollToBottom(); // Scroll to bottom after sorting
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
  receiverId.value = null; // Corrected spelling

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

      console.log("selected convo", response.data[0].profile_url)

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
  try {
    const response = await axios.post("http://localhost:5000/sendmessage", thisformData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data.success) {
      let messageData = {
        chat_id: selectedChat_id.value,
        user_id: parseInt(user_id.value),
        message: newMessage.value,
        date: new Date().toISOString(),
        sender_name: userFullName,
        p1_name: userFullName,
        p2_name: receiverName.value
      };

      selectedConversation.value.messages.push(messageData);

      // Sort messages by date after adding the new one
      selectedConversation.value.messages.sort((a, b) => new Date(a.date) - new Date(b.date));

      selectedConversation.value.lastMessageDate = new Date(messageData.date);
      updateConversationsList(messageData);

      // Emit the message to the receiver
      socket.emit('send-message', messageData);

      newMessage.value = ''; // Clear the input field
      files.value = [];
      scrollToBottom(); // Scroll after sorting
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
// const getUserFullName = async () => {
//     try {
//         const response = await axios.post("http://localhost:5000/getfullname", {
//             id: user_id.value,
//         });

//         if (response.data) {
//             userFullName = response.data;
//         } else {
//             console.log("No data received.");
//         }
//     } catch (err) {
//         console.log("Error fetching inbox:", err);
//     }
// }

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

//------------------------------------ this image
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
// --------------------------------- this image functions 
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
// const handleItemClick = (itemId, name) => { // Handle item selection from search
//     searchValue.value = '';
//     receiverId.value = itemId;
//     receiverName.value = name;
//     selectedChat_id.value = null

//     conversations.value.forEach(chat => {
//         if (receiverName.value == chat.other_participant_name) {
//             selectConversation({ chat_id: chat.chat_id })
//             createConversation.value = false
//         }
//         else {
//             console.log("else")
//         }
//     });
// };
const isModalVisible = ref(false);
function toggleModal() {
  isModalVisible.value = !isModalVisible.value;
}

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
  return [...selectedConversation.value.messages].sort((a, b) => new Date(a.date) - new Date(b.date));
});

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
onMounted(async () => {
  await getUserFullName();
  await fetchInbox();
});
</script>

<template>
  <div class="flex sm:h-[52rem] lg:h-screen  overflow-y-hidden">
    <div class="w-[30%] border-r-2 text-gray-600 pr-6 flex-1">

      <div class="py-4">
        <div class="p-4">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-xl font-bold">CHAT</h1>
            <button class="opacity-50" @click="toggleModal">
              <svg @click="createConversation = true" fill="none" height="28" viewBox="0 0 24 24" width="28"
                xmlns="http://www.w3.org/2000/svg">
                <g stroke="#141b34" stroke-width="1.5">
                  <path d="m12 8v8m4-4h-8" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="m2.5 12c0-4.47834 0-6.71751 1.39124-8.10876 1.39125-1.39124 3.63042-1.39124 8.10876-1.39124 4.4783 0 6.7175 0 8.1088 1.39124 1.3912 1.39125 1.3912 3.63042 1.3912 8.10876 0 4.4783 0 6.7175-1.3912 8.1088-1.3913 1.3912-3.6305 1.3912-8.1088 1.3912-4.47834 0-6.71751 0-8.10876-1.3912-1.39124-1.3913-1.39124-3.6305-1.39124-8.1088z" />
                </g>
              </svg>
            </button>
          </div>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" height="20"
              viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <!-- Icon for search (example) -->
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"></circle>
              <line x1="16" y1="16" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              </line>
            </svg>
            <input type="text" placeholder="Search Names"
              class="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          </div>
        </div>


        <div class="overflow-y-auto h-[calc(100vh-200px)]">
          <div v-if="createConversation">
            <div class="bg-gray-200 border-t p-3 mt-1 mb-2 rounded px-4 cursor-pointer hover:bg-gray-300 group">
              <div class="flex justify-between items-center">
                <span v-if="!receiverId" class="font-medium truncate text-gray-800">New Message</span>
                <span v-else class="font-medium truncate text-gray-800">New Message to {{ receiverName }}</span>

                <img width="25" height="25"
                  src="https://img.icons8.com/external-creatype-outline-colourcreatype/64/FFFFFF/external-circle-essential-ui-v1-creatype-outline-colourcreatype-4.png"
                  alt="external-circle-essential-ui-v1-creatype-outline-colourcreatype-4"
                  @click="closeNewMessage(); createConversation = false" class="hidden group-hover:block" />
              </div>
            </div>

          </div>

          <div v-for="(conversation, index) in conversations" :key="conversation.chat_id"
            @click="createConversation = false; selectConversation(conversation)"
            class="border-t p-2 px-4 cursor-pointer hover:bg-gray-50"
            :class="{ 'bg-gray-100': conversation.chat_id === selectedChat_id }">
            <div class="flex justify-between">
              <div class="flex items-center gap-x-2">
                <img :src="conversation.profile_url || default_avatar" alt="profile"
                  class="w-10 h-10 object-cover border bg-red-500 rounded-full">
                <span class="font-medium truncate">{{ conversation.other_participant_name }}</span>
              </div>
              <span class="text-[12px] sm:hidden xl:flex">{{ formatTime(conversation.date) }}</span>
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
              <div v-if="conversation.user_id == user_id">
                <p class="text-sm truncate">You: {{ conversation.message }}</p>
              </div>
              <div v-else>
                <p class="text-sm truncate">{{ conversation.other_participant_name }}: {{
                  conversation.message }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!createConversation" class="w-[70%] flex flex-col border-r-2">

      <div class="flex items-center gap-x-2 p-4 border-b">
        <img :src="selectedConversation?.profile || default_avatar" alt="profile image"
          class="w-10 h-10 object-cover border bg-red-500 rounded-full">
        <span class="text-lg font-semibold">{{ selectedConversation?.NameFrom }} </span>

      </div>

      <div ref="messagesContainer" class="messages-container flex-1 overflow-y-auto px-4 bg-gray-50">
        <div v-for="(message, messageIndex) in sortedMessages" :key="messageIndex" class="message">
          <div v-if="message.user_id == user_id" class="flex text-sm text-gray-600 p-3 justify-end">
            <div class="text-sm text-gray-600 p-3">
              <div class="text-right">
                <span class="font-medium">You</span>
                <span class="text-[10px] ml-2">{{ formatTime(message.date) }}</span>
              </div>
              <div v-if="message.message?.includes('https')">
                <div class="pt-2">
                  <img :src="message.message" alt="" class="pointer-events-none h-60 w-60 object-cover rounded">
                </div>
              </div>
              <div v-else="message.message" class="mt-1 bg-teal-200 px-4 py-2 rounded-t-2xl rounded-l-2xl">
                <p>{{ message.message }} </p>
              </div>
            </div>
          </div>


          <div v-else class="flex justify-start mb-2">
            <div class="text-sm text-gray-600 p-3">
              <div class="text-left">
                <span class="font-medium">{{ selectedConversation?.NameFrom }}</span>
                <span class="text-[10px] ml-2">{{ formatTime(message.date) }}</span>
              </div>
              <div v-if="message.message?.includes('https')">
                <div class="pt-2">
                  <img :src="message.message" alt="" class="pointer-events-none h-60 w-60 object-cover rounded-lg">
                </div>
              </div>
              <div v-else="message.message" class="mt-1 bg-teal-200 px-4 py-2 rounded-t-2xl rounded-r-2xl">
                <p>{{ message.message }} </p>
              </div>
            </div>
          </div>

          <div v-if="messageIndex === sortedMessages.length - 1" ref="lastMessage"></div>
        </div>
      </div>

      <form @submit.prevent="retrieveMessage">
        <div class="mt-auto flex border items-center p-6">
          <!-- <div class="flex justify-start w-full">
            <textarea v-model="newMessage" placeholder="Write a message..." @keydown="handleKeyDown"
              class="w-full px-6 py-6 outline-none resize-none" />
          </div> -->
          <div>
            <input type="file" accept="image/*" ref="fileInput" multiple class="hidden"
              @change="handleMultipleFileChange" />
            <PaperClipIcon class="h-7 w-7 text-gray-400" aria-hidden="true" @click="triggerFileInput" />
          </div>
          <input type="text" v-model="newMessage" placeholder="Type your message..."
            class="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <!-- <button @click="sendMessage" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> -->
          <div class="flex px-6 gap-x-3 justify-end">
            <button class="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center">
              <PaperAirplaneIcon @click.prevent="retrieveMessage" class="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>

        </div>
        <div class="px-4 sm:col-span-2 sm:px-0">
          <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <li v-for="(file, index) in files" :key="file.source" class="relative">
              <div
                class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <img :src="file.url" alt="" class="pointer-events-none h-20 w-20 object-cover" />
                <button @click="removeImage(index)" class="absolute top-0 right-0 p-1 text-gray-600 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </form>
    </div>

    <div v-if="createConversation" class="w-[70%] flex flex-col border-r-2">
      <div class="text-gray-600 bg-white p-4 gap-x-2 items-center flex-col">
        <span class="text-md font-semibold">
          <span>To: </span>
          <div v-if="!receiverId" class="relative">
            <div class=" pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input id="search" name="search" @input="handleInput(searchValue)" v-model="searchValue"
              class="block w-full rounded-lg bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              placeholder="Search" type="search" />

            <ul v-if="searchResults.length > 0" class="absolute bg-white border mt-1 w-full max-h-60 overflow-y-auto">
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
      </div>

      <div class="flex-1 overflow-y-auto px-4 bg-gray-50">
      </div>

      <form @submit.prevent="createNewMessage">
        <div class="mt-auto flex border items-center p-6">
          <!-- <div class="flex justify-start w-full">
            <textarea v-model="newMessage" placeholder="Write a message..." @keydown="handleKeyDown"
              class="w-full px-6 py-6 outline-none resize-none" />
          </div> -->
          <div>
            <input type="file" ref="fileInput" multiple class="hidden" @change="handleMultipleFileChange" />
            <PaperClipIcon class="h-7 w-7 text-gray-400" aria-hidden="true" @click="triggerFileInput" />
          </div>
          <input type="text" v-model="newMessage" placeholder="Type your message..."
            class="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <!-- <button @click="sendMessage" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button> -->
          <div class="flex px-6 gap-x-3 justify-end">
            <button class="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center">
              <PaperAirplaneIcon @click.prevent="retrieveMessage" class="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div class="px-4 sm:col-span-2 sm:px-0">
          <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <li v-for="(file, index) in files" :key="file.source" class="relative">
              <div
                class="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                <img :src="file.url" alt="" class="pointer-events-none h-20 w-20 object-cover" />
                <button @click="removeImage(index)" class="absolute top-0 right-0 p-1 text-gray-600 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </form>
    </div>
  </div>
</template>

<!--<template>
  <div class="flex h-screen bg-white">
    <div class="w-64 border-r">
      <div class="p-4">
        <div class="flex space-x-[60%]">
          <h1 class="text-xl font-bold mb-4">CHAT</h1>
          <button class="pb-6 opacity-50" @click="toggleModal">
            <svg fill="none" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
              <g stroke="#141b34" stroke-width="1.5">
                <path d="m12 8v8m4-4h-8" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="m2.5 12c0-4.47834 0-6.71751 1.39124-8.10876 1.39125-1.39124 3.63042-1.39124 8.10876-1.39124 4.4783 0 6.7175 0 8.1088 1.39124 1.3912 1.39125 1.3912 3.63042 1.3912 8.10876 0 4.4783 0 6.7175-1.3912 8.1088-1.3913 1.3912-3.6305 1.3912-8.1088 1.3912-4.47834 0-6.71751 0-8.10876-1.3912-1.39124-1.3913-1.39124-3.6305-1.39124-8.1088z" />
              </g>
            </svg>
          </button>
        </div>
        <div class="relative">
          <input type="text" placeholder="Search Names"
            class="w-full pl-8 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
      </div>
      <div v-if="showNewMessage" class="border-b p-4 bg-gray-200 mx-2">
        <div class="flex space-x-8">
          <p class="text-sm mx-5 font-semibold">New message</p>
          <button @click="sendMessage" class="p-2 rounded-full text-black">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div class="overflow-y-auto h-[calc(100vh-100px)]">
        <div class="p-4 space-y-4">
          <div v-for="name in ['June cyril dolenso',]" :key="name" class="flex items-center space-x-4">
            <div
              class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
              {{ name.split(' ').map(n => n[0]).join('') }}
            </div>
            <div>
              <p class="text-sm font-medium">{{ name }}</p>
              <p class="text-xs text-gray-500">Last message...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <div v-if="showNewMessage" class="border-b p-4">
        <input type="text" v-model="newMessage" placeholder="Type your message..."
          class="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button @click="sendMessage" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="border-b p-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <div>
            <img :src="require('/src/assets/images/bals.png')" alt="Profile" class="w-9 h-8 rounded-full mr-2">
          </div>
          <h2 class="text-lg font-semibold">Dolens</h2>
        </div>
        <div class="flex space-x-2">
          <button class="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button class="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-for="(message, index) in messages" :key="index" class="flex items-start space-x-2"
          :class="{ 'justify-end': message.isSent }">
          <div class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
            <img v-if="message.isSent" :src="require('/src/assets/images/bals.png')" alt="Profile"
              class="w-8 h-8 rounded-full" />
            <img v-else src="path/to/placeholder-image.jpg" alt="Placeholder" class="w-8 h-8 rounded-full" />
          </div>
          <div>
            <p :class="{ 'bg-blue-100': message.isSent, 'bg-gray-100': !message.isSent }"
              class="rounded-lg p-2 max-w-md">
              {{ message.text }}</p>
            <img v-if="message.photo" :src="message.photo" alt="Uploaded photo" class="rounded-lg mt-1 max-w-md" />
            <p class="text-xs text-gray-500 mt-1">{{ message.time }}</p>
          </div>
        </div>
      </div>
      <div class="border-t p-4">
        <div class="flex items-center space-x-2">
          <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" ref="fileInput" />
          <button @click="triggerFileInput" class="p-2 rounded-full hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input type="text" v-model="newMessage" placeholder="Type a message here..."
            class="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button @click="sendMessage" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template> -->



<style scoped>
.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 600px;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 500px;
  position: relative;
}

.user-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  scrollbar-width: none;
}

.user-list::-webkit-scrollbar {
  display: none;
}

.user-list div {
  text-align: left;
}

.close {
  cursor: pointer;
  float: right;
  font-size: 20px;
}

.chat-button {
  width: 150px;
  padding: 10px;
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
}

/* Close button styling */
.close {
  cursor: pointer;
  position: absolute;
  top: 10px;
  /* Adjust as needed */
  right: 20px;
  /* Adjust as needed */
  font-size: 24px;
  /* Size of the close button */
  color: #141b34;
  /* Color of the close button */
}

/* Remove glowing effect from input */
input:focus {
  outline: none;
  /* Remove default outline */
  box-shadow: none;
  /* Remove any box shadow */
}
</style>