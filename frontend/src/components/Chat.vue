<template>
  <!-- Main chat container -->
  <div class="chat-container">
    <!-- Sidebar for online users -->
    <div class="sidebar">
      <div class="app-title">Chat App</div>
      <div class="user-info">
        <h2>Welcome, {{ userFullName }}</h2> <!-- Displays logged-in user's name -->
      </div>
      <div class="users">
        <h3 class="users-label">Online Users</h3>
        <ul>
          <!-- List of online users; clicking a user opens a conversation -->
          <li v-for="user in onlineUsers" :key="user.id" class="user" @click="joinConversation(user)">
            {{ user.fullName }}
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Chat area for conversation -->
    <div class="chat-area">
      <!-- Chat header, only visible if a user is selected -->
      <div class="header" v-if="currentChatUser">
        <h3>Chat with {{ currentChatUser.fullName }}</h3>
      </div>
      
      <!-- Messages section, displaying chat history -->
      <div class="messages">
        <!-- Loop through messages and display them with appropriate styling based on sender -->
        <div v-for="message in messages" :key="message?.id" :class="['message', message?.sender_id === loggedInUserId ? 'message-sent' : 'message-received']">
          <!-- Display text message with sender's name -->
          <p v-if="message?.message">
            <span :class="['sender', message?.sender_id === loggedInUserId ? 'right' : 'left']">
              {{ message.senderName }}:
            </span>
            {{ message?.message }}
          </p>
          <!-- Display image if message contains an image path -->
          <img v-if="message?.img_path" :src="message?.img_path" alt="Image" class="message-image">
        </div>
      </div>
      
      <!-- Input area for typing and sending messages -->
      <div class="input-area" v-if="currentChatUser">
        <!-- Message input field -->
        <input v-model="messageText" class="message-input" placeholder="Type a message" @keydown="handleKeyDown"> 
        <!-- Image upload button -->
        <input type="file" @change="handleFileUpload" class="image-input" accept="image/*">
        <!-- Send button -->
        <button class="send-btn" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
  
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { io } from 'socket.io-client';
  import { supabase } from '../supabaseClient';
  
  export default {
    setup() {
      // Initialize socket connection
      const socket = io('http://localhost:3000');
      // Vue reactive references for various states
      const userFullName = ref('');
      const onlineUsers = ref([]);
      const currentChatUser = ref(null);
      const conversationId = ref(null);
      const messages = ref([]);
      const messageText = ref('');
      const loggedInUserId = ref(sessionStorage.getItem('user_id')); // Fetch logged-in user's ID
      const selectedFile = ref(null);

      // Fetch online users and listen for new messages on component mount
      onMounted(async () => {
        const response = await fetch(`http://localhost:3000/users/${loggedInUserId.value}`);
        const users = await response.json();
        onlineUsers.value = users;

        // Listen for online users from socket
        socket.emit('get_online_users');
        socket.on('online_users', (users) => {
          onlineUsers.value = users;
        });

        // Listen for new messages and update accordingly
        socket.on('new_message', (data) => {
          if (data.conversationId === conversationId.value) {
            messages.value.push(data.message);
          } else {
            conversationId.value = data.conversationId;
            fetchMessages(conversationId.value);
          }
          fetchMessages(conversationId.value);
        });
        
        // Fetch logged-in user's name from session storage
        userFullName.value = sessionStorage.getItem('user_fullname');
        loggedInUserId.value = sessionStorage.getItem('user_id');
      });

      // Fetch messages for a specific conversation
      const fetchMessages = async (convId) => {
        try {
          const response = await fetch(`http://localhost:3000/conversations/${convId}/messages`);
          const data = await response.json();
  
          if (data.length > 0) {
            // Filter out any null messages
            messages.value = data.filter(message => message !== null);
          } else {
            messages.value = [];
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          messages.value = [];
        }
      };
      
      // Join or create a conversation with the selected user
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
        
        // Retrieve full name from database using Supabase client
        const { data: userData, error: userError } = await supabase
          .from('tbl_user')
          .select('user_id, user_email, tbl_user_details(firstname, lastname, mi)')
          .eq('user_id', user.id);
  
        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }
        
        // Update current chat user with the name
        const { firstname, lastname, mi } = userData[0].tbl_user_details;
        const userName = `${firstname} ${mi ? mi + ' ' : ''}${lastname}`;
        currentChatUser.value = {
          ...currentChatUser.value,
          fullName: userName,
        };
  
        fetchMessages(convId);
      };
            
      // Send a message with optional image attachment
      const sendMessage = async () => {
        if (!messageText.value && !selectedFile.value) return;
  
        let imgPath = '';
        
        // Upload image if file selected for attachment
        if (selectedFile.value) {
          try {
            const fileName = `public/${Date.now()}_${selectedFile.value.name}`;
            const { data, error } = await supabase.storage
              .from('images')
              .upload(fileName, selectedFile.value);
  
            if (error) {
              console.error('Image upload failed:', error.message);
              return;
            }
            
            //iduczfllgzezvjhnjzad.supabase.co is the bucket name in Supabase Cloud Storage
            imgPath = `https://iduczfllgzezvjhnjzad.supabase.co/storage/v1/object/public/images/${fileName}`;
            console.log('Image uploaded successfully:', imgPath);
          } catch (error) {
            console.error('File upload error:', error);
            return;
          }
        }
        
        // Send message through server
        const response = await fetch('http://localhost:3000/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            senderId: loggedInUserId.value,
            conversationId: conversationId.value,
            message: messageText.value,
            imgPath: imgPath || '',
          }),
        });
        
        // Add new message to the list and clear inputs after sending message through server
        const newMessage = await response.json();
        console.log('New message:', newMessage);
  
        socket.emit('new_message', {
          conversationId: conversationId.value,
          message: newMessage,
        });
        
        messages.value.push(newMessage);
        messageText.value = '';
        selectedFile.value = null;
        fetchMessages(conversationId.value);
      };
      
      // Handle "Enter" key press for sending messages
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          sendMessage();
        }
      };

      // Capture file upload event and update selectedFile value
      const handleFileUpload = (event) => {
        selectedFile.value = event.target.files[0];
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
        handleFileUpload,
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
    justify-content: flex-start;
  }
  
  .app-title {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
  
  .user-info {
    margin-bottom: 20px;
  }
  
  .user:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
  
  .users {
    margin-top: 20px;
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
    justify-content: center;
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
    margin-left: auto;
    text-align: right;
  }
  
  .message-received {
    background-color: #f1f1f1;
    align-self: flex-start;
    margin-right: auto;
    text-align: left;
  }
  
  .message-sent .sender {
    float: right;
    text-align: right;
  }
  
  .message-received .sender {
    float: left;
    text-align: left;
  }
  
  .right {
    float: right;
    text-align: right;
  }
  
  .left {
    float: left;
    text-align: left;
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
  
  .image-input {
    margin-right: 10px;
  }
  
  .message-image {
    max-width: 200px;
    max-height: 200px;
    width: auto;
    height: auto;
  }
  </style>
  