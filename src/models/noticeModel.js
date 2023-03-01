const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const NoticeSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      userId: {
        type:ObjectId,
        required:true, 
        refs:'User'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", NoticeSchema);
