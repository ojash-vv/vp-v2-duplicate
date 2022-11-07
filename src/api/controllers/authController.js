// const authModal = require("../modals/authModal");

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // const user = await authModal.login(email, password);
    res.status(200).json({ email, password });
  } catch (error) {
    res.status(400).json({ error: error?.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // const user = await authModal.signup(email, password);
    res.status(200).json({ email, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
};
