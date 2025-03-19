const mongoose = require('mongoose'); //mongoose is an object data modeling lib for MongoDB

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });

  /*
mongoose.Schema is a constructor function in Mongoose that defines the structure (blueprint) 
of documents in a MongoDB collection. It specifies what fields exist in the document and their 
data types.
  */

module.exports = mongoose.model("User", UserSchema);