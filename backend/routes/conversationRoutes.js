// routes/conversationRoutes.js
const express = require('express');
const { getMessages, findOrCreateConversation } = require('../controllers/conversationController');
const router = express.Router();

// Get messages for a conversation
router.get('/:conversationId/messages', async (req, res) => {
  const { conversationId } = req.params;
  const messages = await getMessages(conversationId);
  res.json(messages);
});

// Find or create a conversation
router.post('/find-or-create', async (req, res) => {
  const { user1Id, user2Id } = req.body;
  const conversationId = await findOrCreateConversation(user1Id, user2Id);

  if (!conversationId) {
    return res.status(500).json({ error: 'Failed to create or find conversation' });
  }

  res.json({ conversationId });
});

module.exports = router;
