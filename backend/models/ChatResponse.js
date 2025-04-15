const mongoose = require("mongoose");

const ChatResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  responses: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("ChatResponse", ChatResponseSchema);

