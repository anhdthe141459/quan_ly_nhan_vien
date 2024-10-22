const authService = require('../services/auth.service');

const loginUser = async (req,res) =>{
    try {
        await authService.loginUser(req,res);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const requestRefreshToken = async (req,res) =>{
    try {
        await authService.requestRefreshToken(req,res);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
const logOut = async (req,res) =>{
  try {
      await authService.logOut(req,res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

module.exports = {
    loginUser,
    requestRefreshToken,
    logOut
}