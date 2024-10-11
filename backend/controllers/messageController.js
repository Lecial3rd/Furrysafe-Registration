const supabase = require('../config/supabase');
const { findOrCreateConversation } = require('./conversationController');

// Send a message to a conversation
const sendMessage = async (io, senderId, conversationId, message, imgPath = '') => {
  try {
    const { data, error } = await supabase
      .from('tbl_messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          message,
          img_path: imgPath || '',
          sent_at: new Date().toISOString(),
        },
      ])
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // Update last message time in conversation
    await supabase
      .from('tbl_conversation')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Broadcast the message to all connected clients
    io.emit('new_message', {
      conversationId,
      message: data,
    });

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
};