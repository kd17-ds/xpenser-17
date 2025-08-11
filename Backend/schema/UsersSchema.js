const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

UsersSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12); // "this" refers to the current user document being saved.
});

module.exports = { UsersSchema };
