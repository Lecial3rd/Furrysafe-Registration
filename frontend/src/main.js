// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:3000'); // Update the URL to your backend server if different

const app = createApp(App);

// Provide the socket globally
app.provide('socket', socket);

app.use(router).mount('#app');
