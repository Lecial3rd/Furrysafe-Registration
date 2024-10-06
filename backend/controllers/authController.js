const supabase = require('../config/supabase');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user with their details (email, password, first name, etc.)
    const { data, error } = await supabase
      .from('tbl_user')
      .select(`
        user_id, 
        user_email, 
        user_password,
        tbl_user_details(firstname, lastname, mi)
      `)
      .eq('user_email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (data.user_password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { firstname, lastname, mi } = data.tbl_user_details;

    // Save full name in the response
    res.json({
      user_id: data.user_id,
      email: data.user_email,
      fullname: `${firstname} ${mi ? mi + ' ' : ''}${lastname}`, // Display full name
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login };
