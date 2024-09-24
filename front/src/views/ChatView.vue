<template>
  <div>
    <h1>Chat</h1>
    <ChatComponent :userId="userId" :receiverId="receiverId" />
  </div>
</template>

<script>
import ChatComponent from '../components/ChatComponent.vue';

export default {
  components: { ChatComponent },
  data() {
    return {
      userId: this.$route.params.userId,
      receiverId: this.$route.params.receiverId || 1,
    };
  },
};
</script>
