const supabase = require('../config/supabase');
const { findOrCreateConversation } = require('./conversationController');

// Send a message to a conversation
const sendMessage = async (senderId, conversationId, message, imagePath = '') => {
  try {
    const { data, error } = await supabase
      .from('tbl_messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          message,
          img_path: imagePath, // Update this line to match the column name in your table
          sent_at: new Date().toISOString(),
        },
      ])
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    // Update last message time in conversation
    await supabase
      .from('tbl_conversation')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};

module.exports = {
  sendMessage,
};
