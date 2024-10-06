<template>
  <div class="chat-container">
    <!-- Sidebar for online users -->
    <div class="sidebar">
      <div class="app-title">Chat App</div>
      <div class="user-info">
        <h2>Welcome {{ userFullName }}</h2>
      </div>
      <div class="users">
        <h3 class="users-label">Online Users</h3>
        <ul>
          <li v-for="user in onlineUsers" :key="user.id" class="user" @click="joinConversation(user)">
            {{ user.fullName }}
          </li>
        </ul>``
      </div>
    </div>

    <!-- Chat Area -->
    <div class="chat-area">
      <!-- Chat header with the current user -->
      <div class="header" v-if="currentChatUser">
        <h3>Chat with {{ currentChatUser.fullName }}</h3>
      </div>

      <!-- Messages area -->
      <div class="messages">
        <div v-for="message in messages" :key="message.id" :class="['message', message.sender_id === loggedInUserId ? 'message-sent' : 'message-received']">
          <p>
            <span class="sender">{{ message.sender_id === loggedInUserId ? 'You' : currentChatUser.fullName }}</span>:
            {{ message.message }}
          </p>
        </div>
      </div>

      <!-- Input area for sending messages -->
      <div class="input-area" v-if="currentChatUser">
        <input v-model="messageText" class="message-input" placeholder="Type a message"> 
        <button class="send-btn" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

export default {
  setup() {
    const socket = io('http://localhost:3000');
    const userFullName = ref('');
    const onlineUsers = ref([]);
    const currentChatUser = ref(null);
    const conversationId = ref(null);
    const messages = ref([]);
    const messageText = ref('');
    const loggedInUserId = ref(sessionStorage.getItem('user_id')); // Initialize with user_id from session storage

    // Fetch all users except the logged-in user
    onMounted(async () => {
      const response = await fetch(`http://localhost:3000/users/${loggedInUserId.value}`);
      const users = await response.json();
      onlineUsers.value = users;

      socket.emit('get_online_users');
      socket.on('online_users', (users) => {
        onlineUsers.value = users;
      });

      userFullName.value = sessionStorage.getItem('user_fullname');
    });

    const fetchMessages = async (convId) => {
      const response = await fetch(`http://localhost:3000/conversations/${convId}/messages`);
      messages.value = await response.json();
    };

    const joinConversation = async (user) => {
      const response = await fetch(`http://localhost:3000/conversations/find-or-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user1Id: loggedInUserId.value,
          user2Id: user.id,
        }),
      });

      const { conversationId: convId } = await response.json();
      conversationId.value = convId;
      currentChatUser.value = user;

      fetchMessages(convId);
    };

    const sendMessage = async () => {
      if (!messageText.value) return;

      const response = await fetch('http://localhost:3000/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: loggedInUserId.value,
          conversationId: conversationId.value,
          message: messageText.value,
        }),
      });

      const newMessage = await response.json();
      messages.value.push(newMessage); // Update messages state
      messageText.value = ''; // Clear input field
      fetchMessages(conversationId.value); // Fetch messages again to update state
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
      }
    };

    return {
      userFullName,
      onlineUsers,
      currentChatUser,
      conversationId,
      messages,
      messageText,
      joinConversation,
      sendMessage,
      handleKeyDown,
    };
  },
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
}

.chat-container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 25%;
  background-color: #007BFF;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changed to align items at the start */
}

.app-title {
  font-size: 1.5em;
  margin-bottom: 20px;
}

.user-info {
  margin-bottom: 20px; /* Space between title and welcome message */
}

.user:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.users {
  margin-top: 20px; /* Space between welcome message and users list */
}

.users-label {
  font-size: 20px;
  font-weight: bold;
}

.user {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 5px 0;
  cursor: pointer;
  border-radius: 5px;
}

.chat-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header {
  background-color: #007BFF;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}

.messages {
  flex: 1;
  padding: 20px;
  background-color: #f1f1f1;
  overflow-y: auto;
}

.message {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-sent {
  background-color: #007BFF;
  color: white;
  align-self: flex-end;
}

.message-received {
  background-color: #f1f1f1;
  align-self: flex-start;
}

.sender {
  font-weight: bold;
  color: #007BFF;
}

.input-area {
  background-color: #007BFF;
  padding: 15px;
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}

.send-btn {
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
