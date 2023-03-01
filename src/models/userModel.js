const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unqiue: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
        type:String,
        enum:["ADMIN","CONTENT MANAGER","VIEWERS"],
        required:true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
