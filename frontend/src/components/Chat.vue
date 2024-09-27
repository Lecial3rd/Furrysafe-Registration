<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="msg in messages" :key="msg.id" class="message">
        <strong>{{ msg.sender_id }}:</strong> {{ msg.message }}
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Type your message..."
      class="message-input"
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
      messages: [],
      newMessage: '',
      conversationId: null, // Set the conversation ID based on the current chat
      userId: null, // Replace this with the currently logged-in user's ID
    };
  },
  mounted() {
    // Connect to Socket.io server
    this.socket = io('http://localhost:3000'); // Adjust if using a different URL

    // Listen for incoming messages
    this.socket.on('receive_message', (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      // Send message to the server
      this.socket.emit('send_message', {
        conversation_id: this.conversationId,
        sender_id: this.userId, // Use the current user's ID
        message: this.newMessage,
      });

      // Clear the input field
      this.newMessage = '';
    },
  },
  beforeDestroy() {
    // Disconnect socket when component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
.chat-container {
  border: 1px solid #ccc;
  padding: 10px;
  max-width: 400px;
  margin: auto;
}

.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message-input {
  width: 70%;
  padding: 5px;
}
</style>