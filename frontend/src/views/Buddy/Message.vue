<script setup>
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
</script>

<template>
  <div class="flex h-screen bg-white">
      <!-- Left Sidebar -->
      <div class="w-64 border-r">
          <div class="p-4">
              <div class="flex space-x-[60%]">
                  <h1 class="text-xl font-bold mb-4">CHAT</h1>
                  <button class="pb-6 opacity-50" @click="toggleModal">
                      <svg fill="none" height="28" viewBox="0 0 24 24" width="28" xmlns="http://www.w3.org/2000/svg">
                          <g stroke="#141b34" stroke-width="1.5">
                              <path d="m12 8v8m4-4h-8" stroke-linecap="round" stroke-linejoin="round"/>
                              <path d="m2.5 12c0-4.47834 0-6.71751 1.39124-8.10876 1.39125-1.39124 3.63042-1.39124 8.10876-1.39124 4.4783 0 6.7175 0 8.1088 1.39124 1.3912 1.39125 1.3912 3.63042 1.3912 8.10876 0 4.4783 0 6.7175-1.3912 8.1088-1.3913 1.3912-3.6305 1.3912-8.1088 1.3912-4.47834 0-6.71751 0-8.10876-1.3912-1.39124-1.3913-1.39124-3.6305-1.39124-8.1088z"/>
                          </g>
                      </svg>
                  </button>
              </div>
              <div class="relative">
                  <input type="text" placeholder="Search Names" class="w-full pl-8 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">  
              </div>
          </div>
          <div v-if="showNewMessage" class="border-b p-4 bg-gray-200 mx-2">
              <div class="flex space-x-8">
                  <p class="text-sm mx-5 font-semibold">New message</p>
                  <button @click="sendMessage" class="p-2 rounded-full text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                  </button>
              </div>
          </div>
          <div class="overflow-y-auto h-[calc(100vh-100px)]">
              <div class="p-4 space-y-4">
                  <div v-for="name in ['June cyril dolenso',]" :key="name" class="flex items-center space-x-4">
                      <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
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

      <!-- Main Chat Area -->
      <div class="flex-1 flex flex-col">
          <div v-if="showNewMessage" class="border-b p-4">
              <input type="text" v-model="newMessage" placeholder="Type your message..." class="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button @click="sendMessage" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
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
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                  </button>
                  <button class="p-2 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
                      </svg>
                  </button>
              </div>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
              <div v-for="(message, index) in messages" :key="index" class="flex items-start space-x-2" :class="{'justify-end': message.isSent}">
                  <div class="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0">
                      <img v-if="message.isSent" :src="require('/src/assets/images/bals.png')" alt="Profile" class="w-8 h-8 rounded-full" />
                      <img v-else src="path/to/placeholder-image.jpg" alt="Placeholder" class="w-8 h-8 rounded-full" />
                  </div>
                  <div>
                      <p :class="{'bg-blue-100': message.isSent, 'bg-gray-100': !message.isSent}" class="rounded-lg p-2 max-w-md">{{ message.text }}</p>
                      <img v-if="message.photo" :src="message.photo" alt="Uploaded photo" class="rounded-lg mt-1 max-w-md" />
                      <p class="text-xs text-gray-500 mt-1">{{ message.time }}</p>
                  </div>
              </div>
          </div>
          <div class="border-t p-4">
              <div class="flex items-center space-x-2">
                  <input type="file" @change="handleFileUpload" accept="image/*" class="hidden" ref="fileInput" />
                  <button @click="triggerFileInput" class="p-2 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                      </svg>
                  </button>
                  <input type="text" v-model="newMessage" placeholder="Type a message here..." class="flex-1 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <button @click="sendMessage" class="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                  </button>
              </div>
          </div>
      </div>

      <!-- Modal -->
      <div v-if="isModalVisible" class="modal">
          <div class="modal-content w-[100rem] h-[30rem]">
              <div class=" align-middle flex">
              <h2 class="text-lg font-semibold pb-2">New message</h2>
              <span @click="toggleModal" class="close cursor-pointer absolute text-2xl text-gray-600">&times;</span>
              </div>
              <!-- List of users -->
                <input type="text" v-model="searchTerm" @input="filterUsers" placeholder="To..." class="p-2 border-gray-400 border-b-[1px]  w-full mb-2">
                  <div class=" user-list">  
                  <div v-if="filteredUsers.length" class="bg-white rounded ">
                      <div v-for="user in filteredUsers" :key="user" @click="selectUser(user)" class="p-2 hover:bg-gray-200 cursor-pointer">
                          {{ user }}
                      </div>
                  </div>
              </div>
              </div><!-- Chat button -->
              <button @click="startChat" class="chat-button object-bottom mt-4 p-1 rounded bg-blue-500 text-white hover:bg-blue-600 w-full">
                  Chat
              </button>
          
      </div>
  </div>
</template>




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
  top: 10px; /* Adjust as needed */
  right: 20px; /* Adjust as needed */
  font-size: 24px; /* Size of the close button */
  color: #141b34; /* Color of the close button */
}

/* Remove glowing effect from input */
input:focus {
  outline: none; /* Remove default outline */
  box-shadow: none; /* Remove any box shadow */
}
</style>