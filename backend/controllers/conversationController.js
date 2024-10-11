const supabase = require('../config/supabase');

// Function to find or create a conversation between two users 
const findOrCreateConversation = async (user1Id, user2Id) => {
  // Check if a conversation already exists between the two users
  const { data: data1, error: error1 } = await supabase
    .from('tbl_conversation')
    .select('*')
    .eq('user1_id', user1Id)
    .eq('user2_id', user2Id);
    
  if (error1) {
    console.error('Error fetching conversation:', error1);
    return null;
  }

  // If a conversation exists, return its id
  if (data1.length > 0) {
    return data1[0].id;
  }

  // This part is similar to the above code but for the second user instead of the first one
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

  // If no conversation exists, create a new one between the two users
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
      .select(`
        id,
        conversation_id,
        sender_id,
        message,
        img_path,
        sent_at,
        tbl_user(user_id, user_email, tbl_user_details(firstname, lastname, mi))
      `)
      .eq('conversation_id', conversationId)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    // Map the sender's name
    data.forEach(message => {
      const { firstname, lastname, mi } = message.tbl_user.tbl_user_details;
      message.senderName = `${firstname} ${mi ? mi + ' ' : ''}${lastname}`;
    });

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
