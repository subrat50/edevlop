const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId

const documentSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    userId: {
        type:ObjectId,
        required:true, 
        refs:'User'
    },
    avtar:{
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
