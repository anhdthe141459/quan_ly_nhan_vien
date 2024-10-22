const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    ten: {
      type: String,
      require: true,
      unique: true,
    },
    userName: {
      type: String,
      require: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now   
      } 

  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);