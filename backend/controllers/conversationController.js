const supabase = require('../config/supabase');

// Function to find or create a conversation between two users
const findOrCreateConversation = async (user1Id, user2Id) => {
  const { data: data1, error: error1 } = await supabase
    .from('tbl_conversation')
    .select('*')
    .eq('user1_id', user1Id)
    .eq('user2_id', user2Id);

  if (error1) {
    console.error('Error fetching conversation:', error1);
    return null;
  }

  if (data1.length > 0) {
    return data1[0].id;
  }

  const { data: data2, error: error2 } = await supabase
    .from('tbl_conversation')
    .select('*')
    .eq('user1_id', user2Id)
    .eq('user2_id', user1Id);

  if (error2) {
    console.error('Error fetching conversation:', error2);
    return null;
  }

  if (data2.length > 0) {
    return data2[0].id;
  }

  // If no conversation, create one
  const { error: createError } = await supabase
    .from('tbl_conversation')
    .insert([
      {
        user1_id: user1Id,
        user2_id: user2Id,
        last_message_at: new Date().toISOString(),
        status: 'active',
      },
    ]);

  if (createError) {
    console.error('Error creating conversation:', createError);
    return null;
  }

  // Return the id of the newly created conversation
  const { data: convData, error: convError } = await supabase
    .from('tbl_conversation')
    .select('id')
    .eq('user1_id', user1Id)
    .eq('user2_id', user2Id);

  if (convError) {
    console.error('Error fetching conversation id:', convError);
    return null;
  }

  return convData[0].id;
};

// Get messages for a specific conversation
const getMessages = async (conversationId) => {
  try {
    const { data, error } = await supabase
      .from('tbl_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

module.exports = {
  findOrCreateConversation,
  getMessages,
};
