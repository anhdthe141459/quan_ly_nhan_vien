const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
let refreshTokens = [];
 const generateAccessToken= (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  }

 const generateRefreshToken= (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  }

const loginUser = async(req, res) =>{
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json("Incorrect username");
    }

    if (req.body.password!==user.password) {
      return res.status(404).json("Incorrect password");
    }

    if (user) {
      //Generate access token
      const accessToken = generateAccessToken(user);
      //Generate refresh token
      const refreshToken = generateRefreshToken(user);
      refreshTokens.push(refreshToken);
      //STORE REFRESH TOKEN IN COOKIE
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });
      const { password, ...others } = user._doc;
      res.status(200).json({ ...others, accessToken, refreshToken });
    }
}

const requestRefreshToken= async (req, res) => {

    //Take refresh token from user
    const refreshToken = req.cookies.refreshToken;
    //Send error if token is not valid
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //create new access token, refresh token and send to user
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure:false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });
  }

  const logOut= async (req, res) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  }

module.exports = {
    loginUser,
    requestRefreshToken,
    logOut
}