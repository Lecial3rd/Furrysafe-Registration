// controllers/userController.js
const supabase = require('../config/supabase');

// Function to get all users except the current user
const getAllUsersExceptCurrent = async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('tbl_user')
      .select(`
        user_id, 
        user_email,
        tbl_user_details(firstname, lastname, mi)
      `)
      .neq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: 'Error fetching users' });
    }

    const users = data.map(user => ({
      id: user.user_id,
      email: user.user_email,
      fullName: `${user.tbl_user_details.firstname} ${user.tbl_user_details.mi ? user.tbl_user_details.mi + ' ' : ''}${user.tbl_user_details.lastname}`,
    }));

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllUsersExceptCurrent };
