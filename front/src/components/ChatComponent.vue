<template>
  <div v-if="user">
    <!-- Chat UI -->
    <div class="chat-box">
      <div ref="messageList" class="messages">
        <!-- Display chat messages -->
        <div v-for="message in filteredMessages" :key="message.chat_id" class="message">
          <strong>{{ message.sender_id === user.id ? 'Me' : 'Other' }}:</strong>
          <span>{{ message.message }}</span>
          <small>{{ formatDate(message.timestamp) }}</small>
        </div>
      </div>
      <div class="input-box">
        <input v-model="newMessage" type="text" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>You must be logged in to access the chat.</p>
  </div>
</template>

<script>
import { supabase, getCurrentUser } from '../supabaseClient';

export default {
  data() {
    return {
      user: null, // Store the current user
      messages: [],
      newMessage: '',
      senderId: null,
      receiverId: 1 // Hardcoded for now, change to dynamic value if needed
    };
  },
  async mounted() {
    // Check if the user is logged in
    const session = await getCurrentUser();
    console.log('User session:', session);
    
    if (!session) {
      // Redirect to login page if not logged in
      this.$router.push({ name: 'Login' });
    } else {
      // User is logged in, proceed to chat
      this.user = session.user;
      this.senderId = session.user.id;
      this.receiverId = this.$route.params.receiverId || 1;
      this.subscribeToMessages(); // Subscribe to real-time messages
      await this.fetchMessages(); // Fetch previous chat messages
    }
  },
  methods: {
    async fetchMessages() {
      const { data, error } = await supabase
        .from('tbl_chat')
        .select('*')
        .or(`(sender_id.eq.${this.senderId},receiver_id.eq.${this.receiverId})`)
        .or(`(sender_id.eq.${this.receiverId},receiver_id.eq.${this.senderId})`)
        .order('timestamp', { ascending: true });

      if (data) {
        this.messages = data;
        console.log('Fetched messages:', data);
      } else {
        console.error("Error fetching messages:", error.message);
      }
    },
    async sendMessage() {
      if (!this.newMessage) return;

      const { error } = await supabase
        .from('tbl_chat')
        .insert([{ sender_id: this.senderId, receiver_id: this.receiverId, message: this.newMessage }]);

      if (!error) {
        this.newMessage = ''; // Clear the input box after sending
        console.log("Message sent successfully");
      } else {
        console.error("Error sending message:", error.message);
      }
    },
    subscribeToMessages() {
      const channel = supabase
        .channel('chat-room')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'tbl_chat' },
          (payload) => {
            this.messages.push(payload.new); // Add new message to chat
            console.log('New message received:', payload.new);
            this.$nextTick(() => {
              this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight; // Scroll to bottom
            });
          }
        )
        .subscribe();
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    }
  },
  computed: {
    filteredMessages() {
      // Only show messages between the logged-in user and the receiver
      return this.messages.filter(
        (message) =>
          (message.sender_id === this.senderId && message.receiver_id === this.receiverId) ||
          (message.sender_id === this.receiverId && message.receiver_id === this.senderId)
      );
    }
  }
};
</script>

<style scoped>
.chat-box {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  border: 1px solid #ddd;
  padding: 10px;
}

.messages {
  height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
}

.input-box {
  display: flex;
}

input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
